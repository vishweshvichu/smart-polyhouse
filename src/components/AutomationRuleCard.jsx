import React from 'react';
import { Wind, Droplet, ShieldCheck, Cpu } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { CONTROL_RULES } from '../utils/constants';

export default function AutomationRuleCard({ liveData }) {
  const fanActive = liveData?.fan || false;
  const pumpActive = liveData?.pump || false;
  const currentTemp = liveData?.temperature || 0;
  const currentSoil = liveData?.soilMoisture || 0;

  const isSystemWorking = fanActive || pumpActive;

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">
            <Cpu size={20} style={{ color: 'var(--accent-green-bright)' }} />
            Automatic Control Status
          </div>
          <div className="card-subtitle">
            Hysteresis Control Logic running on ESP32
          </div>
        </div>

        <div>
          <StatusBadge status={isSystemWorking} type="system" />
        </div>
      </div>

      {/* Fan Automation Rule */}
      <div className="rule-item">
        <div className="rule-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wind size={18} style={{ color: fanActive ? 'var(--accent-blue)' : 'var(--text-muted)' }} />
            <span className="rule-name">5V DC Cooling Fan (GPIO 27)</span>
          </div>
          <StatusBadge status={fanActive} />
        </div>

        <div className="rule-pills">
          <span className="rule-pill on">ON when Temperature &gt; 31°C</span>
          <span className="rule-pill off">OFF when Temperature &lt; 28°C</span>
        </div>

        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px' }}>
          Current Temp: <strong style={{ color: currentTemp > 31 ? '#ff5252' : '#fff' }}>{currentTemp} °C</strong> 
          {fanActive ? ' ➔ Cooling fan actively regulating climate' : ' ➔ Within target hysteresis band'}
        </div>
      </div>

      {/* Pump Automation Rule */}
      <div className="rule-item">
        <div className="rule-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Droplet size={18} style={{ color: pumpActive ? 'var(--accent-blue)' : 'var(--text-muted)' }} />
            <span className="rule-name">5V DC Water Pump (GPIO 26)</span>
          </div>
          <StatusBadge status={pumpActive} />
        </div>

        <div className="rule-pills">
          <span className="rule-pill on">ON when Soil Moisture &lt; 30%</span>
          <span className="rule-pill off">OFF when Soil Moisture &gt; 70%</span>
        </div>

        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px' }}>
          Current Soil Moisture: <strong style={{ color: currentSoil < 30 ? '#ff9100' : '#fff' }}>{currentSoil} %</strong>
          {pumpActive ? ' ➔ Irrigation pump actively irrigating soil' : ' ➔ Moisture level satisfactory'}
        </div>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px dashed var(--border-color)',
        borderRadius: 'var(--radius-sm)',
        padding: '10px 14px',
        fontSize: '0.78rem',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <ShieldCheck size={16} style={{ color: 'var(--accent-green)' }} />
        <span>Hardware Relays are ACTIVE LOW (HIGH = OFF, LOW = ON). Autonomous failsafe active.</span>
      </div>
    </div>
  );
}
