import React, { useState } from 'react';
import SensorTrendChart from '../charts/SensorTrendChart';
import RuntimeBarChart from '../charts/RuntimeBarChart';
import { BarChart3 } from 'lucide-react';


export default function Analytics({ 
  historicalData
}) {
  const [timeFilter, setTimeFilter] = useState('7d'); // 'today', '7d', '30d'

  // Filter historical data based on selected time range
  const getFilteredData = () => {
    if (!historicalData || historicalData.length === 0) return [];

    const now = Date.now();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayTimestamp = startOfToday.getTime();
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);

    const hasTimestamp = historicalData.some(item => item.timestamp !== undefined);

    if (hasTimestamp) {
      let cutoff = 0;
      if (timeFilter === 'today') cutoff = todayTimestamp;
      else if (timeFilter === '7d') cutoff = sevenDaysAgo;
      else if (timeFilter === '30d') cutoff = thirtyDaysAgo;

      const filtered = historicalData.filter(item => (item.timestamp || 0) >= cutoff);
      return filtered.length > 0 ? filtered : historicalData;
    }

    if (timeFilter === 'today') return historicalData.slice(-1);
    if (timeFilter === '7d') return historicalData.slice(-7);
    return historicalData;
  };

  const filteredData = getFilteredData();
  const isRealFirebase = historicalData.some(item => item.timestamp !== undefined);

  return (
    <div>
      {/* Top Controls & Filter Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>Historical Environmental Analytics</h2>
            {isRealFirebase && (
              <span style={{
                background: 'rgba(46, 204, 113, 0.15)',
                color: 'var(--accent-green-bright)',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Database size={12} /> REAL FIREBASE READINGS ({historicalData.length})
              </span>
            )}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Visualize temperature, humidity, soil moisture trends, and historical telemetry entries
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div className="filter-group">
            <button 
              className={`filter-btn ${timeFilter === 'today' ? 'active' : ''}`}
              onClick={() => setTimeFilter('today')}
            >
              Today
            </button>
            <button 
              className={`filter-btn ${timeFilter === '7d' ? 'active' : ''}`}
              onClick={() => setTimeFilter('7d')}
            >
              Last 7 Days
            </button>
            <button 
              className={`filter-btn ${timeFilter === '30d' ? 'active' : ''}`}
              onClick={() => setTimeFilter('30d')}
            >
              Last 30 Days
            </button>
          </div>
        </div>
      </div>

      {/* Sensor Trend Chart Card */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <div>
            <div className="card-title">
              <BarChart3 size={20} style={{ color: 'var(--accent-green-bright)' }} />
              Temperature, Humidity & Soil Moisture Trends
            </div>
            <div className="card-subtitle">Realtime & Historical telemetry time-series</div>
          </div>
        </div>
        <SensorTrendChart data={filteredData} timeRange={timeFilter} />
      </div>

      {/* Actuator Operational Runtime & Activation Charts */}
      <div className="grid-2" style={{ marginBottom: '24px' }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Fan vs. Pump Operating Runtime</div>
              <div className="card-subtitle">Active duty cycle history</div>
            </div>
          </div>
          <RuntimeBarChart data={filteredData} metric="runtime" />
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Fan vs. Pump Activation Events</div>
              <div className="card-subtitle">Trigger cycles per reading</div>
            </div>
          </div>
          <RuntimeBarChart data={filteredData} metric="activations" />
        </div>
      </div>


      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Timestamped Readings Log</div>
            <div className="card-subtitle">Empirical readings stored under /polyhouse/plant_01/analytics/readings</div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Timestamp / Date</th>
                <th>Temperature (°C)</th>
                <th>Humidity (%)</th>
                <th>Soil Moisture (%)</th>
                <th>Fan Active</th>
                <th>Pump Active</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, idx) => (
                <tr key={row.id || idx}>
                  <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    {row.fullDate || row.time || row.date}
                  </td>
                  <td style={{ color: '#ff5252', fontWeight: 600 }}>{row.temperature} °C</td>
                  <td style={{ color: '#00b0ff', fontWeight: 600 }}>{row.humidity} %</td>
                  <td style={{ color: '#2ecc71', fontWeight: 600 }}>{row.soilMoisture} %</td>
                  <td>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: (row.fanActive || row.fan) ? 'rgba(0, 176, 255, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                      color: (row.fanActive || row.fan) ? '#00b0ff' : 'var(--text-muted)'
                    }}>
                      {(row.fanActive || row.fan) ? 'ACTIVE' : 'OFF'}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: (row.pumpActive || row.pump) ? 'rgba(0, 176, 255, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                      color: (row.pumpActive || row.pump) ? '#00b0ff' : 'var(--text-muted)'
                    }}>
                      {(row.pumpActive || row.pump) ? 'ACTIVE' : 'OFF'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
