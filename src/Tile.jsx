// components/Tile.jsx
import React from 'react';
import { useDrag } from 'react-dnd';

const Tile = ({ letter, id, isDraggable }) => {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: 'tile',
    item: { id, letter },
    canDrag: isDraggable, // Only allow dragging if the tile is not pre-placed
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [isDraggable]); // React on changes to isDraggable

  return (
    <div ref={isDraggable ? drag : preview} style={{
      opacity: isDragging ? 0.5 : 1,
      cursor: isDraggable ? 'move' : 'default',
      padding: '10px',
      margin: '5px',
      border: '1px solid black',
      fontWeight: 'bold',
      fontSize: '16px',
      textAlign: 'center'
    }}>
      {letter}
    </div>
  );
};

export default Tile;
