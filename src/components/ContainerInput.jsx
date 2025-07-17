import React, { useState } from 'react';
import './ContainerInput.css';
import shipImage from '../assets/ship-layout.jpg';

const ContainerInput = ({ onSubmit, onBack }) => {
  const [containers, setContainers] = useState([{ id: Date.now(), number: '', weight: '' }]);
  const [shipInfo, setShipInfo] = useState({
    shipName: '',
    maxCapacity: 20000,
    maxContainers: 50
  });

  // Calculate total weight entered so far
  const currentTotalWeight = containers.reduce(
    (sum, c) => sum + (Number(c.weight) || 0), 0
  );

  const handleAddContainer = () => {
    if (containers.length < shipInfo.maxContainers) {
      setContainers([...containers, { 
        id: Date.now(), // More reliable than length-based IDs
        number: '', 
        weight: '' 
      }]);
    }
  };

  const handleRemoveContainer = (id) => {
    if (containers.length > 1) {
      setContainers(containers.filter(container => container.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validContainers = containers.filter(c => c.number && c.weight);
    
    if (validContainers.length === 0) {
      alert('Please enter at least one container');
      return;
    }
    
    if (currentTotalWeight > shipInfo.maxCapacity) {
      alert(`Warning: Total weight (${currentTotalWeight}kg) exceeds ship capacity (${shipInfo.maxCapacity}kg)`);
    }
    
    onSubmit(validContainers);
  };

  return (
    <div className="container-input">
      {/* Hero Section with capacity indicator */}
      <div className="input-hero">
        <h1>Cargo Load Planner</h1>
        <p>Enter your container details for optimal weight distribution</p>
        <div className="capacity-meter">
          <span>
            Current Total: {currentTotalWeight}kg / {shipInfo.maxCapacity}kg
          </span>
          <div 
            className="meter-bar"
            style={{
              width: `${Math.min(100, (currentTotalWeight / shipInfo.maxCapacity) * 100)}%`,
              backgroundColor: currentTotalWeight > shipInfo.maxCapacity ? '#e74c3c' : '#2ecc71'
            }}
          ></div>
        </div>
      </div>

      <div className="content-wrapper">
        {/* Enhanced Ship Info Section */}
        <div className="ship-visual">
          <img 
            src={shipImage} 
            alt="Ship layout" 
            className="ship-image"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80';
            }}
          />
          <div className="ship-info-card">
            <h3>Loading Guidelines</h3>
            <ul>
              <li>Max Capacity: {shipInfo.maxCapacity}kg</li>
              <li>Max Containers: {shipInfo.maxContainers}</li>
              <li>Min Weight: 1000kg</li>
              <li>Max Weight: 50000kg</li>
            </ul>
            <div className="weight-summary">
              <p>Containers: {containers.length}</p>
              <p>Total Weight: {currentTotalWeight}kg</p>
            </div>
          </div>
        </div>

        {/* Enhanced Form Section */}
        <form onSubmit={handleSubmit} className="container-form">
          <div className="form-group">
            <label>Ship Name *</label>
            <input 
              type="text" 
              value={shipInfo.shipName}
              onChange={(e) => setShipInfo({...shipInfo, shipName: e.target.value})}
              placeholder="e.g., Ever Given"
              required
            />
          </div>

          <div className="form-group">
            <label>Ship Capacity (kg) *</label>
            <input
              type="number"
              value={shipInfo.maxCapacity}
              onChange={(e) => setShipInfo({...shipInfo, maxCapacity: Math.max(1000, e.target.value)})}
              min="1000"
              required
            />
          </div>

          <h3>
            Container Details 
            <span className="container-count">({containers.length}/{shipInfo.maxContainers})</span>
          </h3>
          
          {containers.map((container) => (
            <div key={container.id} className="container-row">
              <div className="form-group">
                <label>Container Number *</label>
                <input
                  type="text"
                  value={container.number}
                  onChange={(e) => {
                    const updated = containers.map(c => 
                      c.id === container.id ? {...c, number: e.target.value.toUpperCase()} : c
                    );
                    setContainers(updated);
                  }}
                  placeholder="e.g., ABCD1234567"
                  pattern="[A-Za-z0-9]{4,12}"
                  title="4-12 alphanumeric characters"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Weight (kg) *</label>
                <input
                  type="number"
                  value={container.weight}
                  onChange={(e) => {
                    const weight = Math.max(0, Math.min(50000, e.target.value));
                    const updated = containers.map(c => 
                      c.id === container.id ? {...c, weight} : c
                    );
                    setContainers(updated);
                  }}
                  placeholder="1000-50000"
                  min="1000"
                  max="50000"
                  required
                />
              </div>

              {containers.length > 1 && (
                <button 
                  type="button" 
                  className="remove-btn"
                  onClick={() => handleRemoveContainer(container.id)}
                  aria-label="Remove container"
                >
                  ×
                </button>
              )}
            </div>
          ))}

          <div className="form-actions">
            <button 
              type="button" 
              className="add-btn"
              onClick={handleAddContainer}
              disabled={containers.length >= shipInfo.maxContainers}
            >
              + Add Container ({shipInfo.maxContainers - containers.length} remaining)
            </button>
            
            <div className="action-buttons">
              <button 
                type="button" 
                className="back-btn"
                onClick={onBack}
              >
                ← Back to Home
              </button>
              
              <button 
                type="submit" 
                className="submit-btn"
                disabled={containers.some(c => !c.number || !c.weight)}
              >
                Calculate Optimal Load
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContainerInput;