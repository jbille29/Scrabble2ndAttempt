// components/Square.jsx
import React from 'react';
import { useDrop } from 'react-dnd';
import Tile from './Tile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faMinus, faArrowUp } from '@fortawesome/free-solid-svg-icons';

const featureStyles = {
  doubleLetterScore: {
    backgroundColor: 'rgba(141, 134, 201, 0.3)',
    icon: <FontAwesomeIcon icon={faTimes} />, // Example icon for double score
    iconText: 'DL'
  },
  subtractPoints: {
    backgroundColor: 'rgba(247, 198, 199, 0.1)',
    icon: <FontAwesomeIcon icon={faMinus} />, // Example icon for subtract points
    iconText: ''
  },
  tripleLetterScore: {
    backgroundColor: 'rgba(109, 89, 122, 0.1)',
    icon: <FontAwesomeIcon icon={faArrowUp} />, // Example icon for triple score
    iconText: 'TL'
  },
  doubleWordScore: {
    backgroundColor: 'rgba(224, 122, 95, 0.1)',
    icon: <FontAwesomeIcon icon={faArrowUp} />, // Example icon for triple score
    iconText: 'DW'
  },
  tripleWordScore: {
    backgroundColor: 'rgba(184, 92, 92, 0.1)',
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
    : '#DDE6EF'; // Default tile color

  // If a tile is placed, make the background fully solid
  if (tile && feature) {
    backgroundColor = featureStyles[feature.type].backgroundColor.replace('0.1', '.3'); // Remove transparency
  } else if (tile) {
    backgroundColor = 'transparent'; // Normal tile placement stays transparent
  }

  let iconText = feature ? featureStyles[feature.type].iconText : '';
  
  if (isOver && canDrop) {
    backgroundColor = '#aaf'; // Active drag over and can drop
  } else if (isOver && !canDrop) {
    backgroundColor = '#f88'; // Active drag over and cannot drop
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
