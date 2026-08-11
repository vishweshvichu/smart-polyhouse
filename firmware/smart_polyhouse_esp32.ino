/*
 * =================================================================================
 * SMART POLYHOUSE - ESP32 Firmware Integration
 * Smart Monitoring • Smart Irrigation • Smart Climate Control • Smart Maintenance
 * =================================================================================
 * 
 * HARDWARE PIN CONNECTIONS:
 * - DHT22 Sensor: Pin GPIO 4
 * - Soil Moisture (Capacitive): Pin GPIO 34 (Analog ADC)
 * - Fan Relay: Pin GPIO 27 (ACTIVE LOW)
 * - Water Pump Relay: Pin GPIO 26 (ACTIVE LOW)
 * - OLED SSD1306 (128x64 I2C): SDA GPIO 21, SCL GPIO 22
 * 
 * AUTOMATION & HYSTERESIS LOGIC:
 * - Fan Relay: ON when temp > 31.0°C, OFF when temp < 28.0°C
 * - Pump Relay: ON when soil moisture < 30.0%, OFF when soil moisture > 70.0%
 * - Active Low Relay: HIGH = OFF, LOW = ON
 * - Calibration: AIR_VALUE = 3400 (0%), WATER_VALUE = 1250 (100%)
 * 
 * FIREBASE REALTIME DATABASE TARGET NODE:
 *   /polyhouse/plant_01/live
 *     - temperature (float)
 *     - humidity (float)
 *     - soilMoisture (float)
 *     - fan (bool)
 *     - pump (bool)
 *     - esp32Online (bool)
 *     - timestamp (millis/epoch)
 * =================================================================================
 */

#include <WiFi.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <DHT.h>
#include <Firebase_ESP_Client.h>

// Provide SDK helper info and RTDB payload helpers
#include <addons/RTDBHelper.h>

// ---------------------------------------------------------------------------------
// 1. HARDWARE PIN DEFINITIONS (DO NOT CHANGE EXISTING PINS)
// ---------------------------------------------------------------------------------
#define DHTPIN 4
#define DHTTYPE DHT22

#define SOIL_PIN 34
#define FAN_RELAY_PIN 27
#define PUMP_RELAY_PIN 26

#define OLED_SDA 21
#define OLED_SCL 22
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

// ---------------------------------------------------------------------------------
// 2. CALIBRATION & AUTOMATION THRESHOLDS
// ---------------------------------------------------------------------------------
#define AIR_VALUE 3400
#define WATER_VALUE 1250

#define FAN_TEMP_ON 31.0
#define FAN_TEMP_OFF 28.0

#define PUMP_SOIL_ON 30.0
#define PUMP_SOIL_OFF 70.0

// Active-Low Relay Macros
#define RELAY_ON LOW
#define RELAY_OFF HIGH

// ---------------------------------------------------------------------------------
// 3. WIFI & FIREBASE CONFIGURATION
// ---------------------------------------------------------------------------------
#define WIFI_SSID "YOUR_WIFI_SSID" // Replace with your local Wi-Fi SSID
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD" // Replace with your local Wi-Fi Password

// Firebase Realtime Database URL and Web API Key
#define DATABASE_URL "https://smart-polyhouse-71e66-default-rtdb.firebaseio.com/"
#define API_KEY "AIzaSyC2lUwIpgOwtH2pDqQ71dA38i22ttyMTds"

// Plant Node Identifier
String plantNode = "/polyhouse/plant_01";

// Objects
DHT dht(DHTPIN, DHTTYPE);
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// State Variables
float temperature = 0.0;
float humidity = 0.0;
float soilMoisturePercent = 0.0;
bool fanActive = false;
bool pumpActive = false;

// Time & Maintenance Analytics variables
#include <time.h>
const long gmtOffset_sec = 19800; // India Standard Time (GMT +5:30)
const int daylightOffset_sec = 0;

// Maintenance counters (synchronized from database on startup)
long fanRuntime = 0;
long fanDailyRuntime = 0;
long fanWeeklyRuntime = 0;
long fanActivations = 0;
long fanDailyActivations = 0;
long fanPrevDailyRuntime = 0;
long fanPrevDailyActivations = 0;

long pumpRuntime = 0;
long pumpDailyRuntime = 0;
long pumpWeeklyRuntime = 0;
long pumpActivations = 0;
long pumpDailyActivations = 0;
long pumpPrevDailyRuntime = 0;
long pumpPrevDailyActivations = 0;

// Transition state tracking
bool prevFanActive = false;
bool prevPumpActive = false;

// Rollover day/week markers
int lastDay = -1;
int lastWeek = -1;

// precise runtime trackers
unsigned long lastLoopTime = 0;
unsigned long fanRuntimeMs = 0;
unsigned long pumpRuntimeMs = 0;

