import React from 'react';

function DraggableSquare({ onDragStart }) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      style={{
        width: '50px',
        height: '50px',
        backgroundColor: 'blue',
        cursor: 'grab'
      }}
    >
    </div>
  );
}

export default DraggableSquare;
