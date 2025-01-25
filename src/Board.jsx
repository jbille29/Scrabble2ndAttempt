import React, { useState, useEffect } from 'react';
import Square from './Square';
import Tile from './Tile';
import { extractWords, calculateScore, isConnected } from './utils/gameUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo } from '@fortawesome/free-solid-svg-icons';

const Board = () => {
  const gridWidth = 8; // Set grid width for 8x8 grid
  const [tileSize, setTileSize] = useState('50px');

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
    3: { type: 'doubleScore', multiplier: 2 },
    7: { type: 'subtractPoints', multiplier: -1 },
    20: { type: 'tripleScore', multiplier: 3 }
  };

  // Initialize the board with nulls and include features and pre-placed tiles
  const initialBoardState = Array(gridWidth*gridWidth).fill(null).map((_, index) => ({
    tile: prePlacedTiles.find(t => t.position === index) || null,
    feature: featureSquares[index] || null
  }));

  const [tilesInPool, setTilesInPool] = useState(letterPool);
  const [board, setBoard] = useState(initialBoardState);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");

  useEffect(() => {
    const updateTileSize = () => {
      const size = Math.min(window.innerWidth / (gridWidth + 2), 60); // Example responsive calculation
      setTileSize(`${size}px`);
    };
    window.addEventListener('resize', updateTileSize);
    updateTileSize(); // Initial call to set size based on current viewport
    return () => window.removeEventListener('resize', updateTileSize);
  }, []);

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

  const resetBoard = () => {
    setBoard(Array(gridWidth * gridWidth).fill(null).map((_, index) => ({
      tile: prePlacedTiles.find(t => t.position === index) || null,
    })));
    setTilesInPool([...letterPool]); // Reset tiles in pool to initial state
  };

  const handleCalculateScore = () => {
    const words = extractWords(board, gridWidth);
    if (isConnected(board, gridWidth)) {
      calculateScore(words, letterScores, setModalContent, setShowModal);
    } else {
      setModalContent("Tiles are not properly connected.");
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <div style={{ 
          display: 'grid',
          gridTemplateColumns: `repeat(${gridWidth}, ${tileSize})`,
          gap: '5px',
          backgroundColor: '#ffffff', // Bright, clean background for the grid
          padding: '10px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)' // Subtle shadow for depth
        }}>
        {board.map((square, index) => (
          <Square key={index} id={index} onDrop={moveTileToBoard} returnTile={returnTileToArea} tile={square.tile} feature={square.feature} letterScores={letterScores} tileSize={tileSize}/>
        ))}
      </div>
      
      {/** Display the tiles in the pool */}
      <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          flexWrap: 'wrap', 
          marginBottom: '20px',
          minHeight: '60px' // Ensure there's a minimum height even if empty
      }}>
          {tilesInPool.map(tile => (
              <div style={{
                  width: tileSize,
                  height: tileSize,
                  marginRight: '5px', 
                  marginTop: '25px',
                  display: 'flex',
                  justifyContent: 'center', // Center the tile horizontally
                  alignItems: 'center' // Center the tile vertically
              }} key={tile.id}>
                  {tile && (
                      <Tile 
                          letter={tile.letter} 
                          id={tile.id} 
                          isDraggable={!tile.isPrePlaced} 
                          letterScores={letterScores} 
                          tileSize={tileSize} 
                          featureBackground={null}
                      />
                  )}
              </div>
          ))}
          {Array(12 - tilesInPool.length).fill(null).map((_, index) => (
              // Render invisible placeholders to maintain the layout
              <div style={{
                  width: tileSize,
                  height: tileSize,
                  marginRight: '5px',
                  marginTop: '25px',
                  visibility: 'hidden' // Make placeholders invisible
              }} key={`placeholder-${index}`}>
                  <Tile 
                      letter="" 
                      
                      isDraggable={false}
                      tileSize={tileSize}
                      featureBackground={null}
                  />
              </div>
          ))}
      </div>


      <button 
        onClick={handleCalculateScore} 
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
        <div style={{ marginBottom: '20px' }}>
        <FontAwesomeIcon icon={faRedo} onClick={resetBoard} style={{ cursor: 'pointer', color: '#333', fontSize: '24px' }} />
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