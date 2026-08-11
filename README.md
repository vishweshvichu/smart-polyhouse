# SMART POLYHOUSE
> **Smart Monitoring • Smart Irrigation • Smart Climate Control • Smart Maintenance**
> *IoT-Based AI Precision Farming Solution for Polyhouse Cultivation*

---

## 🌟 Executive Overview
**SMART POLYHOUSE** is a complete end-to-end IoT precision farming dashboard designed to monitor and autonomously regulate microclimates and irrigation inside agricultural polyhouses. 

It connects seamlessly with an **ESP32 microcontroller** over Wi-Fi, storing live readings and operational metrics in **Firebase Realtime Database**, while rendering real-time telemetry, historical trend analytics, and predictive maintenance indicators on a responsive React web dashboard.

---

## 📁 Complete Project File Directory
```
smart-polyhouse/
├── package.json               # NPM package dependencies & scripts
├── vite.config.js             # Vite build & local server settings
├── .env.example               # Template for Firebase environment keys
├── firebase.json              # Firebase Hosting configuration
├── .firebaserc                # Default Firebase project identifier
├── index.html                 # Main HTML root with SEO & Google Fonts
├── README.md                  # Detailed deployment guide & architectural docs
├── firmware/
│   └── smart_polyhouse_esp32.ino # Arduino C++ code for ESP32 hardware
└── src/
    ├── main.jsx               # React DOM entrypoint
    ├── App.jsx                # Main application state & router
    ├── index.css              # Custom agricultural dark/light UI CSS theme
    ├── firebase/
    │   └── config.js          # Firebase SDK initialization
    ├── services/
    │   ├── firebaseService.js # Firebase Realtime DB CRUD functions
    │   └── simulatorService.js# Live demo telemetry simulation engine
    ├── utils/
    │   ├── constants.js       # Hardware pins, thresholds, plant catalog
    │   ├── formatters.js      # Timestamp & duration formatting helpers
    │   └── maintenanceCalculator.js # Empirical duty cycle diagnostic rules
    ├── components/
    │   ├── Navbar.jsx         # Sidebar navigation
    │   ├── Header.jsx         # Header bar with plant switcher & demo toggle
    │   ├── PlantSelector.jsx  # Multi-plant selector dropdown
    │   ├── SensorCard.jsx     # Live gauge telemetry card
    │   ├── StatusBadge.jsx    # Pulsing status LED badge
    │   ├── AutomationRuleCard.jsx # Hysteresis rules status card
    │   ├── MaintenanceCard.jsx# Actuator runtime & diagnostic indicator card
    │   └── AlertBanner.jsx    # Realtime notification banner
    ├── charts/
    │   ├── SensorTrendChart.jsx # Recharts area chart for temperature/humidity/soil
    │   └── RuntimeBarChart.jsx  # Recharts bar chart for fan & pump runtime
    └── pages/
        ├── Dashboard.jsx      # Main live monitoring dashboard
        ├── Analytics.jsx      # Historical trends & time filters
        ├── Plants.jsx         # Multi-plant zone manager
        ├── Maintenance.jsx    # Component diagnostics & recommendations
        ├── Alerts.jsx         # System alert log & notification events
        └── Settings.jsx       # Hardware pin map & simulation controls
```

---

## 🔌 Hardware Circuit & Pinout Reference

| Component / Sensor | ESP32 GPIO Pin | Connection Type | Operating Logic / Voltage |
| :--- | :--- | :--- | :--- |
| **DHT22 Temp & Humidity** | `GPIO 4` | Single Bus Digital | 3.3V - 5V Data |
| **Capacitive Soil Moisture** | `GPIO 34` | ADC Analog Input | 3.3V Analog (AIR: 3400, WATER: 1250) |
| **5V DC Cooling Fan Relay** | `GPIO 27` | Digital Output | **ACTIVE LOW** (LOW = ON, HIGH = OFF) |
| **5V DC Water Pump Relay** | `GPIO 26` | Digital Output | **ACTIVE LOW** (LOW = ON, HIGH = OFF) |
| **SSD1306 OLED (128x64)** | `SDA 21` / `SCL 22` | I2C Protocol | 3.3V I2C Screen Readout |

---

## ⚡ Hysteresis Control Logic

