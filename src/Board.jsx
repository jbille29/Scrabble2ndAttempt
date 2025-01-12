// components/Board.jsx
import React, { useState } from 'react';
import Square from './Square';
import Tile from './Tile';

const Board = () => {
  // Tiles initially not on the board
  const initialTiles = [
    { id: 1, letter: 'A' },
    { id: 2, letter: 'B' },
    { id: 3, letter: 'C' },
    { id: 4, letter: 'D' },
    { id: 5, letter: 'E' },
  ];

  const [tiles, setTiles] = useState(initialTiles);
  const [board, setBoard] = useState(Array(25).fill(null)); // Board squares are initially empty

  const moveTileToBoard = (tile, toIndex) => {
    const newBoard = [...board];

    // Find and remove the tile from its current position if it's already on the board
    const currentIndex = newBoard.findIndex(t => t?.id === tile.id);
    if (currentIndex !== -1) {
      newBoard[currentIndex] = null;
    }
    
    // Place the tile on the new position on the board
    newBoard[toIndex] = tile;
    setBoard(newBoard);

    // If the tile was not on the board already, remove it from the tile area
    if (!board.includes(tile)) {
      setTiles(tiles.filter(t => t.id !== tile.id));
    }
  };

  const returnTileToArea = (index) => {
    const tile = board[index];
    if (tile) {
      setTiles([...tiles, tile]); // Add the tile back to the tile area
      const newBoard = [...board];
      newBoard[index] = null; // Remove the tile from the board
      setBoard(newBoard);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        {tiles.map(tile => (
          <Tile key={tile.id} letter={tile.letter} id={tile.id} />
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 50px)', gap: '5px' }}>
        {board.map((tile, index) => (
          <Square key={index} id={index} onDrop={moveTileToBoard} returnTile={returnTileToArea} tile={tile} />
        ))}
      </div>
    </div>
  );
};

export default Board;
