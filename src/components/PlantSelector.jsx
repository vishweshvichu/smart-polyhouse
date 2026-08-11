import React from 'react';
import { Sprout } from 'lucide-react';
import { INITIAL_PLANTS } from '../utils/constants';

export default function PlantSelector({ selectedPlant, setSelectedPlant }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Sprout size={18} style={{ color: 'var(--accent-green-bright)' }} />
      <select 
        className="plant-select-dropdown"
        value={selectedPlant}
        onChange={(e) => setSelectedPlant(e.target.value)}
      >
        {INITIAL_PLANTS.map(plant => (
          <option key={plant.id} value={plant.id}>
            {plant.name} {plant.active ? '(Active)' : '(Planned)'}
          </option>
        ))}
      </select>
    </div>
  );
}
