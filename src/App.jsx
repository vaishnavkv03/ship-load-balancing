import React, { useState } from 'react';
import HomePage from './components/HomePage';
import ContainerInput from './components/ContainerInput';
import ShipGrid from './components/ShipGrid';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [containers, setContainers] = useState([]);
  const [shipInfo, setShipInfo] = useState({
    shipName: '',
    maxCapacity: 20000
  });

  return (
    <div className="App">
      {currentPage === 'home' && (
        <HomePage onStart={() => setCurrentPage('input')} />
      )}

      {currentPage === 'input' && (
        <ContainerInput 
          onSubmit={(containersData) => {
            setContainers(containersData);
            setCurrentPage('grid');
          }}
          onBack={() => setCurrentPage('home')}
          shipInfo={shipInfo}
          setShipInfo={setShipInfo}
        />
      )}

      {currentPage === 'grid' && (
        <ShipGrid 
          containers={containers}
          shipInfo={shipInfo}
          onReset={() => {
            setContainers([]);
            setCurrentPage('input');
          }}
        />
      )}
    </div>
  );
}

export default App;