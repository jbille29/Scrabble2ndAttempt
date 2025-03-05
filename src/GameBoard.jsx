import React, { useState, useEffect } from 'react';
import { FaArrowRotateRight } from "react-icons/fa6";

import LetterPool from './components/LetterPool';
import GameStateManager from './components/GameStateManager';
import Square from './Square';
import { extractWords, calculateScore, isConnected, extractWordsAgain } from './utils/gameUtils';
import letterScores from './utils/letterScores';



const GameBoard = () => {
  let gridWidth = 5; // Set grid width for 8x8 grid
  const [tileSize, setTileSize] = useState('50px');
  const [counter, setCounter] = useState(0);
  
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [showTutorial, setShowTutorial] = useState(false); // State to control the visibility of the tutorial modal

  const {
    board, setBoard,
    tilesInPool, setTilesInPool,
    validWords, fetchGameData, handleNextGame, clearGameState, handleSkipPuzzle,
    gameOver, setGameOver
  } = GameStateManager(gridWidth);

  useEffect(() => {
    // Check local storage for game statistics
    const gameStats = localStorage.getItem('gameStats');
    if (!gameStats) {
      // If no gameStats are found, it's the user's first visit
      setShowTutorial(true);
      localStorage.setItem('gameStats', JSON.stringify({ visited: true }));
    }

    // Your existing useEffect logic here
  }, []);

  const handleTutorialClose = () => {
    setShowTutorial(false);
  };
  
  
  // SCALING TILE SIZE BASED ON VIEWPORT
  useEffect(() => {
    const updateTileSize = () => {
      const size = Math.min(window.innerWidth / (gridWidth + 2), 60); // Example responsive calculation
      setTileSize(`${size}px`);
    };
    window.addEventListener('resize', updateTileSize);
    updateTileSize(); // Initial call to set size based on current viewport
    return () => window.removeEventListener('resize', updateTileSize);
  }, []);

  // HELPER FUNCTIONS
  const validateWords = (board, gridWidth) => {
    // Check horizontally and vertically if words are valid
    let isValid = true;
    const words = extractWords(board, gridWidth); // Assume this function extracts all words formed on the board
    console.log('Words:', words);
    // Check each word if it's valid
    words.forEach(word => {
      if (!validWords.includes(word.toUpperCase())) {
        console.log('Invalid word:', word);
        isValid = false;
      }
    });

    // Update the board with the validity state for each tile
    const newBoard = board.map(square => {
      if (square.tile && words.includes(square.tile.letter)) {
        return { ...square, isValid: isValid };
      }
      return square;
    });

    return newBoard;
  };
  const handleCalculateScore = () => {
    if (gameOver) return;

    const newBoard = validateWords(board, gridWidth);
    setBoard(newBoard);

    const words = extractWords(board, gridWidth);
    
    if (!isConnected(board, gridWidth)) {
      setModalContent("Please ensure all tiles are connected to an anchor tile.");
      setShowModal(true);
    } else if (!words.every(word => validWords.includes(word.toUpperCase()))) {
      setModalContent("One or more words are not valid. Please check and try again.");
      setShowModal(true);
    } else {

      calculateScore(board, extractWordsAgain(board, gridWidth), letterScores, setModalContent);
      setShowModal(true);
      setGameOver(true);
    }
    
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // DND FUNCTIONS
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
  const returnTileToPool = (tileId) => {
    const tileIndex = board.findIndex(square => square.tile?.id === tileId);
    if (tileIndex !== -1) {
      const tile = board[tileIndex].tile;
      board[tileIndex].tile = null;  // Remove the tile from the board
      setBoard([...board]);
      setTilesInPool([...tilesInPool, tile]);  // Add tile back to the pool
    }
  };

  // STYLE VARIABLES
  const paddingTotal = 10 * 2; // 10px padding on each side
  const gapTotal = (gridWidth - 1) * 5; // Total gap based on number of gaps
  const totalWidth = parseInt(tileSize) * gridWidth + gapTotal + paddingTotal;

  return (
    <div style={{
      '--grid-width': `${totalWidth}px`,  // CSS Variable
      width: 'var(--grid-width)', // Full width
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      
    }}>
      <div className="board-container" style={{ 
          display: 'grid',
          gridTemplateColumns: `repeat(${gridWidth}, ${tileSize})`,
          gap: '5px',
          padding: '10px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // Subtle shadow for depth
          borderRadius: '8px', // Rounded corners
          boxSizing: "border-box",
        }}>
        {board && board.map((square, index) => (
          <Square key={index} id={index} onDrop={moveTileToBoard} returnTile={returnTileToArea} tile={square.tile} feature={square.feature} letterScores={letterScores} tileSize={tileSize}/>
        ))}
      </div>
      
      <LetterPool 
        tilesInPool={tilesInPool}
        tileSize={tileSize} 
        letterScores={letterScores} 
        returnTileToPool={returnTileToPool} 
      />

      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <FaArrowRotateRight 
            style={{
                border: "none",
                color: "#455a64",
                cursor: "pointer",
                fontSize: "24px",
                padding: "5px 10px",
                borderRadius: "5px"
            }}
          />
          <button onClick={handleCalculateScore}>Submit</button>
          <button onClick={clearGameState} style={{
        backgroundColor: '#f44336', // Soft red color
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        fontSize: '14px',
        borderRadius: '4px',
        cursor: 'pointer'
      }}>Reset Game</button>
      <button onClick={handleNextGame}>Next Game</button>
          <div style={{width: '43px'}}></div>
      </div>
     
      {showTutorial && (
        <div>
          <h2>Welcome to Your First Game!</h2>
          <p>This is a quick tutorial to get you started.</p>
          <button onClick={handleTutorialClose}>Close Tutorial</button>
        </div>
      )}
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

export default GameBoard;