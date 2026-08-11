export const PROJECT_INFO = {
  name: "SMART POLYHOUSE",
  tagline: "Smart Monitoring • Smart Irrigation • Smart Climate Control • Smart Maintenance",
  subtitle: "IoT-based AI Precision Farming Solution for Polyhouse Cultivation"
};

export const HARDWARE_PINS = {
  dht22: "GPIO 4",
  soilMoisture: "GPIO 34",
  fanRelay: "GPIO 27",
  pumpRelay: "GPIO 26",
  oledSda: "GPIO 21",
  oledScl: "GPIO 22"
};

export const CONTROL_RULES = {
  fan: {
    onThreshold: 31,
    offThreshold: 28,
    unit: "°C",
    conditionOn: "> 31°C",
    conditionOff: "< 28°C"
  },
  pump: {
    onThreshold: 30,
    offThreshold: 70,
    unit: "%",
    conditionOn: "< 30%",
    conditionOff: "> 70%"
  },
  calibration: {
    airValue: 3400,
    waterValue: 1250
  }
};

export const INITIAL_PLANTS = [
  { id: "plant_01", name: "Plant 01 - Tomato / Bell Pepper", active: true, crop: "Tomato (Solanum lycopersicum)", status: "Optimal" },
  { id: "plant_02", name: "Plant 02 - Strawberry Section", active: false, crop: "Strawberry (Fragaria × ananassa)", status: "Planned" },
  { id: "plant_03", name: "Plant 03 - Cucumber Hydroponic", active: false, crop: "Cucumber (Cucumis sativus)", status: "Planned" }
];
