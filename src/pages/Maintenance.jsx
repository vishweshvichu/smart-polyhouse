import React from 'react';
import MaintenanceCard from '../components/MaintenanceCard';
import { Wrench, ShieldCheck, Activity } from 'lucide-react';

export default function Maintenance({ maintenanceStats }) {
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>Smart Maintenance Analytics</h2>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Continuous operating pattern diagnostics & duty cycle tracking (No arbitrary health scores)
        </div>
      </div>

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
