// components/Board.jsx
import React, { useState } from 'react';
import Square from './Square';
import Tile from './Tile';

const Board = () => {
  const gridWidth = 8; // Set grid width for 8x8 grid
  const gridCellSize = '50px'; // Size for each cell in the grid
  const totalTiles = gridWidth * gridWidth; // Total number of tiles for an 8x8 grid

  const validWords = ['APPLE', 'ORANGE', 'GRAPE', 'BANANA', 'CHERRY'];

  const letterScores = {
    A: 1, B: 3, C: 3, D: 2, E: 1,
    F: 4, G: 2, H: 4, I: 1, J: 8,
    K: 5, L: 1, M: 3, N: 1, O: 1,
    P: 3, Q: 10, R: 1, S: 1, T: 1,
    U: 1, V: 4, W: 4, X: 8, Y: 4,
    Z: 10
  };
  
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
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");

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

  const extractWords = (board) => {
    let words = [];
    let word = '';

    // Horizontal words
    for (let i = 0; i < gridWidth; i++) {
      word = '';
      for (let j = 0; j < gridWidth; j++) {
        const tile = board[i * gridWidth + j].tile;
        if (tile) {
          word += tile.letter;
        } else if (word.length > 1) {
          words.push(word);
          word = '';
        } else {
          word = '';
        }
      }
      if (word.length > 1) words.push(word); // Check last word in the row
    }

    // Vertical words
    for (let j = 0; j < gridWidth; j++) {
      word = '';
      for (let i = 0; i < gridWidth; i++) {
        const tile = board[i * gridWidth + j].tile;
        if (tile) {
          word += tile.letter;
        } else if (word.length > 1) {
          words.push(word);
          word = '';
        } else {
          word = '';
        }
      }
      if (word.length > 1) words.push(word); // Check last word in the column
    }

    return words;
  };

  const calculateScore = () => {
    let score = 0;
    const words = extractWords(board);
    const valid = words.every(word => validWords.includes(word.toUpperCase()));
    let isConnected = true; // Implement your connectivity validation here

    if (valid && isConnected) {
      words.forEach(word => {
        score += word.split('').reduce((acc, letter) => acc + letterScores[letter.toUpperCase()], 0);
      });
      setModalContent(`Your score is: ${score}`);
    } else {
      setModalContent("Invalid words or tile placement.");
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        {tilesInPool.map(tile => (
          <Tile key={tile.id} letter={tile.letter} id={tile.id} isDraggable={!tile.isPrePlaced} letterScores={letterScores} />
        ))}
      </div>
      <div style={{ 
          display: 'grid',
          gridTemplateColumns: `repeat(${gridWidth}, ${gridCellSize})`,
          gap: '5px',
          maxWidth: `${gridWidth * parseInt(gridCellSize)}px`,
          backgroundColor: '#ffffff', // Bright, clean background for the grid
          padding: '10px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)' // Subtle shadow for depth
      }}>
        {board.map((square, index) => (
          <Square key={index} id={index} onDrop={moveTileToBoard} returnTile={returnTileToArea} tile={square.tile} feature={square.feature} letterScores={letterScores}/>
        ))}
      </div>
      <button 
        onClick={calculateScore} 
        style={{ 
          marginTop: '20px',
          backgroundColor: '#4CAF50', // Vibrant green color
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          cursor: 'pointer',
          fontSize: '16px',
          borderRadius: '5px'
        }}>Submit</button>
      {showModal && (
        <div 
          style={{ 
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          backgroundColor: 'white', padding: '20px', zIndex: 1000,
          borderRadius: '8px', boxShadow: '0 6px 12px rgba(0,0,0,0.15)'
          }}>
          <p>{modalContent}</p>
          <button onClick={handleCloseModal}
          style={{
            backgroundColor: '#f44336', // Soft red color
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            fontSize: '14px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Board;
