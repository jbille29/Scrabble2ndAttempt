import React, { useState, useEffect } from 'react';
import Square from './Square';
import { extractWords, calculateScore, isConnected, extractWordsAgain } from './utils/gameUtils';
import { FaArrowRotateRight } from "react-icons/fa6";
import LetterPool from './components/LetterPool';
import axios from 'axios';

const Board = () => {
  let gridWidth = 5; // Set grid width for 8x8 grid
  const [tileSize, setTileSize] = useState('50px');
  const [tilesInPool, setTilesInPool] = useState([]);
  const [counter, setCounter] = useState(0);
  
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [validWords, setValidWords] = useState([]);
  const [showTutorial, setShowTutorial] = useState(false); // State to control the visibility of the tutorial modal

  const letterScores = {
    A: 1, B: 3, C: 3, D: 2, E: 1,
    F: 4, G: 2, H: 4, I: 1, J: 8,
    K: 5, L: 1, M: 3, N: 1, O: 1,
    P: 3, Q: 10, R: 1, S: 1, T: 1,
    U: 1, V: 4, W: 4, X: 8, Y: 4,
    Z: 10
  };

  const featureSquares = {
    0: { type: 'tripleWordScore', multiplier: 3 },   // 🔴 Top-left corner
    4: { type: 'tripleWordScore', multiplier: 3 },   // 🔴 Top-right corner
    20: { type: 'tripleWordScore', multiplier: 3 },  // 🔴 Bottom-left corner
    24: { type: 'tripleWordScore', multiplier: 3 },  // 🔴 Bottom-right corner

    2: { type: 'doubleWordScore', multiplier: 2 },   // 🟠 Center-top
    10: { type: 'doubleWordScore', multiplier: 2 },  // 🟠 Center-right
    14: { type: 'doubleWordScore', multiplier: 2 },  // 🟠 Center-left
    22: { type: 'doubleWordScore', multiplier: 2 },  // 🟠 Center-bottom

    6: { type: 'tripleLetterScore', multiplier: 3 },  // 🟣 Upper-middle-left
    8: { type: 'tripleLetterScore', multiplier: 3 },  // 🟣 Upper-middle-right
    16: { type: 'tripleLetterScore', multiplier: 3 }, // 🟣 Lower-middle-left
    18: { type: 'tripleLetterScore', multiplier: 3 }, // 🟣 Lower-middle-right

    12: { type: 'doubleLetterScore', multiplier: 2 }, // 🔵 Middle center
};

  

  const [board, setBoard] = useState()

  useEffect(() => {
    const fetchGameData = async () => {
      const today = new Date().toLocaleDateString();
      const localData = JSON.parse(localStorage.getItem('gameState'));
  
      if (localData && localData.date === today) {
        console.log("Using saved local data! 🍈🍈 The girls approve. 😏");
        setTilesInPool(localData.tilesInPool);
        setBoard(localData.board);
        return;
      }
  
      try {
        console.log("Fetching new game data... The girls are ready for fresh content. 🍈🍈");
        const response = await axios.get('http://localhost:3000/scrabble-setup'); // Ensure this is the correct API endpoint
        const { letterPool, starterWordObj, validWords } = response.data;
  
        console.log("Fetched Data:", response.data);
  
        setTilesInPool(letterPool);
        setValidWords(validWords);
  
        const initialBoardState = Array(gridWidth * gridWidth).fill(null).map((_, index) => ({
          tile: starterWordObj.find(t => t.position === index) || null,
          feature: featureSquares[index] || null,
          isValid: false
        }));
  
        setBoard(initialBoardState);
  
        // Save to local storage for continuity
        localStorage.setItem('gameState', JSON.stringify({
          date: today,
          tilesInPool: letterPool,
          board: initialBoardState
        }));
  
      } catch (error) {
        console.error("Error fetching game data:", error);
      }
    };
  
    fetchGameData();
  
    // **Auto-Refresh Game at Midnight**
    const checkForNewDay = setInterval(() => {
      const currentDate = new Date().toLocaleDateString();
      const storedDate = JSON.parse(localStorage.getItem('gameState'))?.date;
  
      if (currentDate !== storedDate) {
        console.log("🔥 Midnight reached! Refreshing game data. The girls demand new content. 🍈🍈");
        localStorage.removeItem('gameState'); // Clear old data
        fetchGameData(); // Fetch new data from backend
      }
    }, 60000); // Check every minute
  
    return () => clearInterval(checkForNewDay); // Cleanup interval on unmount
  }, []);
  
  const handleNG = async () => {
    console.log("Skipping to the next puzzle...");
    localStorage.removeItem('gameState'); // Clear current puzzle
    try {
      const response = await axios.get('http://localhost:3000/scrabble-setup');
      const { letterPool, starterWordObj, validWords } = response.data;
  
      console.log("New Puzzle Data:", response.data);
  
      setTilesInPool(letterPool);
      setValidWords(validWords);
  
      const initialBoardState = Array(gridWidth * gridWidth).fill(null).map((_, index) => ({
        tile: starterWordObj.find(t => t.position === index) || null,
        feature: featureSquares[index] || null,
        isValid: false
      }));
  
      setBoard(initialBoardState);
  
      localStorage.setItem('gameState', JSON.stringify({
        date: new Date().toLocaleDateString(),
        tilesInPool: letterPool,
        board: initialBoardState
      }));
  
    } catch (error) {
      console.error("Error fetching new puzzle:", error);
    }
  };
  
  


  useEffect(() => {
    const saveGameState = () => {
      const localData = JSON.parse(localStorage.getItem('gameState'));
      if (localData) {
        const updatedGameState = {
          ...localData, // spread existing data to keep other properties like date
          board: board, // update board
          tilesInPool: tilesInPool // update tiles in pool
        };
        localStorage.setItem('gameState', JSON.stringify(updatedGameState));
        console.log("Game state saved:", updatedGameState);
      }
    };
    if (board && tilesInPool) {
      console.log("Saving game state");
      saveGameState();
    }
  });
  
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

  const clearGameState = () => {
    localStorage.removeItem('gameState'); // Clear the game state from local storage
    localStorage.removeItem('gameStats'); 
    
    // Reset the board and pool to initial configuration
    const initialBoardState = Array(gridWidth * gridWidth).fill(null).map((_, index) => ({
      tile: prePlacedTiles.find(t => t.position === index) || null,
      feature: featureSquares[index] || null,
      isValid: false
    }));
  
    setBoard(initialBoardState);
    setTilesInPool(letterPool);
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

      calculateScore(board, extractWordsAgain(board, gridWidth), letterScores, setModalContent, setShowModal);
    }
    
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleNextGame = () => {
    // clear board
    localStorage.removeItem('gameState'); // Clear the game state from local storage
    localStorage.removeItem('gameStats'); 
    
    if(counter > 0) {
      gridWidth = 5;
    }

    // Reset the board and pool to initial configuration
    const initialBoardState = Array(gridWidth * gridWidth).fill(null).map((_, index) => ({
      tile: prePlacedTilesArray[counter].find(t => t.position === index) || null,
      feature: featureSquaresArray[counter][index] || null,
      isValid: false
    }));

    setBoard(initialBoardState);
    setTilesInPool(letterPoolArray[counter]);
    setCounter(counter + 1);
    // fetch new board data
  }

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
      <button onClick={handleNG} style={{
            backgroundColor: '#4CAF50', // Green color for clarity
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            fontSize: '14px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>Skip to Next Puzzle (Debug)</button>
     
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

export default Board;