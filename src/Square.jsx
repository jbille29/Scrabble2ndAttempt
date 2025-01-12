// components/Square.jsx
import React from 'react';
import { useDrop } from 'react-dnd';
import Tile from './Tile';

const Square = ({ onDrop, returnTile, tile, id }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'tile',
    drop: (item) => onDrop(item, id),
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  const handleDoubleClick = () => {
    returnTile(id);
  };

  const isActive = isOver && canDrop;
  let backgroundColor = '#f0f0f0';
  if (isActive) {
    backgroundColor = '#aaf';
  } else if (canDrop) {
    backgroundColor = '#faa';
  }

  return (
    <div ref={drop} style={{ width: '50px', height: '50px', backgroundColor, border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
         onDoubleClick={handleDoubleClick}>
      {tile && <Tile letter={tile.letter} id={tile.id} />}
    </div>
  );
};

export default Square;
