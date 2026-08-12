import React, { useState } from 'react';
import SensorTrendChart from '../charts/SensorTrendChart';
import RuntimeBarChart from '../charts/RuntimeBarChart';
import { BarChart3, Database } from 'lucide-react';


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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
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
                <Database size={12} /> LIVE FIREBASE DATA ({historicalData.length} readings)
              </span>
            )}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Temperature, humidity, and soil moisture trends from Firebase historical readings
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

      {/* No data state */}
      {filteredData.length === 0 && (
        <div style={{
          background: 'rgba(0,0,0,0.25)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '40px',
          textAlign: 'center',
          marginBottom: '24px',
          color: 'var(--text-muted)'
        }}>
          <Database size={36} style={{ marginBottom: '12px', opacity: 0.4 }} />
          <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            No historical readings yet
          </div>
          <div style={{ fontSize: '0.82rem', marginTop: '6px' }}>
            Data will appear here as the ESP32 records readings to Firebase.
          </div>
        </div>
      )}

      {/* Sensor Trend Chart Card */}
      {filteredData.length > 0 && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-header">
            <div>
              <div className="card-title">
                <BarChart3 size={20} style={{ color: 'var(--accent-green-bright)' }} />
                Temperature, Humidity &amp; Soil Moisture Trends
              </div>
              <div className="card-subtitle">Real-time &amp; historical telemetry time-series</div>
            </div>
          </div>
          <SensorTrendChart data={filteredData} timeRange={timeFilter} />
        </div>
      )}

      {/* Actuator Operational Runtime & Activation Charts */}
      {filteredData.length > 0 && (
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
      )}


      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Timestamped Readings Log</div>
            <div className="card-subtitle">Readings stored under /polyhouse/plant_01/analytics/readings</div>
          </div>
        </div>

        {filteredData.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            No readings available for the selected time range.
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
