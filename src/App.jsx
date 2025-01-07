import React, { useState } from 'react';
import DraggableSquare from './DraggableSquare';
import DropZone from './DropZone';

function App() {
  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragStart = (e) => {
    setDraggedItem(e.target);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.target.style) {
      e.target.style.backgroundColor = 'lightblue';
    }
    e.target.appendChild(draggedItem);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="App" style={{ padding: '20px' }}>
      <DraggableSquare onDragStart={handleDragStart} />
      <DropZone onDrop={handleDrop} onDragOver={handleDragOver} />
    </div>
  );
}

export default App;
