// components/Tile.jsx
import React from 'react';
import { useDrag } from 'react-dnd';

const Tile = ({ letter, id, isDraggable, letterScores }) => {
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
      fontWeight: 'bold',
      fontSize: '16px',
      textAlign: 'center',
      padding: '10px',
      margin: '1px',
      backgroundColor: '#ffffff', // Bright white tiles
      border: '1px solid #b0bec5', // Subtle blue-gray 
      backgroundColor: '#fff', // Bright white background for the tile
      position: 'relative', // Position relative to place the score inside
      width: '48px', // Ensure the width matches the grid
      height: '48px', // Ensure the height matches the grid
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {letter}
      <span style={{
        position: 'absolute',
        bottom: '2px', // Close to the bottom
        left: '2px', // Close to the left
        fontSize: '10px', // Smaller font size for the score
        color: 'rgba(0, 0, 0, 0.6)' // Slightly dimmed color for aesthetics
      }}>
        {letterScores[letter.toUpperCase()]}
      </span>
    </div>
  );
};

export default Tile;
