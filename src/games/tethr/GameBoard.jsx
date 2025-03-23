import React, { useState, useEffect } from 'react';
import { FaRandom, FaUndo } from 'react-icons/fa';

import LetterPool from './components/LetterPool';
import GameStateManager from './components/GameStateManager';
import ScoreBreakdownModal from './components/modals/ScoreBreakdownModal';
import Square from './components/Square'
import ToastNotification from "./components/ToastNotification"; // Import Toast

import { extractWords, calculateScore, isConnected, extractWordsAgain } from './utils/gameUtils';
import letterScores from './utils/letterScores';
import './GameBoard.css';

const GameBoard = () => {
  let gridWidth = 5; // Set grid width for 8x8 grid
  const [tileSize, setTileSize] = useState('50px');
  const [showModal, setShowModal] = useState(false);
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
    starterWord, starterWordObj,
    totalScore, setTotalScore,
    isLoading
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
    if (gameOver || validWords.size === 0 || tilesInPool.length === 10) return; // Prevent scoring if game is over or no valid words

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
      showToast(`"${newIncorrectWord}" is not valid. ${attempts-1} remaining.`);

      setTimeout(() => {
        if (attempts - 1 <= 0) {
            // 🚀 Only calculate the score from **valid words**
            const validWordsList = words.filter(word => validWords.has(word.toLowerCase()));
            
            // **If there are no valid words, set the score to 0**
            let finalScore = 0;
            let scoreBreakdown = [];

            if (validWordsList.length > 0) {
                const scoreData = calculateScore(board, extractWordsAgain(board, gridWidth, starterWordObj)
                    .filter(word => validWords.has(word.word.toLowerCase())), letterScores);
                finalScore = scoreData.totalScore;
                scoreBreakdown = scoreData.scoreBreakdown;
            }

            setTotalScore(finalScore);
            setScoreBreakdown(scoreBreakdown);
            setGameOver(true);
            setShowScoreModal(true);
        }
    }, 0);
    return;
}
     
    // 🚀 Handle repeat incorrect word (without deducting attempts)
    if (repeatIncorrectWord) {
      showToast(`"${repeatIncorrectWord}" has already been guessed and is incorrect. Try something else.`);
      return;
    }
    // If all words are correct
    if ((words.every(word => validWords.has(word.toLowerCase())))) {
      const { totalScore, scoreBreakdown } = calculateScore(
        board,
        extractWordsAgain(board, gridWidth, starterWordObj)
          .filter(word => validWords.has(word.word.toLowerCase())), // ✅ Ensures only valid words are counted
        letterScores
      );
      setTotalScore(totalScore);
      setScoreBreakdown(scoreBreakdown);
      setShowScoreModal(true);
      setGameOver(true);
  }  

}  // ✅ Properly closes handleCalculateScore before starting DND functions

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

  // 🔄 Function to Shuffle Letter Pool
  const shuffleTiles = () => {
    setTilesInPool([...tilesInPool].sort(() => Math.random() - 0.5)); // Shuffle array
  };

  // 🏠 Function to Recall All Tiles Back to Pool
  const recallTiles = () => {
    const recalledTiles = board
      .filter(square => square.tile && !square.tile.isPrePlaced) // Get placed but non-starter tiles
      .map(square => square.tile);
    
    const newBoard = board.map(square => ({
      ...square,
      tile: square.tile?.isPrePlaced ? square.tile : null, // Keep starter word tiles
    }));

    setBoard(newBoard);
    setTilesInPool([...tilesInPool, ...recalledTiles]);
  };

  // STYLE VARIABLES
  const paddingTotal = 10 * 2; // 10px padding on each side
  const gapTotal = (gridWidth - 1) * 5; // Total gap based on number of gaps
  const totalWidth = parseInt(tileSize) * gridWidth + gapTotal + paddingTotal;

  if (isLoading) {
    return (
        <div className="spinner-container">
            <div className="spinner"></div>
            <p>Loading Puzzle...</p>
        </div>
    );
  }
  
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
          textAlign: "center",
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
          background: 'var(--board-background)',
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
        {/* 🔹 Buttons Container for UX */}
        <div className="button-container" style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginTop: "10px",
       
      }}>

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
        

        {/* 🏠 Recall Tiles Button */}
        
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
          alignItems: 'center',
        }}>
          {!gameOver ? (
          <button 
            onClick={handleCalculateScore}
            disabled={validWords.size === 0 || tilesInPool.length === 10}
            style={{
              backgroundColor: (validWords.size === 0 || tilesInPool.length === 10) ? '#A9A9A9' : '#4A90E2', // Gray if inactive, blue if active
              color: 'white',
              cursor: (validWords.size === 0 || tilesInPool.length === 10) ? 'not-allowed' : 'pointer',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
            }}
            >
            Submit
          </button>      
          ) : (
            <button 
              onClick={()=>setShowScoreModal(true)}
              style={{
                backgroundColor: '#4A90E2',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
              }}
              >
            Results
          </button> 
          )}
          
          <div 
            style={{
              display: 'flex',
            }}>
          <FaUndo 
            onClick={!gameOver ? recallTiles : undefined} // Disable click when gameOver is true
            style={{
              color: gameOver ? "gray" : "black",
              padding: '8px 16px',
              borderRadius: '5px',
              border: 'none',
              cursor: (gameOver || tilesInPool.length === 10) ? 'not-allowed' : 'pointer',
              marginRight: '10px',
              pointerEvents: gameOver ? 'none' : 'auto' // Prevents click events when disabled
            }} size={18} />
       

       {/* 🔄 Shuffle Button */}
      
        <FaRandom 
          onClick={!gameOver ? shuffleTiles : undefined}
          disabled={gameOver}
          style={{
            color: gameOver ? "gray" : "black",
            padding: '8px 16px',
            borderRadius: '5px',
            border: 'none',
            cursor: gameOver ? 'not-allowed' : 'pointer',
            pointerEvents: gameOver ? 'none' : 'auto' // Prevents click events when disabled
          }}
          size={18} />
          </div>
      </div>
     
      {/*********  MODALS ***************/}
      {showScoreModal && (
        <ScoreBreakdownModal
          scoreBreakdown={scoreBreakdown}
          lettersLeft={tilesInPool.length}
          onClose={() => setShowScoreModal(false)}
        />
      )}      
    </div>
  );
};

export default GameBoard;