// components/LetterPool.jsx
import React from 'react';
import Tile from '../Tile';
import { useDrop } from 'react-dnd';

const LetterPool = ({ tilesInPool, tileSize, letterScores, returnTileToPool, gameOver }) => {
  const [, drop] = useDrop({
    accept: 'tile',
    drop: (item) => {
        returnTileToPool(item.id)
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  return (
    <div ref={drop} 
      className='letterpool-container'
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        flexWrap: 'wrap', 
       
        marginBottom: '20px',
       
        height: 'auto', // Allows height to grow
        maxHeight: '300px', // Sets maximum height
        minHeight: `${parseInt(tileSize, 21) + 5}px`, // Sets minimum height
        width: "100%", // Sets minimum width
        overflow: 'hidden', // Allows scrolling inside the container if content overflows
        boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.25)', // Inset shadow
        borderRadius: '8px', // Rounded corners
        marginTop: '20px', // Centers the pool
        paddingTop: '5px', // Adds padding to the top
        paddingBottom: '10px', // Adds padding to the bottom
       
    }}>
      {tilesInPool.map(tile => (
        <div style={{
            width: tileSize,
            height: tileSize,
            marginRight: '5px', 
            marginTop: '5px', // Reduced margin-top for uniformity
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
           
        }} key={tile.id}>
          <Tile 
            key={tile.id}
            letter={tile.letter}
            id={tile.id}
            isDraggable={!gameOver && !tile.isPrePlaced}
            letterScores={letterScores}
            tileSize={tileSize}
            featureBackground={null}
          />
        </div>
      ))}
    </div>
  );
};

export default LetterPool;