// Firebase upload intervals
unsigned long lastFirebaseWriteTime = 0;
const unsigned long FIREBASE_INTERVAL = 3000;      // Telemetry update every 3 seconds

unsigned long lastHistoricalWriteTime = 0;
const unsigned long HISTORICAL_INTERVAL = 300000;  // Pushed historical log every 5 minutes (300,000 ms)

unsigned long lastMaintWriteTime = 0;
const unsigned long MAINT_INTERVAL = 30000;        // Maintenance metrics sync every 30 seconds

// ---------------------------------------------------------------------------------
// SETUP FUNCTION
// ---------------------------------------------------------------------------------
void setup() {
  Serial.begin(115200);

  // Initialize Relay Pins (Default OFF = HIGH)
  pinMode(FAN_RELAY_PIN, OUTPUT);
  pinMode(PUMP_RELAY_PIN, OUTPUT);
  digitalWrite(FAN_RELAY_PIN, RELAY_OFF);
  digitalWrite(PUMP_RELAY_PIN, RELAY_OFF);

  // Initialize Sensors & Display
  Wire.begin(OLED_SDA, OLED_SCL);
  dht.begin();

  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println(F("SSD1306 allocation failed"));
  } else {
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);
    display.setCursor(0, 10);
    display.println("SMART POLYHOUSE");
    display.println("Initializing...");
    display.display();
  }

  // Connect to Wi-Fi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected! IP: " + WiFi.localIP().toString());

  // Configure Firebase
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  config.token_status_callback = tokenStatusCallback;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  // Initialize NTP Time
  configTime(gmtOffset_sec, daylightOffset_sec, "pool.ntp.org");
  Serial.print("Syncing network time (NTP)...");
  struct tm timeinfo;
  int retry = 0;
  while (!getLocalTime(&timeinfo) && retry < 15) {
    delay(500);
    Serial.print(".");
    retry++;
  }
  if (retry < 15) {
    Serial.println("\nTime synced successfully!");
    lastDay = timeinfo.tm_mday;
    lastWeek = timeinfo.tm_yday / 7;
  } else {
    Serial.println("\nTime sync timed out. Using fallback clock.");
  }

  // Fetch initial cumulative maintenance data from database to prevent overwrite resets
  fetchMaintenanceData();
  
  lastLoopTime = millis();
}