1. **Cooling Fan (GPIO 27)**:
   - **ON**: When Temperature `> 31.0 °C`
   - **OFF**: When Temperature `< 28.0 °C`
2. **Water Pump (GPIO 26)**:
   - **ON**: When Soil Moisture `< 30.0 %`
   - **OFF**: When Soil Moisture `> 70.0 %`

---

## 🛠️ Complete Beginner Deployment Guide

### Step 1: Install Required Software
1. **Node.js (v18 or higher)**: Download and install from [https://nodejs.org](https://nodejs.org).
2. **Git**: Download from [https://git-scm.com](https://git-scm.com).
3. **Arduino IDE 2.x**: Download from [https://www.arduino.cc/en/software](https://www.arduino.cc/en/software).

### Step 2: Install Project Dependencies
Open your command terminal inside the project directory:
```bash
cd smart-polyhouse
npm install
```

### Step 3: Configure Firebase Realtime Database
1. Go to [Firebase Console](https://console.firebase.google.com/) and click **Add Project**.
2. Name your project (e.g., `smart-polyhouse-iot`).
3. Under **Build**, select **Realtime Database** and click **Create Database**.
4. Start in **Test Mode** (or update Security Rules to allow read/write):
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```
5. Go to **Project Settings** (gear icon) ➔ **General** ➔ **Your Apps** ➔ Add a Web App (`</>`).
6. Copy the configuration credentials (`apiKey`, `databaseURL`, `projectId`, etc.).

### Step 4: Add Environment Variables
Create a file named `.env` inside the `smart-polyhouse` root folder and paste your credentials:
```env
VITE_FIREBASE_API_KEY=AIzaSyYourActualApiKeyHere
VITE_FIREBASE_AUTH_DOMAIN=smart-polyhouse-iot.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://smart-polyhouse-iot-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=smart-polyhouse-iot
VITE_FIREBASE_STORAGE_BUCKET=smart-polyhouse-iot.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
```

### Step 5: Run Dashboard Locally
Execute the Vite local development server:
```bash
npm run dev
```
Open your browser at `http://localhost:3000`. 
*Note: If Firebase credentials are not yet added, click the **"Demo Simulator ON"** button in the header to view live interactive simulated sensor feeds for your hackathon presentation!*

### Step 6: Build Production Bundle
To compile optimized static assets:
```bash
npm run build
```
This generates a production-ready build inside the `dist/` directory.

### Step 7: Deploy to Firebase Hosting
1. Install Firebase CLI globally (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```
2. Log into Firebase:
   ```bash
   firebase login
   ```
3. Initialize project hosting:
   ```bash
   firebase use --add
   ```
   Select your project from the list and give it an alias (e.g., `default`).
4. Deploy public site:
   ```bash
   firebase deploy --only hosting
   ```
5. Firebase will print your final public live web URL:
   `https://smart-polyhouse-iot.web.app`

---

## 📡 ESP32 to Firebase Integration Guide

1. Open Arduino IDE 2.x and install the following libraries via **Tools ➔ Manage Libraries**:
   - `Firebase ESP Client` by Mobizt
   - `DHT sensor library` by Adafruit
   - `Adafruit SSD1306` & `Adafruit GFX Library`
2. Open `firmware/smart_polyhouse_esp32.ino`.
3. Update lines 56-61 with your Wi-Fi credentials and Firebase Database URL:
   ```cpp
   #define WIFI_SSID "YOUR_WIFI_SSID"
   #define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"
   #define DATABASE_URL "https://smart-polyhouse-iot-default-rtdb.firebaseio.com/"
   #define API_KEY "YOUR_FIREBASE_API_KEY"
   ```
4. Select board **ESP32 Dev Module** and upload the sketch over USB.
5. Once uploaded, the ESP32 automatically streams sensor readings every 3 seconds to `/polyhouse/plant_01/live` over Wi-Fi.

---

##  🌱 How to Add Another Plant Later
The Firebase database and UI structure are modularly designed for horizontal expansion.
To add `Plant 02`:
1. In `src/utils/constants.js`, set `active: true` for `plant_02` in `INITIAL_PLANTS`.
2. On your second ESP32 microcontroller, set `String plantNode = "/polyhouse/plant_02";` in the Arduino sketch.
3. The dashboard plant selector will immediately isolate and display live telemetry for `plant_02`!
