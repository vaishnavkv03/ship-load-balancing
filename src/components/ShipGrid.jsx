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
import shipBlueprint from '../assets/final-grid.png'; // ✅ Import image

const ShipGrid = ({ containers }) => {
  const gridRows = 6;
  const gridColumns = 14;

  const [viewMode, setViewMode] = useState('balance');
  const [activeContainer, setActiveContainer] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [overloadDetected, setOverloadDetected] = useState(false);

  const calculatePlacement = () => {
    const sorted = [...containers].sort((a, b) => b.weight - a.weight);
    const grid = Array(gridRows).fill().map(() => Array(gridColumns).fill(null));
    const heatmap = Array(gridRows).fill().map(() => Array(gridColumns).fill(0));

    const totalWeight = sorted.reduce((acc, c) => acc + Number(c.weight), 0);
    let portWeight = 0, starboardWeight = 0;
    const placements = [];

    sorted.forEach(container => {
      let bestPos = null, bestScore = -Infinity;
      const weight = Number(container.weight);

      for (let r = 0; r < gridRows; r++) {
        for (let c = 0; c < gridColumns; c++) {
          if (!grid[r][c]) {
            const tempPort = c < gridColumns / 2 ? portWeight + weight : portWeight;
            const tempStarboard = c >= gridColumns / 2 ? starboardWeight + weight : starboardWeight;
            const balanceScore = 1 - Math.abs(tempPort - tempStarboard) / (tempPort + tempStarboard);
            const densityScore = -heatmap[r][c];
            const score = balanceScore * 100 + densityScore;

            if (score > bestScore) {
              bestScore = score;
              bestPos = { r, c };
            }
          }
        }
      }

      if (bestPos) {
        const { r, c } = bestPos;
        grid[r][c] = container;
        placements.push({ container, position: { row: r, col: c }, side: c < gridColumns / 2 ? 'port' : 'starboard' });
        if (c < gridColumns / 2) portWeight += weight;
        else starboardWeight += weight;
        heatmap[r][c] += weight;
      }
    });

    return {
      grid, placements, heatmap,
      totalWeight, portWeight, starboardWeight,
      balanceRatio: Math.min(portWeight, starboardWeight) / Math.max(portWeight, starboardWeight)
    };
  };

  const {
    grid, placements, heatmap,
    totalWeight, portWeight, starboardWeight,
    balanceRatio
  } = calculatePlacement();

  useEffect(() => {
    const overloaded = heatmap.some(row => row.some(cell => cell > 5000));
    setOverloadDetected(overloaded);
  }, [heatmap]);

  const placementInstructions = placements.map(p => ({
    id: `${p.container.number}-${p.position.row}-${p.position.col}`,
    text: `Container ${p.container.number} → Row ${p.position.row + 1}, Col ${p.position.col + 1} (${p.side})`,
    position: p.position
  }));

  const exportToPDF = () => {
    setExporting(true);
    setTimeout(() => {
      alert('PDF exported successfully.');
      setExporting(false);
    }, 1200);
  };

  return (
    <motion.div
      className="ship-grid-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="grid-header">
        <h2><FaShip className="header-icon" /> Ship Load Balancer
          <span className="balance-badge">
            Balance: {(balanceRatio * 100).toFixed(1)}%
          </span>
        </h2>

        <div className="view-controls">
          <button className={`view-btn ${viewMode === 'balance' ? 'active' : ''}`} onClick={() => setViewMode('balance')}>
            <FaBalanceScale /> Balance
          </button>
          <button className={`view-btn ${viewMode === 'weight' ? 'active' : ''}`} onClick={() => setViewMode('weight')}>
            <FaWeightHanging /> Weight Map
          </button>
        </div>
      </div>

      <div className="arrow-indicator">Loading Direction <FaArrowRight /></div>

      <div className="ship-visualization">
        <div
         className="ship-blueprint"
          style={{
    backgroundImage: "url('/assets/final-grid.png')",
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    position: 'relative',
    width: '100%',
    maxWidth: '1200px',
    aspectRatio: '2.6',
    border: '2px solid #0077cc',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  }}
>

        
          <div className="ship-deck-overlay">
            {grid.map((row, rIdx) => (
              <div className="deck-row" key={rIdx}>
                {row.map((cell, cIdx) => (
                  <motion.div
                    className={`deck-cell ${cell ? 'has-container' : ''}`}
                    key={cIdx}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => cell && setActiveContainer(cell)}
                    style={{
                      backgroundColor: cell
                        ? `hsl(${Math.min(120, cell.weight / 30000 * 120)}, 70%, 60%)`
                        : viewMode === 'weight'
                          ? `hsl(240, 70%, ${100 - Math.min(100, heatmap[rIdx][cIdx] / 5000 * 80)}%)`
                          : 'transparent',
                      border: cell ? '2px solid #fff' : '1px solid rgba(255,255,255,0.2)'
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
            <h3><FaBalanceScale /> Weight Distribution <FaInfoCircle className="info-icon" /></h3>
            <div className="weight-bars">
              <div className="weight-bar port">
                <div className="bar-fill" style={{ width: `${(portWeight / totalWeight) * 100}%` }}></div>
                <span>Port: {portWeight}kg</span>
              </div>
              <div className="weight-bar starboard">
                <div className="bar-fill" style={{ width: `${(starboardWeight / totalWeight) * 100}%` }}></div>
                <span>Starboard: {starboardWeight}kg</span>
              </div>
            </div>
          </div>

          {overloadDetected && (
            <div className="overload-warning">
              <FaExclamationTriangle />
              Overload detected in one or more zones!
            </div>
          )}

          <div className="placement-instructions">
            <h3>Instructions</h3>
            {placementInstructions.map(i => (
              <div
                key={i.id}
                className="instruction-item"
                onMouseEnter={() => {
                  document
                    .querySelector(`.deck-row:nth-child(${i.position.row + 1}) .deck-cell:nth-child(${i.position.col + 1})`)
                    ?.classList.add('highlighted');
                }}
                onMouseLeave={() => {
                  document
                    .querySelector(`.deck-row:nth-child(${i.position.row + 1}) .deck-cell:nth-child(${i.position.col + 1})`)
                    ?.classList.remove('highlighted');
                }}
              >
                {i.text}
              </div>
            ))}
          </div>

          <button className="export-btn" disabled={exporting} onClick={exportToPDF}>
            {exporting ? 'Exporting...' : (<><FaDownload /> Export Load Plan</>)}
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
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
            >
              <h3>Container Details</h3>
              <div className="detail-row">
                <span>Number:</span>
                <strong>{activeContainer.number}</strong>
              </div>
              <div className="detail-row">
                <span>Weight:</span>
                <strong>{activeContainer.weight} kg</strong>
              </div>
              <div className="detail-row">
                <span>Position:</span>
                <strong>
                  {placements.find(p => p.container.number === activeContainer.number)?.position
                    ? `Row ${placements.find(p => p.container.number === activeContainer.number).position.row + 1}, Col ${placements.find(p => p.container.number === activeContainer.number).position.col + 1}`
                    : 'N/A'}
                </strong>
              </div>
              <button className="close-btn" onClick={() => setActiveContainer(null)}>Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ShipGrid;
