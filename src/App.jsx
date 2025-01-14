import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isTouchDevice } from './utils/utils';
import Board from './Board';
import Navbar from './components/Navbar';

function App() {
  const backend = isTouchDevice() ? TouchBackend : HTML5Backend;

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
       justifyContent: 'center', // Centered vertically
       padding: '40px 0', // Top and bottom padding only
       backgroundColor: '#f7f7f7', // Soft grey background
       minHeight: 'calc(100vh - 60px)', // Adjust for navbar height
       fontFamily: 'Arial, sans-serif' // Simple sans-serif font
      }}>
        <Board />
      </div>
    </DndProvider>
  );
}

export default App;
