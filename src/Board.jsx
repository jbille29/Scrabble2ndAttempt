import React, { useState, useEffect } from 'react';
import Square from './Square';
import { extractWords, calculateScore, isConnected, extractWordsAgain } from './utils/gameUtils';
import { FaArrowRotateRight } from "react-icons/fa6";
import LetterPool from './components/LetterPool';
import axios from 'axios';

const Board = () => {
  const gridWidth = 6; // Set grid width for 8x8 grid
  const [tileSize, setTileSize] = useState('50px');
  const [tilesInPool, setTilesInPool] = useState([]);
  
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [validWords, setValidWords] = useState([]);

  const letterScores = {
    A: 1, B: 3, C: 3, D: 2, E: 1,
    F: 4, G: 2, H: 4, I: 1, J: 8,
    K: 5, L: 1, M: 3, N: 1, O: 1,
    P: 3, Q: 10, R: 1, S: 1, T: 1,
    U: 1, V: 4, W: 4, X: 8, Y: 4,
    Z: 10
  };

  // FAKE API DATA
  const prePlacedTiles = [
    { id: 1, letter: 'R', position: 10, isPrePlaced: true },
    { id: 2, letter: 'B', position: 20, isPrePlaced: true },
    { id: 3, letter: 'C', position: 30, isPrePlaced: true },
  ];
  const letterPool = [
    { id: 6, letter: 'D', isPrePlaced: false },
    { id: 7, letter: 'E', isPrePlaced: false },
    { id: 8, letter: 'F', isPrePlaced: false },
    { id: 9, letter: 'G', isPrePlaced: false },
    { id: 10, letter: 'H', isPrePlaced: false },
    { id: 11, letter: 'I', isPrePlaced: false },
    { id: 12, letter: 'J', isPrePlaced: false },
     { id: 13, letter: 'H', isPrePlaced: false },
    { id: 14, letter: 'I', isPrePlaced: false },
    { id: 15, letter: 'J', isPrePlaced: false },
  ];
  const featureSquares = {
    3: { type: 'tripleWordScore', multiplier: 3 },
    20: { type: 'doubleLetterScore', multiplier: 2 },
    7: { type: 'doubleWordScore', multiplier: 2 },
  };

  const setupBoard = () => {
    const initialBoardState = Array(gridWidth * gridWidth).fill(null).map((_, index) => ({
      tile: prePlacedTiles.find(t => t.position === index) || null,
      feature: featureSquares[index] || null,
      isValid: false
    }));
    console.log("Set up board!");
    return initialBoardState;
  }
  

  const [board, setBoard] = useState(setupBoard());

  // INITIALIZE BOARD
  useEffect(() => {

      const fetchData = async () => {
        const today = new Date().toLocaleDateString();
        const localData = JSON.parse(localStorage.getItem('gameState'));
    
        // Check if local data exists and is from today
        if (localData && localData.date === today) {
          console.log("Using local data");
          setTilesInPool(localData.tilesInPool);
          setBoard(localData.board);
          console.log("Local data:", localData);
        } else {
          console.log("Fetching new game data");
        // Fetch new data (uncomment the appropriate line when using the API)
        // const response = await axios.get('http://localhost:3000/next-game');
        // const { prePlacedTiles, letterPool, featureSquares, validWords } = response.data;

        // Dummy data simulation
        const prePlacedTiles = [
          { id: 1, letter: 'R', position: 10, isPrePlaced: true },
          { id: 2, letter: 'B', position: 20, isPrePlaced: true },
          { id: 3, letter: 'C', position: 30, isPrePlaced: true },
        ];
        const letterPool = [
          { id: 6, letter: 'D', isPrePlaced: false },
          { id: 7, letter: 'E', isPrePlaced: false },
          { id: 8, letter: 'F', isPrePlaced: false },
          // add more if needed
        ];
        const featureSquares = {
          3: { type: 'tripleWordScore', multiplier: 3 },
          20: { type: 'doubleLetterScore', multiplier: 2 },
          // add more if needed
        };

        const validWords = ['HIIR', 'FI', 'FIIG', 'BG', 'DGE','IHB','CDJJ', 'DEIR', 'BEG', 'FE', 'IDER', 'IR', 'RED','BED', 'BIG', 'APPLE', 'ORANGE', 'GRAPE', 'BANANA', 'CHERRY', 'DATE', 'FIG'];

        const initialBoardState = Array(gridWidth*gridWidth).fill(null).map((_, index) => ({
          tile: prePlacedTiles.find(t => t.position === index) || null,
          feature: featureSquares[index] || null,
          isValid: false // New state to track if the tile placement is valid
        }));
        // Update states with fetched data
        console.log("Initial board state set:", initialBoardState);
        setBoard(initialBoardState)
        setTilesInPool(letterPool);
        setValidWords(validWords);
        // Save to local storage
        localStorage.setItem('gameState', JSON.stringify({
          date: today,
          tilesInPool: letterPool,
          board: initialBoardState
        }));
      }
    };
    console.log("use effect called, Fetching data...");
    fetchData();
  }, []);



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
  

  const clearGameState = () => {
    localStorage.removeItem('gameState'); // Clear the game state from local storage
    console.log("Local storage cleared and game reset to initial state");
  
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
        {board.map((square, index) => (
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
          <div style={{width: '43px'}}></div>
      </div>
     
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