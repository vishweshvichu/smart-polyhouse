import React from 'react';
import { Thermometer, Droplets, Gauge } from 'lucide-react';

export default function SensorCard({ title, value, unit, type, minTarget, maxTarget }) {
  let Icon = Thermometer;
  let accentColor = 'var(--accent-green)';
  let targetText = '';

  if (type === 'temperature') {
    Icon = Thermometer;
    accentColor = value > 31 ? 'var(--accent-danger)' : value < 20 ? 'var(--accent-blue)' : 'var(--accent-green)';
    targetText = 'Target: 20°C - 31°C (Fan triggers > 31°C)';
  } else if (type === 'humidity') {
    Icon = Droplets;
    accentColor = 'var(--accent-blue)';
    targetText = 'Target: 60% - 80% RH';
  } else if (type === 'soilMoisture') {
    Icon = Gauge;
    accentColor = value < 30 ? 'var(--accent-amber)' : 'var(--accent-green)';
    targetText = 'Target: 30% - 70% (Pump triggers < 30%)';
  }

  return (
    <div className="card sensor-card" style={{ '--card-accent': accentColor }}>
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            padding: '10px',
            borderRadius: '12px',
            color: accentColor
          }}>
            <Icon size={24} />
          </div>
          <div>
            <div className="card-title">{title}</div>
            <div className="card-subtitle">{targetText}</div>
          </div>
        </div>
      </div>

      <div className="sensor-value-group">
        <div className="sensor-value">
          {value !== undefined && value !== null ? value : '--'}
          <span className="sensor-unit">{unit}</span>
        </div>
      </div>

      <div className="sensor-footer">
        <span>Realtime ESP32 Readout</span>
        <span style={{ 
          fontFamily: 'var(--font-mono)', 
          color: 'var(--accent-green-bright)',
          fontSize: '0.75rem' 
        }}>
          ● Live Sync
        </span>
      </div>
    </div>
  );
}