// ---------------------------------------------------------------------------------
// MAIN LOOP
// ---------------------------------------------------------------------------------
void loop() {
  // 0. Non-blocking Wi-Fi Reconnection Check
  static unsigned long lastWifiCheck = 0;
  if (WiFi.status() != WL_CONNECTED && (millis() - lastWifiCheck > 10000)) {
    lastWifiCheck = millis();
    Serial.println("Wi-Fi connection lost. Reconnecting...");
    WiFi.disconnect();
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  }

  // 1. READ SENSORS
  float t = dht.readTemperature();
  float h = dht.readHumidity();

  if (!isnan(t)) temperature = t;
  if (!isnan(h)) humidity = h;

  int analogSoil = analogRead(SOIL_PIN);
  int constrainedAnalog = constrain(analogSoil, WATER_VALUE, AIR_VALUE);
  soilMoisturePercent = map(constrainedAnalog, AIR_VALUE, WATER_VALUE, 0, 100);

  // 2. AUTOMATION & HYSTERESIS CONTROL LOGIC (DO NOT CHANGE AUTOMATION THRESHOLDS OR RELAY ACTIVE LOGIC)
  // FAN CONTROL (ON > 31°C, OFF < 28°C)
  if (temperature > FAN_TEMP_ON) {
    fanActive = true;
  } else if (temperature < FAN_TEMP_OFF) {
    fanActive = false;
  }

  // PUMP CONTROL (ON < 30%, OFF > 70%)
  if (soilMoisturePercent < PUMP_SOIL_ON) {
    pumpActive = true;
  } else if (soilMoisturePercent > PUMP_SOIL_OFF) {
    pumpActive = false;
  }

  // WRITE TO PHYSICAL RELAYS (ACTIVE LOW)
  digitalWrite(FAN_RELAY_PIN, fanActive ? RELAY_ON : RELAY_OFF);
  digitalWrite(PUMP_RELAY_PIN, pumpActive ? RELAY_ON : RELAY_OFF);

  // 3. UPDATE OLED DISPLAY
  updateOLED();

  // 4. CALCULATE PRECISE RUNTIMES & TRACK ACTIVATIONS
  unsigned long currentMillis = millis();
  if (lastLoopTime == 0) {
    lastLoopTime = currentMillis;
  }
  unsigned long dt = currentMillis - lastLoopTime;
  lastLoopTime = currentMillis;

  if (fanActive) {
    fanRuntimeMs += dt;
  }
  if (pumpActive) {
    pumpRuntimeMs += dt;
  }

  if (fanRuntimeMs >= 1000) {
    unsigned long seconds = fanRuntimeMs / 1000;
    fanRuntime += seconds;
    fanDailyRuntime += seconds;
    fanWeeklyRuntime += seconds;
    fanRuntimeMs = fanRuntimeMs % 1000;
  }
  if (pumpRuntimeMs >= 1000) {
    unsigned long seconds = pumpRuntimeMs / 1000;
    pumpRuntime += seconds;
    pumpDailyRuntime += seconds;
    pumpWeeklyRuntime += seconds;
    pumpRuntimeMs = pumpRuntimeMs % 1000;
  }

  // Check state transitions for Activations
  if (fanActive && !prevFanActive) {
    fanActivations++;
    fanDailyActivations++;
    sendMaintenanceDataToFirebase(); // upload immediately on change
  }
  prevFanActive = fanActive;

  if (pumpActive && !prevPumpActive) {
    pumpActivations++;
    pumpDailyActivations++;
    sendMaintenanceDataToFirebase(); // upload immediately on change
  }
  prevPumpActive = pumpActive;

  // 5. CALENDAR ROLLOVERS
  struct tm timeinfo;
  if (getLocalTime(&timeinfo)) {
    int currentDay = timeinfo.tm_mday;
    int currentWeek = timeinfo.tm_yday / 7;

    if (lastDay != -1 && currentDay != lastDay) {
      fanPrevDailyRuntime = fanDailyRuntime;
      fanPrevDailyActivations = fanDailyActivations;
      pumpPrevDailyRuntime = pumpDailyRuntime;
      pumpPrevDailyActivations = pumpDailyActivations;

      fanDailyRuntime = 0;
      fanDailyActivations = 0;
      pumpDailyRuntime = 0;
      pumpDailyActivations = 0;

      lastDay = currentDay;
      sendMaintenanceDataToFirebase();
    }

    if (lastWeek != -1 && timeinfo.tm_wday == 0 && lastWeek != 0) {
      fanWeeklyRuntime = 0;
      pumpWeeklyRuntime = 0;
      lastWeek = 0;
      sendMaintenanceDataToFirebase();
    } else if (timeinfo.tm_wday != 0) {
      lastWeek = timeinfo.tm_wday;
    }
  }

  // 6. SYNC DATA TO FIREBASE ON INTERVALS
  // A. Live Telemetry
  if (millis() - lastFirebaseWriteTime > FIREBASE_INTERVAL) {
    lastFirebaseWriteTime = millis();
    sendDataToFirebase();
  }

  // B. Historical Readings Pushed Node
  if (millis() - lastHistoricalWriteTime > HISTORICAL_INTERVAL) {
    lastHistoricalWriteTime = millis();
    pushHistoricalReadingToFirebase();
  }

  // C. Regular Maintenance Diagnostics Sync
  if (millis() - lastMaintWriteTime > MAINT_INTERVAL) {
    lastMaintWriteTime = millis();
    sendMaintenanceDataToFirebase();
  }
}

// ---------------------------------------------------------------------------------
// OLED DISPLAY HELPER
// ---------------------------------------------------------------------------------
void updateOLED() {
  display.clearDisplay();
  display.setCursor(0, 0);
  display.setTextSize(1);
  display.println("SMART POLYHOUSE IoT");
  display.println("-------------------");
  
  display.print("Temp: "); display.print(temperature, 1); display.println(" C");
  display.print("Hum:  "); display.print(humidity, 1); display.println(" %");
  display.print("Soil: "); display.print(soilMoisturePercent, 1); display.println(" %");
  
  display.print("FAN: "); display.print(fanActive ? "ON " : "OFF");
  display.print(" | PUMP: "); display.println(pumpActive ? "ON" : "OFF");
  
  display.display();
}

// ---------------------------------------------------------------------------------
// FIREBASE PUSH HELPER
// ---------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------
// FIREBASE PUSH HELPERS
// ---------------------------------------------------------------------------------
unsigned long long getEpochTimeMs() {
  time_t now;
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    return 1786442400000ULL + millis(); // Fallback date: Aug 2026
  }
  time(&now);
  return (unsigned long long)now * 1000ULL;
}

