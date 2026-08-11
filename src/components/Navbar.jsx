import React from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  Sprout, 
  Wrench, 
  Bell, 
  Settings, 
  Activity,
  LogOut
} from 'lucide-react';
import { PROJECT_INFO } from '../utils/constants';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'plants', label: 'Plants Management', icon: Sprout },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench },
  { id: 'alerts', label: 'Alerts & Events', icon: Bell },
  { id: 'settings', label: 'Settings & Config', icon: Settings },
];

export default function Navbar({ activeTab, setActiveTab, isOpen, setIsOpen, alertCount = 0, onLogout }) {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="brand-icon">
          <Activity size={24} />
        </div>
        <div>
          <h2 className="brand-title">{PROJECT_INFO.name}</h2>
          <div className="brand-tagline">{PROJECT_INFO.tagline}</div>
        </div>
      </div>

      <ul className="nav-list">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <li key={item.id} className={`nav-item ${isActive ? 'active' : ''}`}>
              <button 
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
              >
                <Icon size={20} />
                <span>{item.label}</span>
                {item.id === 'alerts' && alertCount > 0 && (
                  <span style={{
                    marginLeft: 'auto',
                    background: '#ff5252',
                    color: '#fff',
                    borderRadius: '10px',
                    padding: '2px 8px',
                    fontSize: '0.72rem',
                    fontWeight: 800
                  }}>
                    {alertCount}
                  </span>
                )}
              </button>
            </li>
          );
        })}

        {/* Logout Action Button */}
        {onLogout && (
          <li className="nav-item logout-item" style={{ marginTop: 'auto' }}>
            <button 
              onClick={onLogout}
              style={{
                color: 'var(--accent-danger)',
                border: '1px solid transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                width: '100%',
                padding: '12px 16px',
                background: 'transparent',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.92rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 82, 82, 0.08)';
                e.currentTarget.style.color = '#ff5252';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--accent-danger)';
              }}
            >
              <LogOut size={20} />
              <span>Log Out</span>
            </button>
          </li>
        )}
      </ul>

      <div className="sidebar-footer">
        <div style={{ fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
          AI Precision Farming v1.0
        </div>
        <div>ESP32 Hardware Linked</div>
        <div style={{ color: 'var(--accent-green-bright)', fontSize: '0.7rem', marginTop: '6px' }}>
          • Active-Low Relay Logic
        </div>
      </div>
    </aside>
  );
}
