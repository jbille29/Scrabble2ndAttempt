import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

import { isTouchDevice } from './utils/utils';
import Navbar from './components/Navbar';
import GameBoard from './games/tethr/GameBoard';
import StatsModal from './games/tethr/components/modals/StatsModal';
import TutorialModal from './games/tethr/components/modals/TutorialModal';
import HomePage from './pages/HomePage';
const backend = isTouchDevice() ? TouchBackend : HTML5Backend;


function TethrPage() {
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showTutorialModal, setShowTutorialModal] = useState(false);

  const backendOptions = {
    enableMouseEvents: true, // This will allow the backend to process mouse events as touch events
  };

  return (
    <DndProvider backend={backend} options={backendOptions}>
      <Navbar 
        onToggleStats={() => setShowStatsModal(!showStatsModal)} 
        onToggleInfo={() => setShowTutorialModal(!showTutorialModal)}
      />
      <div 
        style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Centered horizontally
        padding: '25px 0', // Top and bottom padding only
        minHeight: 'calc(100vh - 280px)', // Adjust for navbar height
        fontFamily: 'Arial, sans-serif', // Simple sans-serif font
        maxWidth: '100%', // Ensure it does not exceed the viewport width
        overflow: 'hidden', // Hide any accidental overflow
        boxSizing: 'border-box', // Include padding in width calculation
        }}>
        <GameBoard />
      </div>
      <StatsModal isVisible={showStatsModal} onClose={() => setShowStatsModal(false)} />
      <TutorialModal isVisible={showTutorialModal} onClose={() => setShowTutorialModal(false)} />
    </DndProvider>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tethr" element={<TethrPage />} />
        {/* Add future games as new <Route> elements */}
      </Routes>
    </Router>
  );
}

export default App;
