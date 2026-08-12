import React from 'react';
import { Sprout } from 'lucide-react';
import { INITIAL_PLANTS } from '../utils/constants';

export default function PlantSelector({ selectedPlant, setSelectedPlant }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
      <Sprout size={16} style={{ color: 'var(--accent-green-bright)', flexShrink: 0 }} />
      <select 
        className="plant-select-dropdown"
        value={selectedPlant}
        onChange={(e) => setSelectedPlant(e.target.value)}
        title={INITIAL_PLANTS.find(p => p.id === selectedPlant)?.name || selectedPlant}
      >
        {INITIAL_PLANTS.map(plant => (
          <option key={plant.id} value={plant.id}>
            {plant.id === 'plant_01' ? 'Zone 1 – Tomato' :
             plant.id === 'plant_02' ? 'Zone 2 – Strawberry' :
             plant.id === 'plant_03' ? 'Zone 3 – Cucumber' :
             plant.name}{plant.active ? ' ●' : ''}
          </option>
        ))}
      </select>
    </div>
  );
}
