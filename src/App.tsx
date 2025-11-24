import React from 'react';
import WineRack from './components/WineRack';
import './App.css';  // Import the CSS file

const App: React.FC = () => {
  return (
    <div className="wine-rack-container">
      <h1>Haley and Sean's Wine Rack</h1>
      <WineRack />
    </div>
  );
};

export default App;