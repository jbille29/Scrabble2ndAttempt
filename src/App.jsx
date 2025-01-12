import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isTouchDevice } from './utils';
import Board from './Board';

function App() {
  const backend = isTouchDevice() ? TouchBackend : HTML5Backend;

  const backendOptions = {
    enableMouseEvents: true, // This will allow the backend to process mouse events as touch events
  };

  return (
    <DndProvider backend={backend} options={backendOptions}>
      <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
        <Board />
      </div>
    </DndProvider>
  );
}

export default App;
