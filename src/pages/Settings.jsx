import React, { useState } from 'react';
import { Settings as SettingsIcon, Cpu, Database, Sliders, ShieldCheck, Flame, Send, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { HARDWARE_PINS, CONTROL_RULES } from '../utils/constants';
import { triggerSimulatedAlert } from '../services/simulatorService';
import { writeSensorData } from '../services/firebaseService';

export default function Settings({ isDemoMode, setIsDemoMode }) {
  const [isSending, setIsSending] = useState(false);
  const [writeStatus, setWriteStatus] = useState(null);

  const handleSendTestData = async () => {
    setIsSending(true);
    setWriteStatus(null);
    const now = new Date();
    const testPayload = {
      temperature: 29.5,
      humidity: 65,
      soilMoisture: 45,
      fanActive: false,
      pumpActive: false,
      timestamp: now.getTime()
    };

    try {
      await writeSensorData('plant_01', testPayload);
      setWriteStatus({
        type: 'success',
        message: 'Successfully wrote test data to Firebase (/polyhouse/plant_01/live)!',
        payload: testPayload,
        time: now.toLocaleTimeString()
      });
    } catch (err) {
      console.error("Settings Firebase test write error:", err);
      setWriteStatus({
        type: 'error',
        message: `Firebase write error: ${err.message || 'Check database permissions.'}`,
        time: now.toLocaleTimeString()
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>System Configuration & Hardware Map</h2>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Firebase credentials, ESP32 pin definitions, and hysteresis control parameters
        </div>
      </div>

      {/* Real Firebase RTDB Dev Test Section */}
      <div className="card" style={{ marginBottom: '28px', border: '1px solid rgba(46, 204, 113, 0.3)' }}>
        <div className="card-header">
          <div>
            <div className="card-title" style={{ color: 'var(--accent-green-bright)' }}>
              <Database size={20} />
              Real Firebase RTDB Development Test
            </div>
            <div className="card-subtitle">
              Write test dataset to node <code>/polyhouse/plant_01/live</code> in Firebase Realtime Database
            </div>
          </div>
          <button
            id="settings-send-test-btn"
            className="btn-primary"
            onClick={handleSendTestData}
            disabled={isSending}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}
          >
            {isSending ? (
              <>
                <RefreshCw size={14} className="spin" /> Writing...
              </>
            ) : (
              <>
                <Send size={14} /> Send Test Data
              </>
            )}
          </button>
        </div>

        {writeStatus && (
          <div style={{
            background: writeStatus.type === 'success' ? 'rgba(46, 204, 113, 0.12)' : 'rgba(231, 76, 60, 0.15)',
            border: `1px solid ${writeStatus.type === 'success' ? 'rgba(46, 204, 113, 0.4)' : 'rgba(231, 76, 60, 0.4)'}`,
            borderRadius: 'var(--radius-sm)',
            padding: '12px 16px',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: writeStatus.type === 'success' ? '#2ecc71' : '#e74c3c'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {writeStatus.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <div>
                <strong>{writeStatus.message}</strong>
                {writeStatus.payload && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                    Payload: {JSON.stringify(writeStatus.payload)}
                  </div>
                )}
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{writeStatus.time}</span>
          </div>
        )}
      </div>

      <div className="grid-2" style={{ marginBottom: '28px' }}>
        {/* Hardware Pin Mapping Reference */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Cpu size={20} style={{ color: 'var(--accent-green-bright)' }} />
              ESP32 Pinout Connections
            </div>
            <div className="card-subtitle">Exact GPIO mapping configured in hardware</div>
          </div>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Component / Sensor</th>
                  <th>ESP32 GPIO Pin</th>
                  <th>Logic / Interface</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>DHT22 Temp/Humidity Sensor</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-green-bright)', fontWeight: 700 }}>{HARDWARE_PINS.dht22}</td>
                  <td>Single Bus Data</td>
                </tr>
                <tr>
                  <td>Capacitive Soil Moisture Sensor</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-green-bright)', fontWeight: 700 }}>{HARDWARE_PINS.soilMoisture}</td>
                  <td>ADC Analog Read</td>
                </tr>
                <tr>
                  <td>5V DC Fan Relay</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)', fontWeight: 700 }}>{HARDWARE_PINS.fanRelay}</td>
                  <td>ACTIVE LOW (LOW=ON)</td>
                </tr>
                <tr>
                  <td>5V DC Pump Relay</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)', fontWeight: 700 }}>{HARDWARE_PINS.pumpRelay}</td>
                  <td>ACTIVE LOW (LOW=ON)</td>
                </tr>
                <tr>
                  <td>SSD1306 OLED Screen (SDA)</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)', fontWeight: 700 }}>{HARDWARE_PINS.oledSda}</td>
                  <td>I2C Data Bus</td>
                </tr>
                <tr>
                  <td>SSD1306 OLED Screen (SCL)</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)', fontWeight: 700 }}>{HARDWARE_PINS.oledScl}</td>
                  <td>I2C Clock Bus</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Control Logic Hysteresis Rules */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Sliders size={20} style={{ color: 'var(--accent-amber)' }} />
              Automation Hysteresis Thresholds
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: '10px' }}>
              <div style={{ fontWeight: 700, color: '#fff', marginBottom: '4px' }}>Fan Automation Rules</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                • <strong style={{ color: 'var(--accent-danger)' }}>ON Threshold:</strong> Temperature &gt; {CONTROL_RULES.fan.onThreshold}°C<br/>
                • <strong style={{ color: 'var(--accent-green-bright)' }}>OFF Threshold:</strong> Temperature &lt; {CONTROL_RULES.fan.offThreshold}°C
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: '10px' }}>
              <div style={{ fontWeight: 700, color: '#fff', marginBottom: '4px' }}>Pump Automation Rules</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                • <strong style={{ color: 'var(--accent-amber)' }}>ON Threshold:</strong> Soil Moisture &lt; {CONTROL_RULES.pump.onThreshold}%<br/>
                • <strong style={{ color: 'var(--accent-green-bright)' }}>OFF Threshold:</strong> Soil Moisture &gt; {CONTROL_RULES.pump.offThreshold}%
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: '10px' }}>
              <div style={{ fontWeight: 700, color: '#fff', marginBottom: '4px' }}>Soil Moisture ADC Calibration</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                AIR_VALUE = {CONTROL_RULES.calibration.airValue} (Dry 0%)<br/>
                WATER_VALUE = {CONTROL_RULES.calibration.waterValue} (Wet 100%)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Presentation & Simulation Controls */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Flame size={20} style={{ color: 'var(--accent-amber)' }} />
            Hackathon Live Interactive Simulation Controls
          </div>
          <div className="card-subtitle">Test realtime state changes and alert triggers</div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '10px' }}>
          <button 
            className="btn-secondary"
            onClick={() => triggerSimulatedAlert('high_temp')}
          >
            Spike Temp (&gt; 31°C) ➔ Trigger Fan
          </button>

          <button 
            className="btn-secondary"
            onClick={() => triggerSimulatedAlert('low_soil')}
          >
            Drop Soil (&lt; 30%) ➔ Trigger Pump
          </button>

          <button 
            className="btn-secondary"
            onClick={() => triggerSimulatedAlert('offline')}
          >
            Simulate ESP32 Disconnect
          </button>

          <button 
            className="btn-primary"
            onClick={() => triggerSimulatedAlert('online')}
          >
            Reset to Nominal Online
          </button>
        </div>
      </div>
    </div>
  );
}
