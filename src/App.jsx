import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Header from './components/Header';
import FirebaseStatusBanner from './components/FirebaseStatusBanner';

import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Plants from './pages/Plants';
import Maintenance from './pages/Maintenance';
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

import { Activity } from 'lucide-react';

import { 
  readLiveData, 
  subscribeToAnalytics, 
  subscribeToMaintenance
} from './services/firebaseService';
import { 
  startSimulation, 
  getSimulatedHistoricalData, 
  getSimulatedMaintenanceData 
} from './services/simulatorService';
import { isFirebaseConfigured } from './firebase/config';
import { subscribeToAuthChanges, logoutUser } from './services/authService';

export default function App() {
  const getTabFromPath = () => {
    const path = window.location.pathname;
    if (path === '/login') return 'login';
    if (path === '/signup') return 'signup';
    if (path === '/analytics') return 'analytics';
    if (path === '/maintenance') return 'maintenance';
    if (path === '/plants') return 'plants';
    if (path === '/alerts') return 'alerts';
    if (path === '/settings') return 'settings';
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath());
  const [selectedPlant, setSelectedPlant] = useState('plant_01');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Always start in Firebase mode (real data). The simulator is never used in production.
  // isDemoMode can only become true if explicitly toggled — it is never auto-set.
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState(null);

  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [liveData, setLiveData] = useState({
    temperature: 0,
    humidity: 0,
    soilMoisture: 0,
    fan: false,
    pump: false,
    fanActive: false,
    pumpActive: false,
    timestamp: Date.now(),
    lastSeen: Date.now(),
    esp32Online: false
  });

  // Heartbeat-derived online state — updated every second via interval
  const [isESP32Online, setIsESP32Online] = useState(false);
  const [lastSeenSeconds, setLastSeenSeconds] = useState(null);

  // One-time login success notification
  const [loginNotification, setLoginNotification] = useState(null);

  const [historicalData, setHistoricalData] = useState([]);
  const [maintenanceStats, setMaintenanceStats] = useState({
    fan: { totalRuntime: 0, dailyRuntime: 0, totalActivations: 0, dailyActivations: 0 },
    pump: { totalRuntime: 0, dailyRuntime: 0, totalActivations: 0, dailyActivations: 0 }
  });

  // Handle Real-Time Data feeds (Primary Firebase RTDB vs. Fallback Simulator)
  useEffect(() => {
    if (authLoading || (!currentUser && !isDemoMode)) {
      return;
    }
    let unsubs = [];
    let stopSimulator = null;

    setIsLoading(true);
    setFirebaseError(null);

    if (!isDemoMode && isFirebaseConfigured) {
      // 1. REALTIME LIVE SENSOR LISTENER (/polyhouse/plant_01/live)
      const unsubLive = readLiveData(
        selectedPlant,
        (data) => {
          setIsLoading(false);
          if (data) {
            setLiveData(data);
          }
        },
        (err) => {
          setIsLoading(false);
          setFirebaseError(err);
        }
      );
      unsubs.push(unsubLive);

      // 2. REALTIME HISTORICAL ANALYTICS LISTENER (/polyhouse/plant_01/analytics/daily)
      const unsubAnalytics = subscribeToAnalytics(
        selectedPlant,
        (data) => {
          if (data && data.length > 0) {
            setHistoricalData(data);
          } else {
            // Do not use fake/mock data when Firebase is available
            setHistoricalData([]);
          }
        },
        (err) => console.warn("Analytics listener warning:", err)
      );
      unsubs.push(unsubAnalytics);

      // 3. REALTIME MAINTENANCE LISTENER (/polyhouse/plant_01/maintenance)
      const unsubMaint = subscribeToMaintenance(
        selectedPlant,
        (data) => {
          if (data) {
            setMaintenanceStats(data);
          } else {
            // Do not use fake/mock data when Firebase is available
            setMaintenanceStats({
              fan: { totalRuntime: 0, dailyRuntime: 0, weeklyRuntime: 0, totalActivations: 0, dailyActivations: 0 },
              pump: { totalRuntime: 0, dailyRuntime: 0, weeklyRuntime: 0, totalActivations: 0, dailyActivations: 0 }
            });
          }
        },
        (err) => console.warn("Maintenance listener warning:", err)
      );
      unsubs.push(unsubMaint);

    } else {
      // FALLBACK SIMULATOR — only runs when isDemoMode is explicitly enabled.
      // This path is NEVER reached in normal production or development usage.
      // Firebase always initializes with the project config (env vars or hardcoded defaults).
      setIsLoading(false);
      setHistoricalData(getSimulatedHistoricalData(30));
      setMaintenanceStats(getSimulatedMaintenanceData());

      stopSimulator = startSimulation((simData) => {
        setLiveData(simData);
        setMaintenanceStats({ ...getSimulatedMaintenanceData() });
      });
    }

    return () => {
      unsubs.forEach(fn => typeof fn === 'function' && fn());
      if (stopSimulator) stopSimulator();
    };
  }, [selectedPlant, isDemoMode, authLoading, currentUser]);

  // Continuously compute online/offline from lastSeen heartbeat (every 1 second)
  useEffect(() => {
    const OFFLINE_THRESHOLD_MS = 5000;
    const tick = () => {
      const age = Date.now() - liveData.lastSeen;
      setIsESP32Online(age <= OFFLINE_THRESHOLD_MS);
      setLastSeenSeconds(Math.floor(age / 1000));
    };
    tick(); // run immediately
    const timerId = setInterval(tick, 1000);
    return () => clearInterval(timerId);
  }, [liveData.lastSeen]);

  // 1. Listen to Firebase auth changes
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Client-side URL routing redirection logic based on auth state
  useEffect(() => {
    if (authLoading) return;

    if (!currentUser && !isDemoMode) {
      // Allow /login and /signup when not authenticated
      const path = window.location.pathname;
      if (path !== '/login' && path !== '/signup') {
        window.history.replaceState(null, '', '/login');
      }
      if (activeTab !== 'signup') {
        setActiveTab(path === '/signup' ? 'signup' : 'login');
      }
    } else if (currentUser || isDemoMode) {
      if (activeTab === 'login' || activeTab === 'signup') {
        window.history.replaceState(null, '', '/');
        setActiveTab('dashboard');
      } else {
        const path = activeTab === 'dashboard' ? '/' : `/${activeTab}`;
        if (window.location.pathname !== path) {
          window.history.replaceState(null, '', path);
        }
      }
    }
  }, [currentUser, authLoading, isDemoMode, activeTab]);

  // 3. Listen to browser history navigation (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(getTabFromPath());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Custom page transition handler that updates URL bar
  const navigateTo = (tab) => {
    setActiveTab(tab);
    const path = tab === 'dashboard' ? '/' : `/${tab}`;
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
  };

  const handleLogout = async () => {
    try {
      setIsDemoMode(false); // Reset demo mode on sign out
      await logoutUser();
    } catch (err) {
      console.error("Logout failure:", err);
    }
  };

  const pageTitles = {
    dashboard: { title: 'Polyhouse Dashboard', subtitle: 'Live Environmental Telemetry & Actuator Controls' },
    analytics: { title: 'Data Analytics', subtitle: 'Historical Sensor Trends & Operational Cycles' },
    plants: { title: 'Plant Management', subtitle: 'Polyhouse Crop Zones & Node Scalability' },
    maintenance: { title: 'Maintenance & Status', subtitle: 'Component Diagnostics & System Health' },
    alerts: { title: 'Alerts & Events', subtitle: 'Real-time Environmental Notifications' },
    settings: { title: 'System Configuration', subtitle: 'Hardware Pinout & Automation Thresholds' }
  };

  const currentTitle = pageTitles[activeTab] || pageTitles.dashboard;

  // Calculate active alert count for navbar badge
  const alertCount = (!isESP32Online ? 1 : 0) +
    (liveData.temperature > 31 ? 1 : 0) +
    (liveData.soilMoisture < 30 ? 1 : 0);

  if (authLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#0b130e',
        color: '#f0f7f2',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1b5e20, #00e676)',
          borderRadius: '16px',
          marginBottom: '20px',
          boxShadow: '0 0 30px rgba(0, 230, 118, 0.35)',
          animation: 'pulse-glow 2s infinite alternate'
        }}>
          <Activity size={30} style={{ color: '#fff' }} className="spin" />
        </div>
        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
          Smart Polyhouse
        </div>
        <div style={{ fontSize: '0.78rem', color: '#648a70', marginTop: '6px', fontFamily: 'monospace' }}>
          Connecting to Firebase...
        </div>
      </div>
    );
  }

  if (activeTab === 'login' || activeTab === 'signup' || (!currentUser && !isDemoMode)) {
    if (activeTab === 'signup') {
      return (
        <SignUpPage
          onSignUpSuccess={(user) => {
            setCurrentUser(user);
            setIsDemoMode(false);
            setLoginNotification('success');
            setTimeout(() => setLoginNotification(null), 4000);
            navigateTo('dashboard');
          }}
          onGoToLogin={() => {
            window.history.replaceState(null, '', '/login');
            setActiveTab('login');
          }}
        />
      );
    }
    return (
      <LoginPage
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsDemoMode(false);
          setLoginNotification('success');
          setTimeout(() => setLoginNotification(null), 4000);
          navigateTo('dashboard');
        }}
        onGoToSignUp={() => {
          window.history.replaceState(null, '', '/signup');
          setActiveTab('signup');
        }}
      />
    );
  }

  return (
    <>
      {/* One-time login success toast */}
      {loginNotification === 'success' && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          background: 'rgba(18, 40, 24, 0.97)',
          border: '1px solid rgba(46, 204, 113, 0.5)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(46,204,113,0.15)',
          animation: 'slideInRight 0.35s ease',
          maxWidth: '340px',
          width: 'calc(100vw - 40px)'
        }}>
          <span style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: 'var(--accent-green-bright)',
            boxShadow: '0 0 10px var(--accent-green-bright)',
            flexShrink: 0
          }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#fff' }}>
              Smart Polyhouse connected successfully.
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Live monitoring is active.
            </div>
          </div>
        </div>
      )}

      <div className="app-container">
        {/* Sidebar Navigation */}
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={navigateTo} 
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          alertCount={alertCount}
          onLogout={handleLogout}
        />

        {/* Main Content Area */}
        <div className="main-wrapper">
          <Header 
            title={currentTitle.title}
            subtitle={currentTitle.subtitle}
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            selectedPlant={selectedPlant}
            setSelectedPlant={setSelectedPlant}
            lastUpdated={liveData.timestamp}
            esp32Online={isESP32Online}
          />

          <main className="content-container">
            {/* Firebase Connection Status Banner */}
            <FirebaseStatusBanner 
              isDemoMode={isDemoMode}
              isLoading={isLoading}
              firebaseError={firebaseError}
            />

            {activeTab === 'dashboard' && (
              <Dashboard 
                liveData={liveData} 
                historicalData={historicalData} 
                maintenanceStats={maintenanceStats}
                isESP32Online={isESP32Online}
                lastSeenSeconds={lastSeenSeconds}
              />
            )}

            {activeTab === 'analytics' && (
              <Analytics 
                historicalData={historicalData} 
              />
            )}

            {activeTab === 'plants' && (
              <Plants selectedPlant={selectedPlant} setSelectedPlant={setSelectedPlant} />
            )}

            {activeTab === 'maintenance' && (
              <Maintenance 
                maintenanceStats={maintenanceStats}
                liveData={liveData}
                isESP32Online={isESP32Online}
                lastSeenSeconds={lastSeenSeconds}
              />
            )}

            {activeTab === 'alerts' && (
              <Alerts liveData={liveData} maintenanceStats={maintenanceStats} />
            )}

            {activeTab === 'settings' && (
              <Settings />
            )}
          </main>
        </div>
      </div>
    </>
  );
}
