import React from 'react';
import { Menu } from 'lucide-react';
import PlantSelector from './PlantSelector';
import { formatTimestamp } from '../utils/formatters';

export default function Header({ 
  title, 
  subtitle, 
  toggleSidebar, 
  selectedPlant, 
  setSelectedPlant,
  lastUpdated,
  esp32Online
}) {
  return (
    <header className="header">
      <div className="header-left">
        <button className="mobile-toggle" onClick={toggleSidebar} title="Toggle menu" aria-label="Open navigation menu">
          <Menu size={24} />
        </button>
        <div className="header-title-group">
          <h1>{title}</h1>
          <div className="header-subtitle">{subtitle}</div>
        </div>
      </div>

      <div className="header-right">
        {/* Multi-Plant Selector */}
        <PlantSelector 
          selectedPlant={selectedPlant} 
          setSelectedPlant={setSelectedPlant} 
        />

        {/* System Online Status Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', flexShrink: 0 }}>
          <span className={`pulse-dot ${esp32Online ? 'online' : 'offline'}`}></span>
          <span style={{ 
            color: esp32Online ? 'var(--accent-green-bright)' : 'var(--accent-danger)',
            fontWeight: 700,
            whiteSpace: 'nowrap'
          }}>
            {esp32Online ? 'ESP32 ONLINE' : 'ESP32 OFFLINE'}
          </span>
        </div>

        {/* Last updated timestamp — hidden on very small screens via CSS */}
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}
             className="header-timestamp">
          {formatTimestamp(lastUpdated)}
        </div>
      </div>
    </header>
  );
}
