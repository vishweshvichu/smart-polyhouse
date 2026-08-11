import { ref, onValue, set, update, get, push } from 'firebase/database';
import { database, isFirebaseConfigured } from '../firebase/config';

/**
 * 1. Subscribe to Live Plant Data in Realtime
 * Database Path: /polyhouse/${plantId}/live
 * Keys: temperature, humidity, soilMoisture, fanActive, pumpActive, timestamp
 */
export const readLiveData = (plantId = 'plant_01', callback, onError) => {
  if (!database || !isFirebaseConfigured) {
    if (onError) onError(new Error("Firebase environment variables not set. Enabling simulator fallback."));
    return () => {};
  }

  const liveRef = ref(database, `polyhouse/${plantId}/live`);
  const unsubscribe = onValue(
    liveRef, 
    (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        const normalized = {
          temperature: Number(val.temperature ?? 0),
          humidity: Number(val.humidity ?? 0),
          soilMoisture: Number(val.soilMoisture ?? 0),
          fanActive: val.fanActive !== undefined ? Boolean(val.fanActive) : Boolean(val.fan),
          fan: val.fanActive !== undefined ? Boolean(val.fanActive) : Boolean(val.fan),
          pumpActive: val.pumpActive !== undefined ? Boolean(val.pumpActive) : Boolean(val.pump),
          pump: val.pumpActive !== undefined ? Boolean(val.pumpActive) : Boolean(val.pump),
          timestamp: val.timestamp || Date.now(),
          lastSeen: Number(val.lastSeen || val.timestamp || Date.now()),
          esp32Online: val.esp32Online !== undefined ? Boolean(val.esp32Online) : true
        };
        callback(normalized);
      } else {
        callback(null);
      }
    }, 
    (error) => {
      console.error(`Firebase readLiveData error for ${plantId}:`, error);
      if (onError) onError(error);
    }
  );

  return unsubscribe;
};

export const listenToLiveData = readLiveData;

/**
 * 2. Subscribe to Timestamped Historical Readings in Realtime
 * Database Path: /polyhouse/${plantId}/analytics/readings
 */
export const subscribeToReadings = (plantId = 'plant_01', callback, onError) => {
  if (!database || !isFirebaseConfigured) {
    if (onError) onError(new Error("Firebase not configured for historical readings."));
    return () => {};
  }

  const readingsRef = ref(database, `polyhouse/${plantId}/analytics/readings`);
  const unsubscribe = onValue(
    readingsRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const formatted = Object.keys(data).map(key => {
          const item = data[key];
          const ts = Number(item.timestamp || Date.now());
          const dateObj = new Date(ts);
          const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          const dateStr = dateObj.toLocaleDateString();
          return {
            id: key,
            timestamp: ts,
            date: dateStr,
            time: timeStr,
            displayDate: timeStr,
            fullDate: `${dateStr} ${timeStr}`,
            temperature: Number(item.temperature ?? 0),
            humidity: Number(item.humidity ?? 0),
            soilMoisture: Number(item.soilMoisture ?? 0),
            fanActive: Boolean(item.fanActive ?? item.fan),
            pumpActive: Boolean(item.pumpActive ?? item.pump),
            fanRuntime: Number(item.fanRuntime ?? 0),
            fanActivations: (item.fanActive ?? item.fan) ? 1 : 0,
            pumpRuntime: Number(item.pumpRuntime ?? 0),
            pumpActivations: (item.pumpActive ?? item.pump) ? 1 : 0
          };
        }).sort((a, b) => a.timestamp - b.timestamp);
        callback(formatted);
      } else {
        callback([]);
      }
    },
    (error) => {
      console.error(`Firebase readings error for ${plantId}:`, error);
      if (onError) onError(error);
    }
  );

  return unsubscribe;
};

/**
 * 3. Subscribe to Historical Analytics Data in Realtime
 * Database Path: /polyhouse/${plantId}/analytics/readings OR /daily
 */
