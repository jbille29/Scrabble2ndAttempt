// components/Board.jsx
import React, { useState } from 'react';
import Square from './Square';
import Tile from './Tile';

const Board = () => {
  // Define pre-placed tiles and their positions on a 5x5 board
  const prePlacedTiles = [
    { id: 1, letter: 'R', position: 12, isPrePlaced: true },
    { id: 2, letter: 'B', position: 13, isPrePlaced: true },
    { id: 3, letter: 'C', position: 14, isPrePlaced: true },
  ];

  // Define tiles in the letter pool
  const letterPool = [
    { id: 4, letter: 'D', isPrePlaced: false },
    { id: 5, letter: 'E', isPrePlaced: false },
  ];

  // Initialize the board with nulls and place pre-placed tiles
  const initialBoardState = Array(25).fill(null);
  prePlacedTiles.forEach(tile => {
    initialBoardState[tile.position] = tile;
  });

  const [tilesInPool, setTilesInPool] = useState(letterPool);
  const [board, setBoard] = useState(initialBoardState); // Board now starts with pre-placed tiles

  const moveTileToBoard = (tile, toIndex) => {
    const newBoard = [...board];

    // Check if moving within the board or from pool
    const currentIndex = newBoard.findIndex(t => t?.id === tile.id);
    if (currentIndex !== -1) {
      newBoard[currentIndex] = null; // Remove from current position
    }

    // Place the tile in the new position
    newBoard[toIndex] = {...tile, isPrePlaced: false}; // Mark it as not pre-placed when moved
    setBoard(newBoard);

    // If the tile was from the pool, remove it from the pool
    if (currentIndex === -1) {
      setTilesInPool(tilesInPool.filter(t => t.id !== tile.id));
    }
  };

  const returnTileToArea = (index) => {
    const tile = board[index];
    if (tile && !tile.isPrePlaced) { // Only allow returning non pre-placed tiles to the pool
      setTilesInPool([...tilesInPool, tile]); // Add the tile back to the tile area
      const newBoard = [...board];
      newBoard[index] = null; // Remove the tile from the board
      setBoard(newBoard);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        {tilesInPool.map(tile => (
          // Adjust the rendering logic in Board.jsx
          <Tile key={tile.id} letter={tile.letter} id={tile.id} isDraggable={!tile.isPrePlaced} />
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
