// Board.jsx - Main Component
import React, { useState } from 'react';
import useGameState from './GameStateManager';
import GameBoard from './GameGrid';
import TilePool from './TilePool';
import GameControls from './GameControls';
import GameModals from './GameModals';

const Board = () => {
    const gridWidth = 5;
    const tileSize = '50px';
    const { board, setBoard, tilesInPool, setTilesInPool, validWords } = useGameState(gridWidth, {});
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [showTutorial, setShowTutorial] = useState(false);
    
    const handleCalculateScore = () => {
        console.log("Calculating score...");
    };
    
    const clearGameState = () => {
        localStorage.removeItem('gameState');
        setBoard([]);
        setTilesInPool([]);
    };
    
    const handleNextGame = () => {
        console.log("Fetching next game...");
    };
    
    const handleSkipPuzzle = () => {
        console.log("Skipping puzzle...");
    };
    
    return (
        <div>
            <GameBoard board={board} onDrop={() => {}} returnTile={() => {}} tileSize={tileSize} letterScores={{}} />
            <TilePool tilesInPool={tilesInPool} tileSize={tileSize} letterScores={{}} returnTileToPool={() => {}} />
            <GameControls handleCalculateScore={handleCalculateScore} clearGameState={clearGameState} handleNextGame={handleNextGame} handleSkipPuzzle={handleSkipPuzzle} />
            <GameModals showModal={showModal} modalContent={modalContent} handleCloseModal={() => setShowModal(false)} showTutorial={showTutorial} handleTutorialClose={() => setShowTutorial(false)} />
        </div>
    );
};

export default Board;
