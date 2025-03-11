import React, { useState, useEffect } from 'react';
import LetterPool from './components/LetterPool';
import GameStateManager from './components/GameStateManager';
import ScoreBreakdownModal from './components/dev/ScoreBreakdownModal';
import Square from './Square';
import { extractWords, calculateScore, isConnected, extractWordsAgain } from './utils/gameUtils';
import letterScores from './utils/letterScores';
import ToastNotification from "./components/ToastNotification"; // Import Toast

const GameBoard = () => {
  let gridWidth = 5; // Set grid width for 8x8 grid
  const [tileSize, setTileSize] = useState('50px');
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [toastMessage, setToastMessage] = useState(""); // Toast state
  const [scoreBreakdown, setScoreBreakdown] = useState([]);
  const [showScoreModal, setShowScoreModal] = useState(false); // Controls the score breakdown modal
  

  const {
    board, setBoard,
    tilesInPool, setTilesInPool,
    validWords, 
    gameOver, setGameOver,
    attempts, setAttempts,
    incorrectWords, setIncorrectWords,
    starterWord, totalScore, setTotalScore
  } = GameStateManager(gridWidth);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(""); // Clear toast after delay
    }, 2500);
  };

  useEffect(() => {
    // Check local storage for game statistics
    const gameStats = localStorage.getItem('gameStats');
    if (!gameStats) {
      // If no gameStats are found, it's the user's first visit
      //setShowTutorial(true);
      localStorage.setItem('gameStats', JSON.stringify({ visited: true }));
    }
    // Your existing useEffect logic here
  }, []);
  
  
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


  const handleCalculateScore = () => {
    if (gameOver || validWords.size === 0) return; // Prevent scoring if game is over or no valid words

    const words = extractWords(board, gridWidth);
  
    // 🚀 Find first truly new incorrect word
    const newIncorrectWord = words.find(word => 
      !validWords.has(word.toLowerCase()) && !incorrectWords.includes(word.toUpperCase())
    );
    // Find first already guessed incorrect word
    const repeatIncorrectWord = words.find(word => incorrectWords.includes(word.toUpperCase()));
    
    // 🚀 Check if all tiles are connected to an anchor tile
    if (!isConnected(board, gridWidth)) {
      showToast("Please ensure all tiles are connected to an anchor tile.");
      return;
    }

    // 🚀 Handle new incorrect word (store & deduct attempt)
    if (newIncorrectWord) {
      setIncorrectWords(prev => [...prev, newIncorrectWord.toUpperCase()]);
      setAttempts(prevAttempts => Math.max(prevAttempts - 1, 0));
      showToast(`"${newIncorrectWord}" is not valid. Try again.`);

      setTimeout(() => {
        if (attempts - 1 <= 0) {
          showToast("Game Over! No more attempts left.");
        }
      }, 0);
      return;
    }
     
    // 🚀 Handle repeat incorrect word (without deducting attempts)
    if (repeatIncorrectWord) {
      showToast(`"${repeatIncorrectWord}" has already been guessed and is incorrect. Try something else.`);
      return;
    }

    console.log("🔠 Words:", words);
    // If all words are correct
    if ((words.every(word => validWords.has(word.toLowerCase())))) {
        const { totalScore, scoreBreakdown } = calculateScore(board, extractWordsAgain(board, gridWidth), letterScores);
        setTotalScore(totalScore);
        setScoreBreakdown(scoreBreakdown);
        setShowScoreModal(true);
        setGameOver(true);
    }
  }

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
      {toastMessage && <ToastNotification message={toastMessage} onClose={() => setToastMessage("")} />}
      {/* 🔹 Instructions at the top */}
      {starterWord && (
        <div style={{
          marginBottom: "10px",
          fontSize: "18px",
          textAlign: "center"
        }}>
          {!gameOver ? (
            <span>
              Build words off of <span style={{ fontFamily:"Lexend Deca", color: "#4A90E2" }}>{starterWord}</span>
            </span>
          ) : (
            <span>
              Your score: <span style={{ color: "#4A90E2" }}>{totalScore}</span>
            </span>
          )}
        </div>
      )}
      
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
          <Square 
            key={index} 
            id={index} 
            onDrop={moveTileToBoard} 
            returnTile={returnTileToArea} 
            tile={square.tile} 
            feature={square.feature} 
            letterScores={letterScores} 
            tileSize={tileSize}
            gameOver={gameOver}/>
        ))}
      </div>
      
      <LetterPool 
        tilesInPool={tilesInPool}
        tileSize={tileSize} 
        letterScores={letterScores} 
        returnTileToPool={returnTileToPool} 
        gameOver={gameOver}
      />
      <div
        className='button-container'
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <button onClick={handleCalculateScore}>
            Submit
          </button>      
          
            
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span>Attempts:</span>
            {Array.from({ length: attempts }).map((_, index) => (
                <span
                    key={index}
                    style={{
                        width: "12px",
                        height: "12px",
                        backgroundColor: attempts > 0 ? "#4A90E2" : "#D32F2F",
                        borderRadius: "50%", // Makes it a circle
                        display: "inline-block",
                    }}
                ></span>
            ))}
        </div>
      </div>
     
      {/*********  MODALS ***************/}
      {showScoreModal && (
        <ScoreBreakdownModal
          scoreBreakdown={scoreBreakdown}
          onClose={() => setShowScoreModal(false)}
        />
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