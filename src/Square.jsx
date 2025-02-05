// components/Square.jsx
import React from 'react';
import { useDrop } from 'react-dnd';
import Tile from './Tile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faMinus, faArrowUp } from '@fortawesome/free-solid-svg-icons';

const featureStyles = {
  doubleLetterScore: {
    backgroundColor: '#b6e6bd',
    icon: <FontAwesomeIcon icon={faTimes} />, // Example icon for double score
    iconText: 'x2'
  },
  subtractPoints: {
    backgroundColor: '#f7c6c7',
    icon: <FontAwesomeIcon icon={faMinus} />, // Example icon for subtract points
    iconText: ''
  },
  tripleLetterScore: {
    backgroundColor: '#f9d67a',
    icon: <FontAwesomeIcon icon={faArrowUp} />, // Example icon for triple score
    iconText: 'x3'
  }
};

const Square = ({ onDrop, returnTile, tile, id, feature, letterScores, tileSize}) => {
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

  let backgroundColor = tile ? 'transparent' : (feature && featureStyles[feature.type] ? featureStyles[feature.type].backgroundColor : '#DDE6EF');
  let icon = null; // No icon by default
  let iconText = '';
  
  // Apply feature styles if the feature exists
  if (feature && featureStyles[feature.type]) {
    backgroundColor = featureStyles[feature.type].backgroundColor;
    icon = featureStyles[feature.type].icon;
    iconText = featureStyles[feature.type].iconText;
  }

  if (isOver && canDrop) {
    backgroundColor = '#aaf'; // Active drag over and can drop
  } else if (isOver && !canDrop) {
    backgroundColor = '#f88'; // Active drag over and cannot drop
  }

  return (
    <div ref={drop} 
    className='empty-square'
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
    }}
         onDoubleClick={handleDoubleClick}>
          {tile && <Tile key={tile.id} letter={tile.letter} id={tile.id} isDraggable={!tile.isPrePlaced} letterScores={letterScores} tileSize={tileSize} featureBackground={feature ? featureStyles[feature.type].backgroundColor : null}/>}
          {feature && feature.icon && (
            <div style={{
              position: 'absolute',
              fontSize: '12px',
              color: '#333',
              bottom: '5px',
              right: '5px'
            }}>
          {feature.icon}{feature.iconText}
        </div>
      )}
    </div>
  );
};

export default Square;
