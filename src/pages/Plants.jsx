import React from 'react';
import { Sprout, PlusCircle, CheckCircle2, Clock, Layers } from 'lucide-react';
import { INITIAL_PLANTS } from '../utils/constants';

export default function Plants({ selectedPlant, setSelectedPlant }) {
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>Multi-Plant Management</h2>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Scalable multi-crop polyhouse cultivation structure. Easily map new ESP32 nodes to additional plants.
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: '28px' }}>
        {INITIAL_PLANTS.map((plant) => {
          const isSelected = selectedPlant === plant.id;
          return (
            <div
              key={plant.id}
              className="card"
              style={{
                borderColor: isSelected ? 'var(--accent-green)' : 'var(--border-color)',
                boxShadow: isSelected ? 'var(--shadow-glow)' : 'none',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedPlant(plant.id)}
            >
              <div className="card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    background: plant.active ? 'rgba(46, 204, 113, 0.15)' : 'rgba(255,255,255,0.05)',
                    padding: '10px',
                    borderRadius: '12px',
                    color: plant.active ? 'var(--accent-green-bright)' : 'var(--text-muted)'
                  }}>
                    <Sprout size={24} />
                  </div>
                  <div>
                    <div className="card-title">{plant.name}</div>
                    <div className="card-subtitle">{plant.crop}</div>
                  </div>
                </div>
              </div>

              <div style={{ margin: '16px 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Status:</span>
                  <span style={{
                    fontWeight: 700,
                    color: plant.active ? 'var(--accent-green-bright)' : 'var(--text-muted)'
                  }}>
                    {plant.active ? '● LIVE MONITORING' : 'PLANNED'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Firebase DB Node:</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                    polyhouse/{plant.id}
                  </span>
                </div>
              </div>

              <button
                className={isSelected ? 'btn-primary' : 'btn-secondary'}
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPlant(plant.id);
                }}
              >
                {isSelected ? 'Currently Selected' : 'Select Plant View'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Database Scalability Architecture Guide */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Layers size={20} style={{ color: 'var(--accent-blue)' }} />
            Firebase Multi-Plant Database Architecture
          </div>
        </div>

        <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <p style={{ marginBottom: '14px' }}>
            The Smart Polyhouse database tree is engineered to support infinite horizontal scaling across multiple polyhouse bays and plant species:
          </p>

          <pre style={{
            background: 'rgba(0,0,0,0.4)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
            color: 'var(--accent-green-bright)',
            overflowX: 'auto',
            border: '1px solid var(--border-color)'
          }}>
            {`polyhouse/
├── plant_01/                 <-- Active Polyhouse Bay 1 (Tomatoes)
│   ├── live/                 <-- ESP32 Realtime Sensor & Actuator payload
│   ├── analytics/daily/      <-- Historical daily time-series logs
│   └── maintenance/          <-- Cumulative fan & pump runtime counters
├── plant_02/                 <-- Bay 2 (Strawberry)
└── plant_03/                 <-- Bay 3 (Cucumber Hydroponic)`}
          </pre>
        </div>
      </div>
    </div>
  );
}
