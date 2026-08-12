import React from 'react';
import MaintenanceCard from '../components/MaintenanceCard';
import { ShieldCheck, Cpu, Wifi, WifiOff, Clock } from 'lucide-react';

export default function Maintenance({ maintenanceStats, liveData, isESP32Online, lastSeenSeconds }) {
  const lastSeenText = lastSeenSeconds === null
    ? 'Unknown'
    : lastSeenSeconds < 60
      ? `${lastSeenSeconds}s ago`
      : `${Math.floor(lastSeenSeconds / 60)}m ${lastSeenSeconds % 60}s ago`;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>Maintenance &amp; System Status</h2>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Operating pattern diagnostics, duty cycle tracking, and hardware status
        </div>
      </div>

      {/* System Health Overview */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <div className="card-header">
          <div className="card-title">
            <Cpu size={20} style={{ color: 'var(--accent-blue)' }} />
            System Health Overview
          </div>
          <div className="card-subtitle">Current hardware and connection status</div>
        </div>

        <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          {/* ESP32 Status */}
          <div style={{
            background: 'rgba(0,0,0,0.25)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            borderLeft: `3px solid ${isESP32Online ? 'var(--accent-green-bright)' : 'var(--accent-danger)'}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              {isESP32Online
                ? <Wifi size={16} style={{ color: 'var(--accent-green-bright)' }} />
                : <WifiOff size={16} style={{ color: 'var(--accent-danger)' }} />
              }
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>ESP32 Status</span>
            </div>
            <div style={{ fontWeight: 700, color: isESP32Online ? 'var(--accent-green-bright)' : 'var(--accent-danger)', fontSize: '1rem' }}>
              {isESP32Online ? 'ONLINE' : 'OFFLINE'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Last seen: {lastSeenText}
            </div>
          </div>

          {/* Sensor Status */}
          <div style={{
            background: 'rgba(0,0,0,0.25)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            borderLeft: `3px solid ${isESP32Online ? 'var(--accent-green-bright)' : 'var(--text-muted)'}`
          }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '8px' }}>Sensor Readings</div>
            {liveData && isESP32Online ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                  🌡 Temp: <strong style={{ color: '#ff5252' }}>{liveData.temperature}°C</strong>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                  💧 Humidity: <strong style={{ color: '#00b0ff' }}>{liveData.humidity}%</strong>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                  🌱 Soil: <strong style={{ color: '#2ecc71' }}>{liveData.soilMoisture}%</strong>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Awaiting data...</div>
            )}
          </div>

          {/* Actuator Status */}
          <div style={{
            background: 'rgba(0,0,0,0.25)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            borderLeft: '3px solid var(--accent-blue)'
          }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '8px' }}>Actuator Status</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                🌀 Fan: <strong style={{ color: liveData?.fan ? 'var(--accent-blue)' : 'var(--text-muted)' }}>
                  {liveData?.fan ? 'ACTIVE' : 'OFF'}
                </strong>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                💦 Pump: <strong style={{ color: liveData?.pump ? 'var(--accent-blue)' : 'var(--text-muted)' }}>
                  {liveData?.pump ? 'ACTIVE' : 'OFF'}
                </strong>
              </div>
            </div>
          </div>

          {/* Last Data Received */}
          <div style={{
            background: 'rgba(0,0,0,0.25)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            borderLeft: '3px solid var(--accent-amber)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Clock size={16} style={{ color: 'var(--accent-amber)' }} />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Last Data Received</span>
            </div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
              {liveData?.timestamp
                ? new Date(liveData.timestamp).toLocaleTimeString()
                : 'N/A'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Firebase RTDB sync
            </div>
          </div>
        </div>
      </div>

      {/* Device Diagnostics */}
      <div className="grid-2" style={{ marginBottom: '28px' }}>
        <MaintenanceCard 
          title="5V DC Cooling Fan Diagnostics"
          deviceType="fan"
          stats={maintenanceStats.fan}
        />

        <MaintenanceCard 
          title="5V DC Water Pump Diagnostics"
          deviceType="pump"
          stats={maintenanceStats.pump}
        />
      </div>

      {/* Predictive Maintenance Methodology */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <ShieldCheck size={20} style={{ color: 'var(--accent-green-bright)' }} />
            Maintenance Indicator Methodology
          </div>
        </div>

        <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <p style={{ marginBottom: '10px' }}>
            Our smart maintenance system evaluates real runtime trends and activation frequency metrics against historical baselines:
          </p>
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>
              <strong style={{ color: '#fff' }}>Duty Cycle Trend Analysis:</strong> Monitors if fan daily runtime increases significantly (&gt;25%) over prior baseline, flagging dust accumulation or louver resistance.
            </li>
            <li>
              <strong style={{ color: '#fff' }}>Rapid Cycle Detection:</strong> Identifies short ON/OFF oscillations (&lt;90 seconds per cycle) that can stress mechanical relay contacts.
            </li>
            <li>
              <strong style={{ color: '#fff' }}>Irrigation Flow Pattern Monitoring:</strong> Flags increased pump activation counts to signal potential drip emitter blockage or soil moisture sensor drift.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
