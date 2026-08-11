import React from 'react';
import { Wrench, AlertTriangle, Info, Clock, PlayCircle, Activity } from 'lucide-react';
import { analyzeMaintenanceStatus } from '../utils/maintenanceCalculator';

export default function MaintenanceCard({ title, deviceType, stats }) {
  const analysis = analyzeMaintenanceStatus(deviceType, stats);

  return (
    <div className="card">
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'rgba(255, 145, 0, 0.1)',
            padding: '10px',
            borderRadius: '12px',
            color: 'var(--accent-amber)'
          }}>
            <Wrench size={22} />
          </div>
          <div>
            <div className="card-title">{title}</div>
            <div className="card-subtitle">Empirical runtime & operating pattern analysis</div>
          </div>
        </div>
      </div>

      {/* Grid of metrics */}
      <div className="grid-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
        <div style={{ background: 'rgba(0,0,0,0.25)', padding: '12px', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Daily Runtime</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>{analysis.formattedDailyRuntime}</div>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.25)', padding: '12px', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Weekly Runtime</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>{analysis.formattedWeeklyRuntime}</div>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.25)', padding: '12px', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Total Runtime</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>{analysis.formattedTotalRuntime}</div>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.25)', padding: '12px', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Daily Activations</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-green-bright)' }}>{analysis.dailyActivations} cycles</div>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.25)', padding: '12px', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Total Activations</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-green-bright)' }}>{analysis.totalActivations} cycles</div>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.25)', padding: '12px', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Avg Cycle Duration</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-blue)' }}>{analysis.formattedAvgCycle}</div>
        </div>
      </div>

      {/* Maintenance Indicators & Recommendations */}
      <div>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>
          Operating Pattern Insights
        </div>

        {analysis.recommendations.map((rec, index) => {
          const isWarning = rec.type === 'warning';
          return (
            <div 
              key={index}
              className="maintenance-recommendation-box"
              style={{
                borderColor: isWarning ? 'rgba(255, 145, 0, 0.4)' : 'rgba(46, 204, 113, 0.3)',
                background: isWarning 
                  ? 'linear-gradient(135deg, rgba(255, 145, 0, 0.08), rgba(24, 40, 30, 0.8))'
                  : 'linear-gradient(135deg, rgba(46, 204, 113, 0.06), rgba(24, 40, 30, 0.8))'
              }}
            >
              {isWarning ? (
                <AlertTriangle size={20} style={{ color: 'var(--accent-amber)', flexShrink: 0, marginTop: '2px' }} />
              ) : (
                <Info size={20} style={{ color: 'var(--accent-green-bright)', flexShrink: 0, marginTop: '2px' }} />
              )}
              <div>
                <span className="recommendation-tag" style={{
                  background: isWarning ? 'var(--accent-amber)' : 'var(--accent-green)',
                  color: isWarning ? '#000' : '#0b130e'
                }}>
                  {rec.label}
                </span>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                  {rec.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
