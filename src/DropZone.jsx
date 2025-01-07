import React from 'react';

function DropZone({ onDrop, onDragOver }) {
  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      style={{
        width: '200px',
        height: '200px',
        backgroundColor: 'lightgray',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      Drop here
    </div>
  );
}

export default DropZone;
