// components/LetterPool.jsx
import React from 'react';
import Tile from '../Tile';
import { useDrop } from 'react-dnd';

const LetterPool = ({ tilesInPool, setTilesInPool, tileSize, letterScores, returnTileToPool }) => {
  const [, drop] = useDrop({
    accept: 'tile',
    drop: (item) => {
        console.log("Dropped item in pool:", item);
        returnTileToPool(item.id)
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  return (
    <div ref={drop} style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        flexWrap: 'wrap', 
        marginBottom: '20px',
        minHeight: '60px',
        backgroundColor: '#f0f0f0'  // Optional: visual feedback for drop area
    }}>
      {tilesInPool.map(tile => (
        <div style={{
            width: tileSize,
            height: tileSize,
            marginRight: '5px', 
            marginTop: '25px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }} key={tile.id}>
          <Tile 
            key={tile.id}
            letter={tile.letter}
            id={tile.id}
            isDraggable={!tile.isPrePlaced}
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
