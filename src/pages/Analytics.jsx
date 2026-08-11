import React, { useState } from 'react';
import SensorTrendChart from '../charts/SensorTrendChart';
import RuntimeBarChart from '../charts/RuntimeBarChart';
import { BarChart3, Calendar, Filter, Download, Database, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Analytics({ 
  historicalData,
  isRecording,
  recordFeedback,
  onRecordTestReading
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
          <button
            id="record-test-reading-analytics"
            className="btn-secondary"
            onClick={onRecordTestReading}
            disabled={isRecording}
            style={{
              fontSize: '0.78rem',
              padding: '8px 14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 600,
              background: 'rgba(52, 152, 219, 0.15)',
              border: '1px solid rgba(52, 152, 219, 0.4)',
              color: '#3498db',
              cursor: 'pointer',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            {isRecording ? (
              <>
                <RefreshCw size={14} className="spin" /> Recording...
              </>
            ) : (
              <>
                <Database size={14} /> Record Test Reading
              </>
            )}
          </button>

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

      {/* Analytics Test Record Inline Feedback */}
      {recordFeedback && (
        <div style={{
          background: recordFeedback.type === 'success' ? 'rgba(52, 152, 219, 0.12)' : 'rgba(231, 76, 60, 0.15)',
          border: `1px solid ${recordFeedback.type === 'success' ? 'rgba(52, 152, 219, 0.4)' : 'rgba(231, 76, 60, 0.4)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '12px 18px',
          fontSize: '0.86rem',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: recordFeedback.type === 'success' ? '#3498db' : '#e74c3c'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {recordFeedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <div>
              <strong>{recordFeedback.message}</strong>
              {recordFeedback.payload && (
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                  Payload: {JSON.stringify(recordFeedback.payload)}
                </div>
              )}
            </div>
          </div>
          <span style={{ fontSize: '0.74rem', opacity: 0.8 }}>{recordFeedback.time}</span>
        </div>
      )}

      {/* Historical Data Table */}
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
