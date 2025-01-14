// components/Tile.jsx
import React from 'react';
import { useDrag } from 'react-dnd';

const Tile = ({ letter, id, isDraggable, letterScores, tileSize }) => {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: 'tile',
    item: { id, letter },
    canDrag: isDraggable, // Only allow dragging if the tile is not pre-placed
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [isDraggable]); // React on changes to isDraggable

  // Adjust padding and font-size based on tile size
  const adjustedTileSize = parseInt(tileSize, 10);
  const fontSize = Math.max(12, adjustedTileSize / 3);
  const paddingSize = Math.max(4, adjustedTileSize / 12);

  return (
    <div ref={isDraggable ? drag : preview} style={{
      opacity: isDragging ? 0.5 : 1,
      cursor: isDraggable ? 'move' : 'default',
      fontWeight: 'bold',
      fontSize: `${fontSize}px`,
      textAlign: 'center',
      padding: `${paddingSize}px`,
      margin: '0',
      backgroundColor: '#ffffff', // Bright white tiles
      border: '1px solid #b0bec5', // Subtle blue-gray 
      backgroundColor: '#fff', // Bright white background for the tile
      position: 'relative', // Position relative to place the score inside
      width: tileSize, // Ensure the width matches the grid
      height: tileSize, // Ensure the height matches the grid
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      boxSizing: 'border-box', // Include padding and border in the size
    }}>
      {letter}
      <span style={{
        position: 'absolute',
        bottom: '2px', // Close to the bottom
        left: '2px', // Close to the left
        fontSize: `${Math.max(8, adjustedTileSize / 6)}px`,
        color: 'rgba(0, 0, 0, 0.6)' // Slightly dimmed color for aesthetics
      }}>
        {letterScores[letter.toUpperCase()]}
      </span>
    </div>
  );
};

export default Tile;
