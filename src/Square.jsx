// components/Square.jsx
import React from 'react';
import { useDrop } from 'react-dnd';
import Tile from './Tile';

const Square = ({ onDrop, returnTile, tile, id }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'tile',
    drop: (item) => onDrop(item, id),
    canDrop: () => !tile, // Only allow dropping if there's no tile currently in the square
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  const handleDoubleClick = () => {
    returnTile(id);
  };

  let backgroundColor = '#f0f0f0'; // Default background
  if (isOver && canDrop) {
    backgroundColor = '#aaf'; // Active drag over and can drop
  } else if (isOver && !canDrop) {
    backgroundColor = '#f88'; // Active drag over and cannot drop
  } else if (canDrop) {
    backgroundColor = '#faa'; // Potential drop zone (only theoretical since it won't happen without isOver)
  }

  return (
    <div ref={drop} style={{ width: '50px', height: '50px', backgroundColor, border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
         onDoubleClick={handleDoubleClick}>
      {tile && <Tile letter={tile.letter} id={tile.id} />}
    </div>
  );
};

export default Square;
