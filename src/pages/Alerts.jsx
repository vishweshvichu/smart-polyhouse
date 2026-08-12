import React, { useState } from 'react';
import AlertBanner from '../components/AlertBanner';
import { Bell, AlertTriangle, Info } from 'lucide-react';

export default function Alerts({ liveData, maintenanceStats }) {
  const [filterSeverity, setFilterSeverity] = useState('all');

  // Build a dynamic event log from current sensor conditions
  const buildEventLog = () => {
    const events = [];

    if (liveData?.temperature > 31) {
      events.push({
        id: 'temp_high',
        title: 'High Temperature Detected',
        message: `Temperature at ${liveData.temperature}°C exceeds 31°C threshold. Cooling fan is active.`,
        timestamp: 'Active now',
        severity: 'medium',
        category: 'Environment'
      });
    }

    if (liveData?.temperature > 35) {
      events.push({
        id: 'temp_critical',
        title: 'Critical Temperature Level',
        message: `Temperature at ${liveData.temperature}°C is critically high (>35°C). Immediate attention required.`,
        timestamp: 'Active now',
        severity: 'high',
        category: 'Environment'
      });
    }

    if (liveData?.soilMoisture < 30) {
      events.push({
        id: 'soil_low',
        title: 'Low Soil Moisture Alert',
        message: `Soil moisture at ${liveData.soilMoisture}% is below 30% threshold. Water pump is active.`,
        timestamp: 'Active now',
        severity: 'medium',
        category: 'Irrigation'
      });
    }

    if (liveData?.soilMoisture < 15) {
      events.push({
        id: 'soil_critical',
        title: 'Critical Soil Moisture — Drought Risk',
        message: `Soil moisture at ${liveData.soilMoisture}% is critically low (<15%). Crop stress risk elevated.`,
        timestamp: 'Active now',
        severity: 'high',
        category: 'Irrigation'
      });
    }

    if (liveData?.humidity < 40) {
      events.push({
        id: 'humidity_low',
        title: 'Low Humidity Alert',
        message: `Humidity at ${liveData.humidity}% is below recommended 40% range. Monitor crop transpiration.`,
        timestamp: 'Active now',
        severity: 'medium',
        category: 'Environment'
      });
    }

    if (liveData?.humidity > 85) {
      events.push({
        id: 'humidity_high',
        title: 'High Humidity Warning',
        message: `Humidity at ${liveData.humidity}% exceeds 85%. Risk of fungal disease. Increase ventilation.`,
        timestamp: 'Active now',
        severity: 'medium',
        category: 'Environment'
      });
    }

    if (!liveData?.esp32Online) {
      events.push({
        id: 'esp32_offline',
        title: 'ESP32 Controller Offline',
        message: 'ESP32 heartbeat lost. Check Wi-Fi connection and power supply.',
        timestamp: 'Active now',
        severity: 'high',
        category: 'System'
      });
    }

    if (maintenanceStats?.fan?.dailyActivations > 18) {
      events.push({
        id: 'fan_freq',
        title: 'High Fan Activation Frequency',
        message: `Cooling fan has cycled ON ${maintenanceStats.fan.dailyActivations} times today. Thermal load is elevated.`,
        timestamp: 'Today',
        severity: 'info',
        category: 'Maintenance'
      });
    }

    if (maintenanceStats?.pump?.dailyActivations > 12) {
      events.push({
        id: 'pump_freq',
        title: 'High Pump Activation Frequency',
        message: `Water pump cycling frequently (${maintenanceStats.pump.dailyActivations} times today). Inspect soil drainage.`,
        timestamp: 'Today',
        severity: 'info',
        category: 'Maintenance'
      });
    }

    if (liveData?.fan) {
      events.push({
        id: 'fan_active',
        title: 'Cooling Fan Active',
        message: 'Fan is currently running due to high temperature threshold trigger.',
        timestamp: 'Active now',
        severity: 'info',
        category: 'Automation'
      });
    }

    if (liveData?.pump) {
      events.push({
        id: 'pump_active',
        title: 'Water Pump Active',
        message: 'Irrigation pump is currently running due to low soil moisture trigger.',
        timestamp: 'Active now',
        severity: 'info',
        category: 'Automation'
      });
    }

    return events;
  };

  const eventLog = buildEventLog();
  const filteredHistory = filterSeverity === 'all'
    ? eventLog
    : filterSeverity === 'warning'
      ? eventLog.filter(item => item.severity === 'medium' || item.severity === 'high')
      : eventLog.filter(item => item.severity === 'info');

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>Alerts &amp; Event Logs</h2>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Real-time active notifications derived from live sensor readings
        </div>
      </div>

      {/* Active Alerts Banner */}
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px', color: '#fff' }}>
        Active System Notifications
      </h3>
      <AlertBanner liveData={liveData} maintenanceStats={maintenanceStats} />

      {/* Event Log */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">
              <Bell size={20} style={{ color: 'var(--accent-amber)' }} />
              Current Alert &amp; Event Status
            </div>
            <div className="card-subtitle">Based on live sensor values and actuator states</div>
          </div>

          <div className="filter-group">
            <button 
              className={`filter-btn ${filterSeverity === 'all' ? 'active' : ''}`}
              onClick={() => setFilterSeverity('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${filterSeverity === 'warning' ? 'active' : ''}`}
              onClick={() => setFilterSeverity('warning')}
            >
              Warnings
            </button>
            <button 
              className={`filter-btn ${filterSeverity === 'info' ? 'active' : ''}`}
              onClick={() => setFilterSeverity('info')}
            >
              Info
            </button>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '30px',
            color: 'var(--text-muted)',
            fontSize: '0.88rem'
          }}>
            No events in this category. All systems are operating within normal parameters.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredHistory.map((item) => (
              <div 
                key={item.id}
                style={{
                  background: 'rgba(0,0,0,0.25)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px'
                }}
              >
                {(item.severity === 'medium' || item.severity === 'high') ? (
                  <AlertTriangle size={20} style={{ color: item.severity === 'high' ? 'var(--accent-danger)' : 'var(--accent-amber)', flexShrink: 0, marginTop: '2px' }} />
                ) : (
                  <Info size={20} style={{ color: 'var(--accent-blue)', flexShrink: 0, marginTop: '2px' }} />
                )}

                <div style={{ flexGrow: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                    <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>{item.title}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{item.timestamp}</span>
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {item.message}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      background: 'rgba(255,255,255,0.06)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      color: 'var(--text-muted)'
                    }}>
                      {item.category}
                    </span>
                    <span style={{
                      fontSize: '0.7rem',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontWeight: 700,
                      background: item.severity === 'high' ? 'rgba(255,82,82,0.15)' : item.severity === 'medium' ? 'rgba(255,145,0,0.15)' : 'rgba(0,176,255,0.15)',
                      color: item.severity === 'high' ? 'var(--accent-danger)' : item.severity === 'medium' ? 'var(--accent-amber)' : 'var(--accent-blue)'
                    }}>
                      {item.severity === 'high' ? 'HIGH' : item.severity === 'medium' ? 'WARNING' : 'INFO'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
