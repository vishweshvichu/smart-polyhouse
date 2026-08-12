import React from 'react';
import { Cpu, Sliders, ShieldCheck, Info } from 'lucide-react';
import { HARDWARE_PINS, CONTROL_RULES } from '../utils/constants';

export default function Settings() {
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>System Configuration &amp; Hardware Map</h2>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          ESP32 pin definitions, automation thresholds, and system configuration reference
        </div>
      </div>

      {/* Info Banner */}
      <div style={{
        background: 'rgba(0, 176, 255, 0.08)',
        border: '1px solid rgba(0, 176, 255, 0.25)',
        borderRadius: 'var(--radius-md)',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        marginBottom: '28px'
      }}>
        <Info size={18} style={{ color: 'var(--accent-blue)', flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <strong style={{ color: '#fff' }}>Configuration Reference:</strong> These values are programmed into the ESP32 firmware. 
          Thresholds control when the cooling fan and irrigation pump activate automatically. 
          To change thresholds, update the firmware and re-flash the ESP32.
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '28px' }}>
        {/* Hardware Pin Mapping Reference */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Cpu size={20} style={{ color: 'var(--accent-green-bright)' }} />
              ESP32 Pinout Connections
            </div>
            <div className="card-subtitle">GPIO mapping configured in hardware</div>
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
            <div className="card-subtitle">Configured trigger points — read-only reference</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '16px', borderRadius: '10px', borderLeft: '3px solid var(--accent-blue)' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                CONFIGURATION
              </div>
              <div style={{ fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Fan Automation Rules</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div>
                  • <strong style={{ color: 'var(--accent-danger)' }}>ON Threshold:</strong> Temperature &gt; {CONTROL_RULES.fan.onThreshold}°C
                </div>
                <div>
                  • <strong style={{ color: 'var(--accent-green-bright)' }}>OFF Threshold:</strong> Temperature &lt; {CONTROL_RULES.fan.offThreshold}°C
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '16px', borderRadius: '10px', borderLeft: '3px solid var(--accent-blue)' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                CONFIGURATION
              </div>
              <div style={{ fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Pump Automation Rules</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div>
                  • <strong style={{ color: 'var(--accent-amber)' }}>ON Threshold:</strong> Soil Moisture &lt; {CONTROL_RULES.pump.onThreshold}%
                </div>
                <div>
                  • <strong style={{ color: 'var(--accent-green-bright)' }}>OFF Threshold:</strong> Soil Moisture &gt; {CONTROL_RULES.pump.offThreshold}%
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '16px', borderRadius: '10px', borderLeft: '3px solid var(--accent-amber)' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-amber)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                CALIBRATION
              </div>
              <div style={{ fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Soil Moisture ADC Calibration</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div>AIR_VALUE = {CONTROL_RULES.calibration.airValue} <span style={{ fontFamily: 'var(--font-main)', color: 'var(--text-muted)', fontSize: '0.78rem' }}>(Dry 0%)</span></div>
                <div>WATER_VALUE = {CONTROL_RULES.calibration.waterValue} <span style={{ fontFamily: 'var(--font-main)', color: 'var(--text-muted)', fontSize: '0.78rem' }}>(Wet 100%)</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Firebase Connection Reference */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <ShieldCheck size={20} style={{ color: 'var(--accent-green-bright)' }} />
            Firebase Database Structure Reference
          </div>
          <div className="card-subtitle">Real-time database path architecture</div>
        </div>

        <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
          The Smart Polyhouse uses Firebase Realtime Database for all sensor telemetry and actuator state synchronization:
        </div>

        <pre style={{
          background: 'rgba(0,0,0,0.4)',
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.82rem',
          color: 'var(--accent-green-bright)',
          overflowX: 'auto',
          border: '1px solid var(--border-color)',
          lineHeight: 1.7
        }}>
          {`polyhouse/
├── plant_01/
│   ├── live/             ← ESP32 realtime sensor + actuator data
│   │   ├── temperature   ← DHT22 reading (°C)
│   │   ├── humidity      ← DHT22 reading (%)
│   │   ├── soilMoisture  ← Capacitive sensor (%)
│   │   ├── fan           ← Fan relay state (bool)
│   │   ├── pump          ← Pump relay state (bool)
│   │   ├── lastSeen      ← Heartbeat timestamp (ms)
│   │   └── timestamp     ← Data timestamp (ms)
│   ├── analytics/
│   │   └── readings/     ← Historical timestamped readings
│   └── maintenance/      ← Runtime + activation counters
└── users/{uid}/          ← Firebase Auth user profiles`}
        </pre>
      </div>
    </div>
  );
}
