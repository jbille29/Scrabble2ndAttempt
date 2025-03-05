// GameBoard.jsx - Renders the scrabble board
import Square from './Square';

const GameGrid = ({ board, onDrop, returnTile, tileSize, letterScores }) => {
    return (
        <div className="board-container" style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.sqrt(board.length)}, ${tileSize})`,
            gap: '5px',
            padding: '10px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            boxSizing: "border-box",
        }}>
            {board.map((square, index) => (
                <Square key={index} id={index} onDrop={onDrop} returnTile={returnTile} tile={square.tile} feature={square.feature} letterScores={letterScores} tileSize={tileSize} />
            ))}
        </div>
    );
};

export default GameGrid;