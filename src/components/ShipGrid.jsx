import React, { useState, useEffect } from 'react';
import './ShipGrid.css';
import {
  FaShip,
  FaBalanceScale,
  FaWeightHanging,
  FaDownload,
  FaInfoCircle,
  FaArrowRight,
  FaExclamationTriangle
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ShipGrid = ({ containers }) => {
  const gridRows = 6;
  const gridColumns = 14;

  const [viewMode, setViewMode] = useState('balance');
  const [activeContainer, setActiveContainer] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [overloadDetected, setOverloadDetected] = useState(false);

  // Enhanced load balancing algorithm
  const calculateOptimalPlacement = () => {
    const sorted = [...containers].sort((a, b) => b.weight - a.weight);
    const grid = Array(gridRows).fill().map(() => Array(gridColumns).fill(null));
    const heatmap = Array(gridRows).fill().map(() => Array(gridColumns).fill(0));

    const totalWeight = sorted.reduce((acc, c) => acc + Number(c.weight), 0);
    let portWeight = 0;
    let starboardWeight = 0;
    const placements = [];

    // Define ship center for balance calculations
    const shipCenterCol = Math.floor(gridColumns / 2);
    
    sorted.forEach((container, index) => {
      let bestPos = null;
      let bestScore = -Infinity;
      const weight = Number(container.weight);

      // Try each position and calculate score
      for (let r = 0; r < gridRows; r++) {
        for (let c = 0; c < gridColumns; c++) {
          if (!grid[r][c]) {
            // Calculate what the new balance would be
            const isPortSide = c < shipCenterCol;
            const tempPort = isPortSide ? portWeight + weight : portWeight;
            const tempStarboard = isPortSide ? starboardWeight : starboardWeight + weight;
            
            // Balance score (higher is better)
            const totalTempWeight = tempPort + tempStarboard;
            const balanceScore = totalTempWeight > 0 ? 
              (1 - Math.abs(tempPort - tempStarboard) / totalTempWeight) * 100 : 0;
            
            // Center preference (prefer positions closer to center)
            const centerDistance = Math.abs(c - shipCenterCol);
            const centerScore = (gridColumns - centerDistance) * 2;
            
            // Stability score (prefer lower rows for heavy containers)
            const stabilityScore = (gridRows - r) * 3;
            
            // Density score (avoid overcrowding)
            const densityScore = -heatmap[r][c] / 1000;
            
            // Distribution score (spread containers evenly)
            const distributionScore = index < sorted.length / 2 ? 
              (isPortSide ? 10 : -10) : (isPortSide ? -10 : 10);
            
            // Combined score
            const score = balanceScore + centerScore + stabilityScore + densityScore + distributionScore;

            if (score > bestScore) {
              bestScore = score;
              bestPos = { r, c };
            }
          }
        }
      }

      // Place container at best position
      if (bestPos) {
        const { r, c } = bestPos;
        grid[r][c] = container;
        
        const isPortSide = c < shipCenterCol;
        const side = isPortSide ? 'port' : 'starboard';
        
        placements.push({ 
          container, 
          position: { row: r, col: c }, 
          side 
        });
        
        // Update weights
        if (isPortSide) {
          portWeight += weight;
        } else {
          starboardWeight += weight;
        }
        
        // Update heatmap for density tracking
        heatmap[r][c] += weight;
        
        // Spread heat to adjacent cells for better distribution
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < gridRows && nc >= 0 && nc < gridColumns) {
              heatmap[nr][nc] += weight * 0.1;
            }
          }
        }
      }
    });

    // Calculate balance ratio
    const balanceRatio = totalWeight > 0 ? 
      Math.min(portWeight, starboardWeight) / Math.max(portWeight, starboardWeight) : 1;

    return {
      grid, 
      placements, 
      heatmap,
      totalWeight, 
      portWeight, 
      starboardWeight,
      balanceRatio
    };
  };

  const {
    grid, 
    placements, 
    heatmap,
    totalWeight, 
    portWeight, 
    starboardWeight,
    balanceRatio
  } = calculateOptimalPlacement();

  useEffect(() => {
    const maxAllowedWeight = 8000; // Maximum weight per cell
    const overloaded = heatmap.some(row => row.some(cell => cell > maxAllowedWeight));
    setOverloadDetected(overloaded);
  }, [heatmap]);

  // Generate placement instructions
  const placementInstructions = placements.map((p, index) => ({
    id: `${p.container.number}-${p.position.row}-${p.position.col}`,
    text: `${index + 1}. Container ${p.container.number} → Row ${p.position.row + 1}, Col ${p.position.col + 1} (${p.side.toUpperCase()})`,
    position: p.position,
    weight: p.container.weight
  }));

  const exportToPDF = () => {
    setExporting(true);
    
    // Simulate PDF generation
    setTimeout(() => {
      // Create a simple text report
      const report = `
SHIP LOAD BALANCER REPORT
========================

Balance Ratio: ${(balanceRatio * 100).toFixed(1)}%
Total Weight: ${totalWeight}kg
Port Weight: ${portWeight}kg
Starboard Weight: ${starboardWeight}kg

PLACEMENT INSTRUCTIONS:
${placementInstructions.map(i => i.text).join('\n')}

Generated on: ${new Date().toLocaleString()}
      `;
      
      console.log(report);
      alert('PDF exported successfully. Check console for report details.');
      setExporting(false);
    }, 1200);
  };

  const getContainerColor = (container) => {
    const weight = Number(container.weight);
    const maxWeight = Math.max(...containers.map(c => Number(c.weight)));
    const intensity = (weight / maxWeight) * 0.8 + 0.2;
    
    // Color based on weight: light green for light containers, red for heavy
    const hue = Math.max(0, 120 - (weight / maxWeight) * 120);
    return `hsl(${hue}, 70%, ${60 + intensity * 20}%)`;
  };

  const getHeatmapColor = (heatValue) => {
    const maxHeat = Math.max(...heatmap.flat());
    const intensity = maxHeat > 0 ? Math.min(1, heatValue / maxHeat) : 0;
    return `rgba(0, 100, 200, ${0.1 + intensity * 0.4})`;
  };

  return (
    <motion.div
      className="ship-grid-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="grid-header">
        <h2>
          <FaShip className="header-icon" /> Ship Load Balancer
          <span className="balance-badge">
            Balance: {(balanceRatio * 100).toFixed(1)}%
          </span>
        </h2>

        <div className="view-controls">
          <button 
            className={`view-btn ${viewMode === 'balance' ? 'active' : ''}`} 
            onClick={() => setViewMode('balance')}
          >
            <FaBalanceScale /> Balance View
          </button>
          <button 
            className={`view-btn ${viewMode === 'weight' ? 'active' : ''}`} 
            onClick={() => setViewMode('weight')}
          >
            <FaWeightHanging /> Weight Map
          </button>
        </div>
      </div>

      <div className="arrow-indicator">
        <FaArrowRight /> Loading Direction (Bow to Stern)
      </div>

      <div className="ship-visualization">
        <div
          className="ship-blueprint"
          style={{
            backgroundImage: `url('./assets/final-grid.png')`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        >
          <div className="ship-deck-overlay">
            {grid.map((row, rIdx) => (
              <div className="deck-row" key={rIdx}>
                {row.map((cell, cIdx) => (
                  <motion.div
                    className={`deck-cell ${cell ? 'has-container' : ''}`}
                    key={`${rIdx}-${cIdx}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: (rIdx * gridColumns + cIdx) * 0.02 }}
                    whileHover={{ scale: cell ? 1.05 : 1.02 }}
                    onClick={() => cell && setActiveContainer(cell)}
                    style={{
                      backgroundColor: cell
                        ? getContainerColor(cell)
                        : viewMode === 'weight'
                          ? getHeatmapColor(heatmap[rIdx][cIdx])
                          : 'transparent',
                    }}
                  >
                    {cell && (
                      <div className="container-tag">
                        <span>{cell.number}</span>
                        <small>{cell.weight}kg</small>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="info-panel">
          <div className="weight-distribution">
            <h3>
              <FaBalanceScale /> Weight Distribution 
              <FaInfoCircle className="info-icon" />
            </h3>
            <div className="weight-bars">
              <div className="weight-bar port">
                <div 
                  className="bar-fill" 
                  style={{ width: `${totalWeight > 0 ? (portWeight / totalWeight) * 100 : 0}%` }}
                ></div>
                <span>Port: {portWeight.toLocaleString()}kg</span>
              </div>
              <div className="weight-bar starboard">
                <div 
                  className="bar-fill" 
                  style={{ width: `${totalWeight > 0 ? (starboardWeight / totalWeight) * 100 : 0}%` }}
                ></div>
                <span>Starboard: {starboardWeight.toLocaleString()}kg</span>
              </div>
            </div>
            <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#666' }}>
              Total Weight: {totalWeight.toLocaleString()}kg
            </div>
          </div>

          {overloadDetected && (
            <motion.div 
              className="overload-warning"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <FaExclamationTriangle />
              Weight concentration detected! Consider redistributing containers.
            </motion.div>
          )}

          <div className="placement-instructions">
            <h3>Loading Instructions</h3>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {placementInstructions.map((instruction, index) => (
                <motion.div
                  key={instruction.id}
                  className="instruction-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onMouseEnter={() => {
                    const cell = document.querySelector(
                      `.deck-row:nth-child(${instruction.position.row + 1}) .deck-cell:nth-child(${instruction.position.col + 1})`
                    );
                    if (cell) {
                      cell.classList.add('highlighted');
                    }
                  }}
                  onMouseLeave={() => {
                    const cell = document.querySelector(
                      `.deck-row:nth-child(${instruction.position.row + 1}) .deck-cell:nth-child(${instruction.position.col + 1})`
                    );
                    if (cell) {
                      cell.classList.remove('highlighted');
                    }
                  }}
                >
                  {instruction.text}
                </motion.div>
              ))}
            </div>
          </div>

          <button 
            className="export-btn" 
            disabled={exporting || containers.length === 0} 
            onClick={exportToPDF}
          >
            {exporting ? (
              'Exporting...'
            ) : (
              <>
                <FaDownload /> Export Load Plan
              </>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {activeContainer && (
          <motion.div
            className="container-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveContainer(null)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <h3>Container Details</h3>
              <div className="detail-row">
                <span>Container Number:</span>
                <strong>{activeContainer.number}</strong>
              </div>
              <div className="detail-row">
                <span>Weight:</span>
                <strong>{Number(activeContainer.weight).toLocaleString()} kg</strong>
              </div>
              <div className="detail-row">
                <span>Position:</span>
                <strong>
                  {(() => {
                    const placement = placements.find(p => p.container.number === activeContainer.number);
                    return placement 
                      ? `Row ${placement.position.row + 1}, Col ${placement.position.col + 1} (${placement.side.toUpperCase()})`
                      : 'Not placed';
                  })()}
                </strong>
              </div>
              <div className="detail-row">
                <span>Side:</span>
                <strong>
                  {(() => {
                    const placement = placements.find(p => p.container.number === activeContainer.number);
                    return placement ? placement.side.toUpperCase() : 'N/A';
                  })()}
                </strong>
              </div>
              <button className="close-btn" onClick={() => setActiveContainer(null)}>
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ShipGrid;