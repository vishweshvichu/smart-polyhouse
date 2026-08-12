import React from 'react';
import SensorCard from '../components/SensorCard';
import StatusBadge from '../components/StatusBadge';
import AutomationRuleCard from '../components/AutomationRuleCard';
import AlertBanner from '../components/AlertBanner';
import MaintenanceCard from '../components/MaintenanceCard';
import SensorTrendChart from '../charts/SensorTrendChart';
import { Cpu, Wind, Droplets, Activity, Zap, CheckCircle2, AlertTriangle, WifiOff } from 'lucide-react';

export default function Dashboard({ 
  liveData, 
  historicalData, 
  maintenanceStats,
  isESP32Online,
  lastSeenSeconds
}) {
  // Format "last seen" text from the heartbeat age
  const lastSeenText = lastSeenSeconds === null
    ? 'Unknown'
    : lastSeenSeconds < 5
      ? `${lastSeenSeconds}s ago`
      : lastSeenSeconds < 60
        ? `${lastSeenSeconds}s ago`
        : `${Math.floor(lastSeenSeconds / 60)}m ${lastSeenSeconds % 60}s ago`;

  // Calculate active alerts count for status banner
  const activeAlerts = [];
  if (!isESP32Online) activeAlerts.push('ESP32 offline');
  if (liveData?.temperature > 31) activeAlerts.push('high temperature');
  if (liveData?.soilMoisture < 30) activeAlerts.push('low soil moisture');

  const systemStatus = !isESP32Online
    ? { type: 'offline', color: 'var(--accent-danger)', bg: 'rgba(255, 82, 82, 0.08)', border: 'rgba(255, 82, 82, 0.3)', icon: WifiOff, text: 'ESP32 Offline — Check hardware and Wi-Fi connection', sub: `Last seen: ${lastSeenText}` }
    : activeAlerts.length > 0
      ? { type: 'warning', color: 'var(--accent-amber)', bg: 'rgba(255, 145, 0, 0.08)', border: 'rgba(255, 145, 0, 0.3)', icon: AlertTriangle, text: `Attention required: ${activeAlerts.length} active alert${activeAlerts.length > 1 ? 's' : ''}`, sub: activeAlerts.join(' · ') }
      : { type: 'ok', color: 'var(--accent-green-bright)', bg: 'rgba(46, 204, 113, 0.08)', border: 'rgba(46, 204, 113, 0.3)', icon: CheckCircle2, text: 'Smart Polyhouse is running normally', sub: `ESP32 online · Last seen: ${lastSeenText}` };

  const StatusIcon = systemStatus.icon;

  return (
    <div>
      {/* System Status Banner */}
      <div style={{
        background: systemStatus.bg,
        border: `1px solid ${systemStatus.border}`,
        borderRadius: 'var(--radius-md)',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <StatusIcon size={20} style={{ color: systemStatus.color, flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.92rem', color: systemStatus.color }}>
            {systemStatus.text}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            {systemStatus.sub}
          </div>
        </div>
      </div>

      {/* Alert Banner for active events */}
      <AlertBanner liveData={liveData} maintenanceStats={maintenanceStats} />

      {/* 1. LIVE SENSOR MONITORING */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>Live Sensor Telemetry</h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Real-time ESP32 Wireless Monitoring (Firebase RTDB)
            </div>
          </div>
        </div>

        <div className="grid-3">
          <SensorCard
            title="Temperature"
            value={liveData?.temperature}
            unit="°C"
            type="temperature"
          />
          <SensorCard
            title="Humidity"
            value={liveData?.humidity}
            unit="%"
            type="humidity"
          />
          <SensorCard
            title="Soil Moisture"
            value={liveData?.soilMoisture}
            unit="%"
            type="soilMoisture"
          />
        </div>
      </div>

      {/* 2. DEVICE STATUS & AUTOMATIC CONTROL STATUS */}
      <div className="grid-2" style={{ marginBottom: '28px' }}>
        {/* Device Status Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <Zap size={20} style={{ color: 'var(--accent-amber)' }} />
                Hardware Device Status
              </div>
              <div className="card-subtitle">Real-time actuator &amp; controller heartbeat</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              background: 'rgba(0,0,0,0.25)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Cpu size={22} style={{ color: isESP32Online ? 'var(--accent-green-bright)' : 'var(--accent-danger)' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>ESP32 Microcontroller</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Wi-Fi Client (GPIO 4, 34, 27, 26, 21, 22)</div>
                  <div style={{ fontSize: '0.75rem', color: isESP32Online ? 'var(--accent-green-bright)' : 'var(--accent-danger)', marginTop: '2px', fontWeight: 600 }}>
                    Last seen: {lastSeenText}
                  </div>
                </div>
              </div>
              <StatusBadge status={isESP32Online} type="online" />
            </div>

            <div style={{
              background: 'rgba(0,0,0,0.25)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Wind size={22} style={{ color: liveData?.fan ? 'var(--accent-blue)' : 'var(--text-muted)' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>5V DC Cooling Fan</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Active-Low Relay 1 (GPIO 27)</div>
                </div>
              </div>
              <StatusBadge status={liveData?.fan} />
            </div>

            <div style={{
              background: 'rgba(0,0,0,0.25)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Droplets size={22} style={{ color: liveData?.pump ? 'var(--accent-blue)' : 'var(--text-muted)' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>5V DC Water Pump</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Active-Low Relay 2 (GPIO 26)</div>
                </div>
              </div>
              <StatusBadge status={liveData?.pump} />
            </div>
          </div>
        </div>

        {/* 3. Automatic Control Status Card */}
        <AutomationRuleCard liveData={liveData} />
      </div>

      {/* QUICK ANALYTICS PREVIEW & MAINTENANCE PREVIEW */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <Activity size={20} style={{ color: 'var(--accent-blue)' }} />
                Environmental Trend Overview
              </div>
              <div className="card-subtitle">Last 7 Days Sensor History</div>
            </div>
          </div>
          <SensorTrendChart data={historicalData.slice(-7)} timeRange="7d" />
        </div>

        <MaintenanceCard
          title="Fan Operating Patterns"
          deviceType="fan"
          stats={maintenanceStats.fan}
        />
      </div>
    </div>
  );
}
