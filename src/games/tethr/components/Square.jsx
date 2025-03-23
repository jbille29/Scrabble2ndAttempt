// components/Square.jsx
import React from 'react';
import { useDrop } from 'react-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faMinus, faArrowUp } from '@fortawesome/free-solid-svg-icons';

import Tile from './Tile';

const featureStyles = {
  doubleLetterScore: {
    backgroundColor: 'var(--double-letter)',
    icon: <FontAwesomeIcon icon={faTimes} />, // Example icon for double score
    iconText: 'DL'
  },
  subtractPoints: {
    backgroundColor: 'rgba(247, 198, 199, 0.1)',
    icon: <FontAwesomeIcon icon={faMinus} />, // Example icon for subtract points
    iconText: ''
  },
  tripleLetterScore: {
    backgroundColor: 'var(--triple-letter)',
    icon: <FontAwesomeIcon icon={faArrowUp} />, // Example icon for triple score
    iconText: 'TL'
  },
  doubleWordScore: {
    backgroundColor: 'var(--double-word)',
    icon: <FontAwesomeIcon icon={faArrowUp} />, // Example icon for triple score
    iconText: 'DW'
  },
  tripleWordScore: {
    backgroundColor: 'var(--triple-word)',
    icon: <FontAwesomeIcon icon={faArrowUp} />, // Example icon for triple score
    iconText: 'TW'
  }
};

const Square = ({ onDrop, returnTile, tile, id, feature, letterScores, tileSize, gameOver}) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'tile',
    drop: (item) => onDrop(item, id),
    canDrop: () => !tile, // Only allow dropping if there's no tile or the tile is not pre-placed
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  const handleDoubleClick = () => {
    returnTile(id);
  };

  let backgroundColor = feature 
    ? featureStyles[feature.type].backgroundColor // Use feature color
    : 'var(--empty-tile-blue)'; // Default tile color

  // If a tile is placed, make the background fully solid
  if (tile && feature) {
    backgroundColor = featureStyles[feature.type].backgroundColor; // Remove transparency
  } else if (tile) {
    backgroundColor = 'transparent'; // Normal tile placement stays transparent
  }

  let iconText = feature ? featureStyles[feature.type].iconText : '';
  
  if (isOver && canDrop) {
    backgroundColor = 'var(--secondary-blue)';
  } else if (isOver && !canDrop) {
    backgroundColor = 'var(--attempt-circle-active)'; // Drag over & can't drop
  }

  const adjustedTileSize = parseInt(tileSize, 10);

  return (
    <div ref={drop} 
      className='empty-square'
      onDoubleClick={handleDoubleClick}
      style={{ 
        width: tileSize,
        height: tileSize,
        backgroundColor, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        boxSizing: 'border-box',
        padding: '0',
        position: 'relative',
        borderRadius: '5px',
        userSelect: 'none',  // Prevent text selection
    }}>
      {tile && (
        <Tile 
          key={tile.id} 
          letter={tile.letter} 
          id={tile.id} 
          isDraggable={!gameOver && !tile.isPrePlaced}
          letterScores={letterScores} 
          tileSize={tileSize} 
          featureBackground={feature ? featureStyles[feature.type].backgroundColor : null} 
          featureText={feature ? featureStyles[feature.type].iconText : null}
        />
      )}
      {!tile && feature && (
        <span style={{
          position: 'absolute',
          bottom: '2px',
          right: '4px',
          fontSize: `${Math.max(8, adjustedTileSize / 4)}px`,
          color: 'rgba(0, 0, 0, 0.6)',
          fontFamily: 'Nunito, sans-serif',
        }}>
          {iconText}
        </span>
      )}
    </div>
  );
};

export default Square;
