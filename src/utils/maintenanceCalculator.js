import { formatDuration } from './formatters';

export const analyzeMaintenanceStatus = (deviceType, stats) => {
  const {
    totalRuntime = 0,
    dailyRuntime = 0,
    weeklyRuntime = 0,
    totalActivations = 0,
    dailyActivations = 0,
    prevDailyRuntime = 0,
    prevDailyActivations = 0
  } = stats;

  const avgCycleDuration = dailyActivations > 0 
    ? Math.round(dailyRuntime / dailyActivations) 
    : 0;

  const recommendations = [];

  if (deviceType === 'fan') {
    // Rule 1: Fan operating runtime increasing significantly compared to previous days
    if (prevDailyRuntime > 0 && dailyRuntime > prevDailyRuntime * 1.25) {
      recommendations.push({
        type: 'warning',
        label: 'Maintenance Indicator',
        text: 'Fan operating runtime is increasing compared with previous days. Inspection recommended to check ventilation louvers and dust buildup.'
      });
    }

    // Rule 2: High daily activation frequency
    if (dailyActivations > 20) {
      recommendations.push({
        type: 'info',
        label: 'Maintenance Recommendation',
        text: 'Fan activation frequency is high. Verify ambient temperature setpoints and shading cloth deployment.'
      });
    }

    // Rule 3: Short rapid cycles
    if (dailyActivations > 10 && avgCycleDuration < 90) {
      recommendations.push({
        type: 'warning',
        label: 'Maintenance Indicator',
        text: 'Short Fan ON cycle duration detected. Check DHT22 sensor placement for rapid thermal oscillation.'
      });
    }

    // Default normal message if no warnings
    if (recommendations.length === 0) {
      recommendations.push({
        type: 'normal',
        label: 'Maintenance Indicator',
        text: 'Fan operating within normal thermal regulation duty cycles. No immediate action required.'
      });
    }

  } else if (deviceType === 'pump') {
    // Rule 1: Pump activation frequency increasing
    if (prevDailyActivations > 0 && dailyActivations > prevDailyActivations * 1.3) {
      recommendations.push({
        type: 'warning',
        label: 'Maintenance Recommendation',
        text: 'Pump activation frequency is increasing. Check water flow, filter clogging, and drip irrigation lines.'
      });
    }

    // Rule 2: Exceptionally high daily runtime
    if (dailyRuntime > 7200) { // > 2 hours
      recommendations.push({
        type: 'info',
        label: 'Maintenance Indicator',
        text: 'Water pump cumulative runtime exceeds typical daily threshold. Inspect soil moisture sensor depth and calibration.'
      });
    }

    // Rule 3: Unusually long ON cycle duration
    if (dailyActivations > 0 && avgCycleDuration > 600) { // > 10 mins per cycle
      recommendations.push({
        type: 'warning',
        label: 'Maintenance Indicator',
        text: 'Water pump cycle duration is prolonged. Verify pump water inlet flow and water reservoir level.'
      });
    }

    // Default normal message
    if (recommendations.length === 0) {
      recommendations.push({
        type: 'normal',
        label: 'Maintenance Indicator',
        text: 'Water pump operating within nominal moisture regulation patterns. Irrigation line pressure normal.'
      });
    }
  }

  return {
    totalRuntime,
    dailyRuntime,
    weeklyRuntime,
    totalActivations,
    dailyActivations,
    avgCycleDuration,
    formattedAvgCycle: formatDuration(avgCycleDuration),
    formattedTotalRuntime: formatDuration(totalRuntime),
    formattedDailyRuntime: formatDuration(dailyRuntime),
    formattedWeeklyRuntime: formatDuration(weeklyRuntime),
    recommendations
  };
};