void fetchMaintenanceData() {
  Serial.println("Fetching existing maintenance metrics from Firebase...");
  String path = plantNode + "/maintenance";
  if (Firebase.RTDB.getJSON(&fbdo, path.c_str())) {
    if (fbdo.dataType() == "json") {
      FirebaseJsonData jsonData;
      if (fbdo.jsonObject().get(jsonData, "fanRuntime")) fanRuntime = jsonData.intValue;
      if (fbdo.jsonObject().get(jsonData, "fanDailyRuntime")) fanDailyRuntime = jsonData.intValue;
      if (fbdo.jsonObject().get(jsonData, "fanWeeklyRuntime")) fanWeeklyRuntime = jsonData.intValue;
      if (fbdo.jsonObject().get(jsonData, "fanActivations")) fanActivations = jsonData.intValue;
      if (fbdo.jsonObject().get(jsonData, "fanDailyActivations")) fanDailyActivations = jsonData.intValue;
      if (fbdo.jsonObject().get(jsonData, "fanPrevDailyRuntime")) fanPrevDailyRuntime = jsonData.intValue;
      if (fbdo.jsonObject().get(jsonData, "fanPrevDailyActivations")) fanPrevDailyActivations = jsonData.intValue;

      if (fbdo.jsonObject().get(jsonData, "pumpRuntime")) pumpRuntime = jsonData.intValue;
      if (fbdo.jsonObject().get(jsonData, "pumpDailyRuntime")) pumpDailyRuntime = jsonData.intValue;
      if (fbdo.jsonObject().get(jsonData, "pumpWeeklyRuntime")) pumpWeeklyRuntime = jsonData.intValue;
      if (fbdo.jsonObject().get(jsonData, "pumpActivations")) pumpActivations = jsonData.intValue;
      if (fbdo.jsonObject().get(jsonData, "pumpDailyActivations")) pumpDailyActivations = jsonData.intValue;
      if (fbdo.jsonObject().get(jsonData, "pumpPrevDailyRuntime")) pumpPrevDailyRuntime = jsonData.intValue;
      if (fbdo.jsonObject().get(jsonData, "pumpPrevDailyActivations")) pumpPrevDailyActivations = jsonData.intValue;
      Serial.println("Initial maintenance metrics successfully loaded!");
    } else {
      Serial.println("No existing maintenance stats found. Initializing to 0.");
    }
  } else {
    Serial.println("Firebase get maintenance error: " + fbdo.errorReason());
  }
}

void sendMaintenanceDataToFirebase() {
  if (Firebase.ready()) {
    FirebaseJson json;
    json.set("fanRuntime", fanRuntime);
    json.set("fanDailyRuntime", fanDailyRuntime);
    json.set("fanWeeklyRuntime", fanWeeklyRuntime);
    json.set("fanActivations", fanActivations);
    json.set("fanDailyActivations", fanDailyActivations);
    json.set("fanPrevDailyRuntime", fanPrevDailyRuntime);
    json.set("fanPrevDailyActivations", fanPrevDailyActivations);

    json.set("pumpRuntime", pumpRuntime);
    json.set("pumpDailyRuntime", pumpDailyRuntime);
    json.set("pumpWeeklyRuntime", pumpWeeklyRuntime);
    json.set("pumpActivations", pumpActivations);
    json.set("pumpDailyActivations", pumpDailyActivations);
    json.set("pumpPrevDailyRuntime", pumpPrevDailyRuntime);
    json.set("pumpPrevDailyActivations", pumpPrevDailyActivations);

    String path = plantNode + "/maintenance";
    if (Firebase.RTDB.setJSON(&fbdo, path.c_str(), &json)) {
      Serial.println("Firebase Maintenance Metrics Sync Success!");
    } else {
      Serial.println("Firebase Maintenance Error: " + fbdo.errorReason());
    }
  }
}

void sendDataToFirebase() {
  if (Firebase.ready()) {
    unsigned long long nowMs = getEpochTimeMs();

    FirebaseJson json;
    json.set("temperature", temperature);
    json.set("humidity", humidity);
    json.set("soilMoisture", soilMoisturePercent);
    json.set("fanActive", fanActive);
    json.set("fan", fanActive);
    json.set("pumpActive", pumpActive);
    json.set("pump", pumpActive);
    json.set("esp32Online", true);
    json.set("timestamp", nowMs);
    json.set("lastSeen", nowMs); // Heartbeat: website checks Date.now()-lastSeen to detect offline

    String path = plantNode + "/live";
    if (Firebase.RTDB.setJSON(&fbdo, path.c_str(), &json)) {
      Serial.println("Firebase Live Telemetry Sync Success!");
    } else {
      Serial.println("Firebase Error: " + fbdo.errorReason());
    }
  }
}

void pushHistoricalReadingToFirebase() {
  if (Firebase.ready()) {
    FirebaseJson json;
    json.set("timestamp", getEpochTimeMs());
    json.set("temperature", temperature);
    json.set("humidity", humidity);
    json.set("soilMoisture", soilMoisturePercent);
    json.set("fanActive", fanActive);
    json.set("pumpActive", pumpActive);

    String path = plantNode + "/analytics/readings";
    if (Firebase.RTDB.pushJSON(&fbdo, path.c_str(), &json)) {
      Serial.println("Firebase Historical Reading Logged Successfully!");
    } else {
      Serial.println("Firebase Historical Log Error: " + fbdo.errorReason());
    }
  }
}
