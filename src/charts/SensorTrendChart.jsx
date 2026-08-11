import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

export default function SensorTrendChart({ data, timeRange }) {
  return (
    <div style={{ width: '100%', height: 340 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff5252" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#ff5252" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00b0ff" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#00b0ff" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="soilGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2ecc71" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#2ecc71" stopOpacity={0}/>
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis 
            dataKey="displayDate" 
            stroke="var(--text-muted)" 
            tick={{ fontSize: 12 }}
          />
          <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '12px'
            }}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />

          <Area 
            type="monotone" 
            dataKey="temperature" 
            name="Temperature (°C)" 
            stroke="#ff5252" 
            fillOpacity={1} 
            fill="url(#tempGradient)" 
            strokeWidth={2}
          />
          <Area 
            type="monotone" 
            dataKey="humidity" 
            name="Humidity (%)" 
            stroke="#00b0ff" 
            fillOpacity={1} 
            fill="url(#humidityGradient)" 
            strokeWidth={2}
          />
          <Area 
            type="monotone" 
            dataKey="soilMoisture" 
            name="Soil Moisture (%)" 
            stroke="#2ecc71" 
            fillOpacity={1} 
            fill="url(#soilGradient)" 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
