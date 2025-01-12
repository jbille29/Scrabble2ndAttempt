// components/Tile.jsx
import React from 'react';
import { useDrag } from 'react-dnd';

const Tile = ({ letter, id }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'tile',
    item: { id, letter },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} style={{
      opacity: isDragging ? 0.5 : 1,
      cursor: 'move',
      padding: '10px',
      margin: '5px',
      border: '1px solid black',
      fontWeight: 'bold',
      fontSize: '16px',
      textAlign: 'center'
    }}>
      {letter}
    </div>
  );
};

export default Tile;
