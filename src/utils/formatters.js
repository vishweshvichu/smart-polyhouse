export const formatDuration = (seconds) => {
  if (!seconds || seconds <= 0) return '0 min';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  }
  if (mins > 0) {
    return `${mins}m ${secs}s`;
  }
  return `${secs}s`;
};

export const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
};

export const getTempStatusColor = (temp) => {
  if (temp > 31) return '#ff5252'; // Too Hot (Fan ON)
  if (temp < 20) return '#00b0ff'; // Too Cold
  return '#2ecc71'; // Optimal
};

export const getMoistureStatusColor = (moisture) => {
  if (moisture < 30) return '#ff9100'; // Low Moisture (Pump ON)
  if (moisture > 75) return '#00b0ff'; // High Moisture
  return '#2ecc71'; // Optimal
};
