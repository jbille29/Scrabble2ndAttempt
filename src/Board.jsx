// components/Board.jsx
import React, { useState } from 'react';
import Square from './Square';
import Tile from './Tile';

const Board = () => {
  const gridWidth = 8; // Set grid width for 8x8 grid
  const gridCellSize = '50px'; // Size for each cell in the grid
  const totalTiles = gridWidth * gridWidth; // Total number of tiles for an 8x8 grid

  // Define pre-placed tiles and their positions on an 8x8 board
  const prePlacedTiles = [
    { id: 1, letter: 'R', position: 10, isPrePlaced: true },
    { id: 2, letter: 'B', position: 20, isPrePlaced: true },
    { id: 3, letter: 'C', position: 30, isPrePlaced: true },
    { id: 4, letter: 'M', position: 40, isPrePlaced: true },
    { id: 5, letter: 'N', position: 50, isPrePlaced: true },
  ];

  // Define tiles in the letter pool
  const letterPool = [
    { id: 6, letter: 'D', isPrePlaced: false },
    { id: 7, letter: 'E', isPrePlaced: false },
    { id: 8, letter: 'F', isPrePlaced: false },
    { id: 9, letter: 'G', isPrePlaced: false },
    { id: 10, letter: 'H', isPrePlaced: false },
    { id: 11, letter: 'I', isPrePlaced: false },
    { id: 12, letter: 'J', isPrePlaced: false },
  ];

  const featureSquares = {
    3: { multiplier: 2 },   // Double the score of the tile placed here
    7: { multiplier: -1 },  // Subtract points for the tile placed here
    20: { multiplier: 3 },  // Triple the score of the tile placed here
  };

  // Initialize the board with nulls and include features and pre-placed tiles
  const initialBoardState = Array(totalTiles).fill(null).map((_, index) => ({
    tile: prePlacedTiles.find(t => t.position === index) || null,
    feature: featureSquares[index] || null
  }));

  const [tilesInPool, setTilesInPool] = useState(letterPool);
  const [board, setBoard] = useState(initialBoardState);

  const moveTileToBoard = (tile, toIndex) => {
    const newBoard = [...board];
    const currentIndex = newBoard.findIndex(t => t?.tile?.id === tile.id);

    if (currentIndex !== -1) {
      newBoard[currentIndex].tile = null;
    }

    newBoard[toIndex].tile = { ...tile, isPrePlaced: false };
    setBoard(newBoard);

    if (currentIndex === -1) {
      setTilesInPool(tilesInPool.filter(t => t.id !== tile.id));
    }
  };

  const returnTileToArea = (index) => {
    const tileData = board[index].tile;
    if (tileData && !tileData.isPrePlaced) {
      setTilesInPool([...tilesInPool, tileData]);
      const newBoard = [...board];
      newBoard[index].tile = null;
      setBoard(newBoard);
    }
  };

  // Function to calculate score, can be triggered by a game event
  const calculateScore = () => {
    return board.reduce((score, square) => {
      if (square.tile) {
        const baseScore = 1; // Placeholder for tile score calculation
        const multiplier = square.feature ? square.feature.multiplier : 1;
        return score + (baseScore * multiplier);
      }
      return score;
    }, 0);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        {tilesInPool.map(tile => (
          <Tile key={tile.id} letter={tile.letter} id={tile.id} isDraggable={!tile.isPrePlaced} />
        ))}
      </div>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(${gridWidth}, ${gridCellSize})`, 
        gap: '5px',
        maxWidth: `${gridWidth * parseInt(gridCellSize)}px` // Ensure the grid container width matches the number of cells
      }}>
        {board.map((square, index) => (
          <Square key={index} id={index} onDrop={moveTileToBoard} returnTile={returnTileToArea} tile={square.tile} feature={square.feature} />
        ))}
      </div>
    </div>
  );
};

export default Board;