export const subscribeToAnalytics = (plantId = 'plant_01', callback, onError) => {
  if (!database || !isFirebaseConfigured) {
    if (onError) onError(new Error("Firebase not configured for analytics."));
    return () => {};
  }

  // Subscribe to readings node first
  return subscribeToReadings(plantId, (readings) => {
    if (readings && readings.length > 0) {
      callback(readings);
    } else {
      // Fallback to daily node if readings node empty
      const analyticsRef = ref(database, `polyhouse/${plantId}/analytics/daily`);
      onValue(
        analyticsRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const formatted = Object.keys(data).map(key => ({
              date: key,
              displayDate: key,
              temperature: Number(data[key].temperature ?? 0),
              humidity: Number(data[key].humidity ?? 0),
              soilMoisture: Number(data[key].soilMoisture ?? 0),
              fanRuntime: Number(data[key].fanRuntime ?? 0),
              fanActivations: Number(data[key].fanActivations ?? 0),
              pumpRuntime: Number(data[key].pumpRuntime ?? 0),
              pumpActivations: Number(data[key].pumpActivations ?? 0)
            }));
            callback(formatted);
          } else {
            callback([]);
          }
        },
        onError
      );
    }
  }, onError);
};

export const getHistoricalData = async (plantId = 'plant_01') => {
  if (!database || !isFirebaseConfigured) return null;
  const readingsRef = ref(database, `polyhouse/${plantId}/analytics/readings`);
  const snapshot = await get(readingsRef);
  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.keys(data).map(key => ({
      id: key,
      ...data[key]
    }));
  }
  return null;
};

/**
 * 4. Subscribe to Maintenance & Runtime Data in Realtime
 * Database Path: /polyhouse/${plantId}/maintenance
 */
export const subscribeToMaintenance = (plantId = 'plant_01', callback, onError) => {
  if (!database || !isFirebaseConfigured) {
    if (onError) onError(new Error("Firebase not configured for maintenance."));
    return () => {};
  }

  const maintRef = ref(database, `polyhouse/${plantId}/maintenance`);
  const unsubscribe = onValue(
    maintRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        const formatted = {
          fan: {
            totalRuntime: Number(val.fanRuntime ?? val.fan?.totalRuntime ?? 0),
            dailyRuntime: Number(val.fanDailyRuntime ?? val.fan?.dailyRuntime ?? 0),
            weeklyRuntime: Number(val.fanWeeklyRuntime ?? val.fan?.weeklyRuntime ?? 0),
            totalActivations: Number(val.fanActivations ?? val.fan?.totalActivations ?? 0),
            dailyActivations: Number(val.fanDailyActivations ?? val.fan?.dailyActivations ?? 0),
            prevDailyRuntime: Number(val.fanPrevDailyRuntime ?? val.fan?.prevDailyRuntime ?? 0),
            prevDailyActivations: Number(val.fanPrevDailyActivations ?? val.fan?.prevDailyActivations ?? 0)
          },
          pump: {
            totalRuntime: Number(val.pumpRuntime ?? val.pump?.totalRuntime ?? 0),
            dailyRuntime: Number(val.pumpDailyRuntime ?? val.pump?.dailyRuntime ?? 0),
            weeklyRuntime: Number(val.pumpWeeklyRuntime ?? val.pump?.weeklyRuntime ?? 0),
            totalActivations: Number(val.pumpActivations ?? val.pump?.totalActivations ?? 0),
            dailyActivations: Number(val.pumpDailyActivations ?? val.pump?.dailyActivations ?? 0),
            prevDailyRuntime: Number(val.pumpPrevDailyRuntime ?? val.pump?.prevDailyRuntime ?? 0),
            prevDailyActivations: Number(val.pumpPrevDailyActivations ?? val.pump?.prevDailyActivations ?? 0)
          }
        };
        callback(formatted);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error(`Firebase maintenance error for ${plantId}:`, error);
      if (onError) onError(error);
    }
  );

  return unsubscribe;
};

export const getMaintenanceMetrics = async (plantId = 'plant_01') => {
  if (!database || !isFirebaseConfigured) return null;
  const maintRef = ref(database, `polyhouse/${plantId}/maintenance`);
  const snapshot = await get(maintRef);
  if (snapshot.exists()) {
    const val = snapshot.val();
    return {
      fan: {
        totalRuntime: Number(val.fanRuntime ?? val.fan?.totalRuntime ?? 0),
        dailyRuntime: Number(val.fanDailyRuntime ?? val.fan?.dailyRuntime ?? 0),
        weeklyRuntime: Number(val.fanWeeklyRuntime ?? val.fan?.weeklyRuntime ?? 0),
        totalActivations: Number(val.fanActivations ?? val.fan?.totalActivations ?? 0),
        dailyActivations: Number(val.fanDailyActivations ?? val.fan?.dailyActivations ?? 0)
      },
      pump: {
        totalRuntime: Number(val.pumpRuntime ?? val.pump?.totalRuntime ?? 0),
        dailyRuntime: Number(val.pumpDailyRuntime ?? val.pump?.dailyRuntime ?? 0),
        weeklyRuntime: Number(val.pumpWeeklyRuntime ?? val.pump?.weeklyRuntime ?? 0),
        totalActivations: Number(val.pumpActivations ?? val.pump?.totalActivations ?? 0),
        dailyActivations: Number(val.pumpDailyActivations ?? val.pump?.dailyActivations ?? 0)
      }
    };
  }
  return null;
};

