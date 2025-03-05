// TilePool.jsx - Renders the letter tiles
import LetterPool from './LetterPool';

const TilePool = ({ tilesInPool, tileSize, letterScores, returnTileToPool }) => {
    return (
        <LetterPool tilesInPool={tilesInPool} tileSize={tileSize} letterScores={letterScores} returnTileToPool={returnTileToPool} />
    );
};

export default TilePool;