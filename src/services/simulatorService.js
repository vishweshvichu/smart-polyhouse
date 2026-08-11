/**
 * Simulator Service for Smart Polyhouse
 * Provides realistic live sensor data, hysteresis automation simulation,
 * historical analytics, and maintenance metrics when Firebase is not connected or in Demo mode.
 */

let simulatorInterval = null;
let currentSimData = {
  temperature: 29.4,
  humidity: 67.0,
  soilMoisture: 54.0,
  fan: false,
  pump: false,
  timestamp: Date.now(),
  esp32Online: true
};

let simListeners = [];

// Realistic initial maintenance counters
let simMaintenanceData = {
  fan: {
    totalRuntime: 14200,    // seconds (~3.9 hrs)
    dailyRuntime: 2880,     // seconds (48 mins today)
    weeklyRuntime: 18400,   // seconds (~5.1 hrs)
    prevDailyRuntime: 2100, // seconds
    totalActivations: 48,
    dailyActivations: 12,
    prevDailyActivations: 9
  },
  pump: {
    totalRuntime: 8600,     // seconds (~2.3 hrs)
    dailyRuntime: 1650,     // seconds (27.5 mins today)
    weeklyRuntime: 11200,   // seconds (~3.1 hrs)
    prevDailyRuntime: 1800, // seconds
    totalActivations: 34,
    dailyActivations: 8,
    prevDailyActivations: 5
  }
};

/**
 * Generate mock 30-day historical time-series analytics data
 */
export const getSimulatedHistoricalData = (daysCount = 30) => {
  const result = [];
  const now = new Date();

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    // Slight realistic seasonal variation
    const baseTemp = 28 + Math.sin(i / 3) * 3;
    const baseHum = 65 + Math.cos(i / 2) * 8;
    const baseSoil = 55 + Math.sin(i / 4) * 12;

    result.push({
      date: dateStr,
      displayDate: d.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      temperature: Number((baseTemp + (Math.random() * 2 - 1)).toFixed(1)),
      humidity: Math.round(baseHum + (Math.random() * 4 - 2)),
      soilMoisture: Math.round(baseSoil + (Math.random() * 6 - 3)),
      fanRuntime: Math.round(1800 + Math.random() * 1500), // seconds
      fanActivations: Math.round(8 + Math.random() * 8),
      pumpRuntime: Math.round(1200 + Math.random() * 900),  // seconds
      pumpActivations: Math.round(5 + Math.random() * 5)
    });
  }
  return result;
};

/**
 * Start the live simulation engine
 */
export const startSimulation = (onUpdate) => {
  if (onUpdate && !simListeners.includes(onUpdate)) {
    simListeners.push(onUpdate);
  }

  // Send initial state immediately
  onUpdate(currentSimData);

  if (!simulatorInterval) {
    simulatorInterval = setInterval(() => {
      // Small random fluctuation in environmental parameters
      let tempDelta = (Math.random() * 0.4 - 0.2);
      let humDelta = (Math.random() * 1.0 - 0.5);
      let soilDelta = (Math.random() * 0.6 - 0.3);

      // If fan is ON, temperature drops faster
      if (currentSimData.fan) {
        tempDelta -= 0.3;
        humDelta += 0.2;
      }

      // If pump is ON, soil moisture increases faster
      if (currentSimData.pump) {
        soilDelta += 1.2;
      } else {
        // Natural soil drying
        soilDelta -= 0.15;
      }

      let newTemp = Number(Math.max(18, Math.min(42, currentSimData.temperature + tempDelta)).toFixed(1));
      let newHum = Number(Math.max(30, Math.min(95, currentSimData.humidity + humDelta)).toFixed(1));
      let newSoil = Number(Math.max(15, Math.min(95, currentSimData.soilMoisture + soilDelta)).toFixed(1));

      // HYSTERESIS CONTROL LOGIC EXACT REPLICA
      let newFanState = currentSimData.fan;
      if (newTemp > 31.0) {
        newFanState = true;
      } else if (newTemp < 28.0) {
        newFanState = false;
      }

      let newPumpState = currentSimData.pump;
      if (newSoil < 30.0) {
        newPumpState = true;
      } else if (newSoil > 70.0) {
        newPumpState = false;
      }

      // Track activations & runtime
      if (!currentSimData.fan && newFanState) {
        simMaintenanceData.fan.dailyActivations += 1;
        simMaintenanceData.fan.totalActivations += 1;
      }
      if (!currentSimData.pump && newPumpState) {
        simMaintenanceData.pump.dailyActivations += 1;
        simMaintenanceData.pump.totalActivations += 1;
      }

      if (newFanState) {
        simMaintenanceData.fan.dailyRuntime += 3;
        simMaintenanceData.fan.totalRuntime += 3;
      }
      if (newPumpState) {
        simMaintenanceData.pump.dailyRuntime += 3;
        simMaintenanceData.pump.totalRuntime += 3;
      }

      currentSimData = {
        temperature: newTemp,
        humidity: newHum,
        soilMoisture: newSoil,
        fan: newFanState,
        pump: newPumpState,
        timestamp: Date.now(),
        esp32Online: true
      };

      simListeners.forEach(listener => listener(currentSimData));
    }, 3000); // update every 3 seconds
  }

  return () => {
    simListeners = simListeners.filter(l => l !== onUpdate);
    if (simListeners.length === 0 && simulatorInterval) {
      clearInterval(simulatorInterval);
      simulatorInterval = null;
    }
  };
};

export const getSimulatedMaintenanceData = () => {
  return simMaintenanceData;
};

export const triggerSimulatedAlert = (type) => {
  if (type === 'high_temp') currentSimData.temperature = 34.2;
  if (type === 'low_soil') currentSimData.soilMoisture = 22.0;
  if (type === 'offline') currentSimData.esp32Online = false;
  if (type === 'online') currentSimData.esp32Online = true;
  
  simListeners.forEach(listener => listener(currentSimData));
};
