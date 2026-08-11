import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function AlertBanner({ liveData, maintenanceStats }) {
  const alerts = [];

  if (!liveData?.esp32Online) {
    alerts.push({
      id: 'offline',
      severity: 'high',
      title: 'ESP32 Controller Offline',
      message: 'Wi-Fi connection interrupted or hardware powered down. Check power supply and router status.',
      time: 'Just now'
    });
  }

  if (liveData?.temperature > 31) {
    alerts.push({
      id: 'high_temp',
      severity: 'medium',
      title: 'High Temperature Detected',
      message: `Current Polyhouse temperature (${liveData.temperature} °C) exceeds 31°C threshold. Cooling fan active.`,
      time: 'Active'
    });
  }

  if (liveData?.soilMoisture < 30) {
    alerts.push({
      id: 'low_soil',
      severity: 'medium',
      title: 'Low Soil Moisture Alert',
      message: `Soil moisture level (${liveData.soilMoisture} %) dropped below 30% setpoint. Water pump active.`,
      time: 'Active'
    });
  }

  if (maintenanceStats?.fan?.dailyActivations > 18) {
    alerts.push({
      id: 'fan_freq',
      severity: 'low',
      title: 'High Fan Activation Frequency',
      message: 'Cooling fan has cycled ON more than 18 times today. Thermal load is elevated.',
      time: 'Today'
    });
  }

  if (maintenanceStats?.pump?.dailyActivations > 12) {
    alerts.push({
      id: 'pump_freq',
      severity: 'low',
      title: 'High Pump Activation Frequency',
      message: 'Water pump cycling frequently. Inspect crop evapotranspiration and soil drainage rates.',
      time: 'Today'
    });
  }

  if (alerts.length === 0) {
    return (
      <div style={{
        background: 'rgba(46, 204, 113, 0.08)',
        border: '1px solid rgba(46, 204, 113, 0.3)',
        borderRadius: 'var(--radius-md)',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        color: 'var(--accent-green-bright)',
        marginBottom: '20px'
      }}>
        <CheckCircle size={20} />
        <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>
          All climate and irrigation parameters are nominal. Polyhouse environment is optimal.
        </span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
      {alerts.map((alert) => {
        const isHigh = alert.severity === 'high';
        const isMed = alert.severity === 'medium';
        const color = isHigh ? 'var(--accent-danger)' : isMed ? 'var(--accent-amber)' : 'var(--accent-blue)';
        const border = isHigh ? 'rgba(255, 82, 82, 0.4)' : isMed ? 'rgba(255, 145, 0, 0.4)' : 'rgba(0, 176, 255, 0.4)';

        return (
          <div 
            key={alert.id}
            style={{
              background: 'var(--bg-card)',
              borderLeft: `4px solid ${color}`,
              borderTop: `1px solid ${border}`,
              borderRight: `1px solid ${border}`,
              borderBottom: `1px solid ${border}`,
              borderRadius: 'var(--radius-md)',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px'
            }}
          >
            {isHigh ? <AlertCircle size={20} style={{ color }} /> : <AlertTriangle size={20} style={{ color }} />}
            <div style={{ flexGrow: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.92rem', color: '#fff' }}>{alert.title}</strong>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{alert.time}</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {alert.message}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
