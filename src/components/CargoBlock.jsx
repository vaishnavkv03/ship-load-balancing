import React from 'react';
import './CargoBlock.css';

const CargoBlock = ({ id, weight, selected, onClick, empty }) => {
  return (
    <div
      className={`cargo-block ${selected ? 'selected' : ''} ${empty ? 'empty' : ''}`}
      onClick={!empty ? onClick : undefined}
      title={empty ? 'Empty slot' : `Container #${id} - ${weight}kg`}
    >
      {empty ? '' : '📦'}
      <div className="weight">{empty ? '' : `${weight} kg`}</div>
      {selected && !empty && (
        <div className="popup">
          <strong>Container #{id + 1}</strong>
          <p>Weight: {weight} kg</p>
          <p>Click again to close</p>
        </div>
      )}
    </div>
  );
};

export default CargoBlock;
