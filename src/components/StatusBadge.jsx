import React from 'react';

export default function StatusBadge({ status, type = 'boolean' }) {
  let badgeClass = 'off';
  let label = 'OFF';

  if (type === 'online') {
    badgeClass = status ? 'online' : 'offline';
    label = status ? 'ONLINE' : 'OFFLINE';
  } else if (type === 'system') {
    badgeClass = status ? 'working' : 'normal';
    label = status ? 'WORKING' : 'NORMAL';
  } else {
    badgeClass = status ? 'on' : 'off';
    label = status ? 'ON' : 'OFF';
  }

  return (
    <span className={`status-badge ${badgeClass}`}>
      <span className={`pulse-dot ${badgeClass}`}></span>
      {label}
    </span>
  );
}