/**
 * 5. Write Live Sensor Data AND Push Historical Reading to Firebase RTDB
 * Live Path: /polyhouse/${plantId}/live
 * Historical Readings Path: /polyhouse/${plantId}/analytics/readings
 */
export const writeSensorData = async (plantId = 'plant_01', data) => {
  if (!database || !isFirebaseConfigured) {
    throw new Error("Firebase is not initialized or database credentials are missing in .env file.");
  }

  const timestamp = data.timestamp || Date.now();

  // 1. Live state update payload
  const liveRef = ref(database, `polyhouse/${plantId}/live`);
  const livePayload = {
    temperature: Number(data.temperature),
    humidity: Number(data.humidity),
    soilMoisture: Number(data.soilMoisture),
    fanActive: Boolean(data.fanActive ?? data.fan),
    pumpActive: Boolean(data.pumpActive ?? data.pump),
    timestamp: timestamp,
    esp32Online: data.esp32Online !== undefined ? Boolean(data.esp32Online) : true
  };
  await set(liveRef, livePayload);

  // 2. Push historical reading payload to /polyhouse/${plantId}/analytics/readings
  const readingsRef = ref(database, `polyhouse/${plantId}/analytics/readings`);
  const readingPayload = {
    timestamp: timestamp,
    temperature: Number(data.temperature),
    humidity: Number(data.humidity),
    soilMoisture: Number(data.soilMoisture),
    fanActive: Boolean(data.fanActive ?? data.fan),
    pumpActive: Boolean(data.pumpActive ?? data.pump)
  };
  await push(readingsRef, readingPayload);

  return livePayload;
};

/**
 * 5b. Record Test Reading from Live Data to Historical Readings
 */
export const recordTestReading = async (plantId = 'plant_01') => {
  if (!database || !isFirebaseConfigured) {
    throw new Error("Firebase is not initialized or database credentials are missing in .env file.");
  }

  // 1. Fetch current live state
  const liveRef = ref(database, `polyhouse/${plantId}/live`);
  const snapshot = await get(liveRef);
  
  if (!snapshot.exists()) {
    throw new Error("No live telemetry data found under /live to record.");
  }
  
  const liveData = snapshot.val();

  // 2. Prepare payload exactly matching the requirements
  const readingsRef = ref(database, `polyhouse/${plantId}/analytics/readings`);
  const readingPayload = {
    timestamp: Date.now(),
    temperature: Number(liveData.temperature ?? 0),
    humidity: Number(liveData.humidity ?? 0),
    soilMoisture: Number(liveData.soilMoisture ?? 0),
    fanActive: liveData.fanActive !== undefined ? Boolean(liveData.fanActive) : Boolean(liveData.fan),
    pumpActive: liveData.pumpActive !== undefined ? Boolean(liveData.pumpActive) : Boolean(liveData.pump)
  };

  // 3. Push to /analytics/readings
  await push(readingsRef, readingPayload);

  return readingPayload;
};

/**
 * 6. Update Fan/Pump Actuator Status in Realtime
 */
export const updateDeviceStatus = async (plantId = 'plant_01', fanStatus, pumpStatus) => {
  if (!database || !isFirebaseConfigured) return;
  const liveRef = ref(database, `polyhouse/${plantId}/live`);
  
  const updatePayload = {};
  if (fanStatus !== undefined) {
    updatePayload.fanActive = Boolean(fanStatus);
    updatePayload.fan = Boolean(fanStatus);
  }
  if (pumpStatus !== undefined) {
    updatePayload.pumpActive = Boolean(pumpStatus);
    updatePayload.pump = Boolean(pumpStatus);
  }
  updatePayload.timestamp = Date.now();

  await update(liveRef, updatePayload);
};
