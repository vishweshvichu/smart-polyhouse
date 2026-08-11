import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

export default function RuntimeBarChart({ data, metric = 'runtime' }) {
  const fanKey = metric === 'runtime' ? 'fanRuntime' : 'fanActivations';
  const pumpKey = metric === 'runtime' ? 'pumpRuntime' : 'pumpActivations';
  const fanName = metric === 'runtime' ? 'Fan Runtime (mins)' : 'Fan Activation Count';
  const pumpName = metric === 'runtime' ? 'Pump Runtime (mins)' : 'Pump Activation Count';

  // Transform runtime seconds to minutes for clean chart visual
  const formattedData = data.map(item => ({
    ...item,
    fanRuntime: Math.round(item.fanRuntime / 60),
    pumpRuntime: Math.round(item.pumpRuntime / 60)
  }));

  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={formattedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="displayDate" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
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

          <Bar dataKey={fanKey} name={fanName} fill="#00b0ff" radius={[4, 4, 0, 0]} />
          <Bar dataKey={pumpKey} name={pumpName} fill="#2ecc71" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
