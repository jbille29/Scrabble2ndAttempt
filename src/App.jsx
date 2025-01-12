import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Board from './Board';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
        <Board />
      </div>
    </DndProvider>
  );
}

export default App;
