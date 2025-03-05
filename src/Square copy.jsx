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
    iconText: 'x2'
  },
  subtractPoints: {
    backgroundColor: 'rgba(247, 198, 199, 0.3)',
    icon: <FontAwesomeIcon icon={faMinus} />, // Example icon for subtract points
    iconText: ''
  },
  tripleLetterScore: {
    backgroundColor: 'rgba(109, 89, 122, 0.3)',
    icon: <FontAwesomeIcon icon={faArrowUp} />, // Example icon for triple score
    iconText: 'x3'
  },
  doubleWordScore: {
    backgroundColor: 'rgba(224, 122, 95, 0.3)',
    icon: <FontAwesomeIcon icon={faArrowUp} />, // Example icon for triple score
    iconText: 'wx2'
  },
  tripleWordScore: {
    backgroundColor: 'rgba(184, 92, 92, 0.3)',
    icon: <FontAwesomeIcon icon={faArrowUp} />, // Example icon for triple score
    iconText: 'wx3'
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

  let backgroundColor = tile 
  ? (feature && featureStyles[feature.type] 
      ? featureStyles[feature.type].backgroundColor.replace('0.6', '1') // Fully opaque when occupied
      : 'transparent') 
  : (feature && featureStyles[feature.type] 
      ? featureStyles[feature.type].backgroundColor 
      : '#DDE6EF');

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
      {tile && <Tile key={tile.id} letter={tile.letter} id={tile.id} isDraggable={!tile.isPrePlaced} letterScores={letterScores} tileSize={tileSize} featureBackground={feature ? featureStyles[feature.type].backgroundColor : null} featureText={feature ? featureStyles[feature.type].iconText : null}/>} 
      {!tile && feature && (
        <span style={{
          
          fontSize: `25px`,
          color: 'rgba(0, 0, 0, 0.6)'
        }}>
          {featureStyles[feature.type].iconText}
        </span>
      )}
    </div>
  );
};

export default Square;
