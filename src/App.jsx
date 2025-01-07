import React, { useState } from 'react';
import DraggableSquare from './DraggableSquare';
import DropZone from './DropZone';

function App() {
  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragStart = (e) => {
    console.log("Drag started");
    setDraggedItem(e.target);
  };

  const handleDrop = (e) => {
    console.log("Dropped");
    e.preventDefault();
    e.target.style.backgroundColor = 'lightblue';
    e.target.appendChild(draggedItem);
  };

  const handleDragOver = (e) => {
    console.log("Dragging over drop zone");
    e.preventDefault();
  };

  const handleTouchStart = (e) => {
    console.log("Touch start");
    setDraggedItem(e.target);
  };

  const handleTouchMove = (e) => {
    console.log("Touch move");
    e.preventDefault();
    const touchLocation = e.targetTouches[0];
    draggedItem.style.position = 'fixed'; // To move with the touch
    draggedItem.style.left = `${touchLocation.clientX - 25}px`; // 25 is half the width to center the touch
    draggedItem.style.top = `${touchLocation.clientY - 25}px`; // 25 is half the height to center the touch
  };

  const handleTouchEnd = (e) => {
    console.log("Touch end");
    e.preventDefault();
    // Find drop zone coordinates
    const dropZone = document.querySelector('.DropZone');
    const dzRect = dropZone.getBoundingClientRect();
    const didDrop = e.changedTouches[0].clientX >= dzRect.left &&
                    e.changedTouches[0].clientX <= dzRect.right &&
                    e.changedTouches[0].clientY >= dzRect.top &&
                    e.changedTouches[0].clientY <= dzRect.bottom;
    
    if (didDrop) {
      dropZone.appendChild(draggedItem);
      dropZone.style.backgroundColor = 'lightblue';
      console.log("Dropped inside zone");
    }
  };

  return (
    <div className="App" style={{ padding: '20px' }}>
      <DraggableSquare onDragStart={handleDragStart} onTouchStart={handleTouchStart} />
      <DropZone onDrop={handleDrop} onDragOver={handleDragOver} />
      <div onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} className="touchArea">
        {/* Full-screen touch area to capture touch moves and ends */}
      </div>
    </div>
  );
}

export default App;
