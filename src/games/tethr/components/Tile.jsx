// components/Tile.jsx
import React from 'react';
import { useDrag } from 'react-dnd';
import "./Tile.css";

const Tile = ({ letter, id, isDraggable, letterScores, tileSize, featureBackground, featureText}) => {
  
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: 'tile',
    item: { id, letter },
    canDrag: isDraggable, // Only allow dragging if the tile is not pre-placed
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [isDraggable]); // React on changes to isDraggable

  const score = letter ? letterScores[letter.toUpperCase()] : ''; // Safely access scores

  // Adjust padding and font-size based on tile size
  const adjustedTileSize = parseInt(tileSize, 10);
  const fontSize = Math.max(12, adjustedTileSize / 1.6);
  const paddingSize = Math.max(4, adjustedTileSize / 12);

  return (
    <div 
      className='tile'
      ref={isDraggable ? drag : preview} 
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: isDraggable ? 'move' : 'default',
        fontSize: `${fontSize}px`,
        textAlign: 'center',
        padding: `${paddingSize}px`,
        margin: '0',
        border: '1px solid #ccc',
        backgroundColor: !isDraggable 
          ? '#d9b0a7'  // The girls’ pick for pre-placed tiles 🍈🍈
          : '#f2d1c9', // Default tile background
      
        position: 'relative', // Position relative to place the score inside
        width: tileSize, // Ensure the width matches the grid
        height: tileSize, // Ensure the height matches the grid
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '5px', // Rounded corners for aesthetics
        boxSizing: 'border-box', // Include padding and border in the size
        userSelect: 'none',  // Prevent text selection
    }}>
      {letter}
      {letter && ( // Render score only if there is a letter
      <span style={{
        position: 'absolute',
        bottom: '1px', // Close to the bottom
        left: '3px', // Close to the left
        fontSize: `${Math.max(8, adjustedTileSize / 4)}px`,
        fontFamily: 'Nunito, sans-serif',
        color: 'rgba(0, 0, 0, .95)' // Slightly dimmed color for aesthetics
      }}>
         {score}
        </span>
      )}

      {featureText && (
        <span style={{
          position: 'absolute',
          bottom: '-3px',
          right: '2px',
          fontSize: `${Math.max(8, adjustedTileSize / 5)}px`,
          color: 'rgba(0, 0, 0, 0.6)',
          fontFamily: 'Nunito, sans-serif',
        }}>
          {featureText}
        </span>
      )}
    </div>
  );
};

export default Tile;
