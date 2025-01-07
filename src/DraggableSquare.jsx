import React from 'react';

function DraggableSquare({ onDragStart, onTouchStart }) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onTouchStart={onTouchStart}
      style={{
        width: '50px',
        height: '50px',
        backgroundColor: 'blue',
        cursor: 'grab'
      }}
    >
      {/* Draggable square that can be moved */}
    </div>
  );
}

export default DraggableSquare;
