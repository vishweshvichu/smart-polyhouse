import React from 'react';
import { Menu, Wifi, Radio, RefreshCw } from 'lucide-react';
import PlantSelector from './PlantSelector';
import { formatTimestamp } from '../utils/formatters';

export default function Header({ 
  title, 
  subtitle, 
  toggleSidebar, 
  selectedPlant, 
  setSelectedPlant,
  isDemoMode,
  setIsDemoMode,
  lastUpdated,
  esp32Online
}) {
  return (
    <header className="header">
      <div className="header-left">
        <button className="mobile-toggle" onClick={toggleSidebar} title="Toggle menu">
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

        {/* Demo Simulator Toggle */}
        <button 
          className={`btn-secondary ${isDemoMode ? 'active' : ''}`}
          onClick={() => setIsDemoMode(!isDemoMode)}
          style={{
            fontSize: '0.8rem',
            padding: '6px 12px',
            borderColor: isDemoMode ? 'var(--accent-green)' : 'var(--border-color)',
            background: isDemoMode ? 'rgba(46, 204, 113, 0.15)' : 'transparent',
            color: isDemoMode ? 'var(--accent-green-bright)' : 'var(--text-secondary)'
          }}
          title="Toggle live simulation engine for presentation"
        >
          <RefreshCw size={14} className={isDemoMode ? 'spin' : ''} />
          {isDemoMode ? 'Demo Simulator ON' : 'Live Firebase'}
        </button>

        {/* System Online Status Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}>
          <span className={`pulse-dot ${esp32Online ? 'online' : 'offline'}`}></span>
          <span style={{ 
            color: esp32Online ? 'var(--accent-green-bright)' : 'var(--accent-danger)',
            fontWeight: 700 
          }}>
            {esp32Online ? 'ESP32 ONLINE' : 'ESP32 OFFLINE'}
          </span>
        </div>

        {/* Last updated timestamp */}
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {formatTimestamp(lastUpdated)}
        </div>
      </div>
    </header>
  );
}
