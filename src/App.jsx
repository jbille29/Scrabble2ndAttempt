import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isTouchDevice } from './utils/utils';
import Board from './Board';
import Navbar from './components/Navbar';
import TutorialModal from './components/modals/TutorialModal';

function App() {
  const backend = isTouchDevice() ? TouchBackend : HTML5Backend;
  const [isNewDay, setIsNewDay] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format
    const lastPlayed = localStorage.getItem('lastPlayed'); // Retrieve the last played date from local storage

    if (lastPlayed !== today) {
      setIsNewDay(true); // Set flag to show new day modal if it's a new day
      localStorage.setItem('lastPlayed', today); // Update last played date in local storage
    }
  }, []);

  const backendOptions = {
    enableMouseEvents: true, // This will allow the backend to process mouse events as touch events
  };

  return (
    <DndProvider backend={backend} options={backendOptions}>
      <Navbar />
      <div style={{
       display: 'flex',
       flexDirection: 'column',
       alignItems: 'center', // Centered horizontally
       padding: '40px 0', // Top and bottom padding only
       backgroundColor: '#f7f7f7', // Soft grey background
       minHeight: 'calc(100vh - 60px)', // Adjust for navbar height
       fontFamily: 'Arial, sans-serif' // Simple sans-serif font
      }}>
        <TutorialModal isVisible={isNewDay} onClose={() => setIsNewDay(false)} />
        <Board />
      </div>
    </DndProvider>
  );
}

export default App;
