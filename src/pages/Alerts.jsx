import React, { useState } from 'react';
import AlertBanner from '../components/AlertBanner';
import { Bell, AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

export default function Alerts({ liveData, maintenanceStats }) {
  const [filterSeverity, setFilterSeverity] = useState('all');

  const historyLogs = [
    {
      id: 1,
      title: 'High Temperature Detected',
      message: 'Temperature reached 32.4°C (Threshold > 31°C). Fan automatically turned ON.',
      timestamp: 'Today, 02:15 PM',
      severity: 'medium',
      category: 'Environment'
    },
    {
      id: 2,
      title: 'Low Soil Moisture Alert',
      message: 'Moisture dropped to 28% (Threshold < 30%). Water pump automatically turned ON.',
      timestamp: 'Today, 11:30 AM',
      severity: 'medium',
      category: 'Irrigation'
    },
    {
      id: 3,
      title: 'Fan Hysteresis OFF',
      message: 'Temperature cooled to 27.8°C (Threshold < 28°C). Fan automatically turned OFF.',
      timestamp: 'Today, 02:42 PM',
      severity: 'info',
      category: 'Automation'
    },
    {
      id: 4,
      title: 'ESP32 Wi-Fi Telemetry Ping',
      message: 'System heartbeats active. Firebase RTDB sync interval: 3000ms.',
      timestamp: 'Today, 08:00 AM',
      severity: 'info',
      category: 'System'
    }
  ];

  const filteredHistory = filterSeverity === 'all' 
    ? historyLogs 
    : historyLogs.filter(item => item.severity === filterSeverity);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>Alerts & Event Logs</h2>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Realtime active notifications & historical operational event history
        </div>
      </div>

      {/* Active Alerts Banner */}
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px', color: '#fff' }}>
        Active System Notifications
      </h3>
      <AlertBanner liveData={liveData} maintenanceStats={maintenanceStats} />

      {/* Event History Logs */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">
              <Bell size={20} style={{ color: 'var(--accent-amber)' }} />
              Recent Event History Log
            </div>
            <div className="card-subtitle">Automated actions & telemetry events</div>
          </div>

          <div className="filter-group">
            <button 
              className={`filter-btn ${filterSeverity === 'all' ? 'active' : ''}`}
              onClick={() => setFilterSeverity('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${filterSeverity === 'medium' ? 'active' : ''}`}
              onClick={() => setFilterSeverity('medium')}
            >
              Warnings
            </button>
            <button 
              className={`filter-btn ${filterSeverity === 'info' ? 'active' : ''}`}
              onClick={() => setFilterSeverity('info')}
            >
              Informational
            </button>
          </div>
        </div>

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
              {item.severity === 'medium' ? (
                <AlertTriangle size={20} style={{ color: 'var(--accent-amber)', flexShrink: 0, marginTop: '2px' }} />
              ) : (
                <Info size={20} style={{ color: 'var(--accent-blue)', flexShrink: 0, marginTop: '2px' }} />
              )}

              <div style={{ flexGrow: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>{item.title}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.timestamp}</span>
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {item.message}
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <span style={{
                    fontSize: '0.7rem',
                    background: 'rgba(255,255,255,0.06)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    color: 'var(--text-muted)'
                  }}>
                    Category: {item.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
