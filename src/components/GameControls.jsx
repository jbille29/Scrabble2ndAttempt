// GameControls.jsx - Handles game control buttons
const GameControls = ({ handleCalculateScore, clearGameState, handleNextGame, handleSkipPuzzle }) => {
    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={handleCalculateScore}>Submit</button>
            <button onClick={clearGameState} style={{ backgroundColor: '#f44336', color: 'white', border: 'none', padding: '8px 16px', fontSize: '14px', borderRadius: '4px', cursor: 'pointer' }}>Reset Game</button>
            <button onClick={handleNextGame}>Next Game</button>
            <button onClick={handleSkipPuzzle} style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '8px 16px', fontSize: '14px', borderRadius: '4px', cursor: 'pointer' }}>Skip to Next Puzzle</button>
        </div>
    );
};

export default GameControls;