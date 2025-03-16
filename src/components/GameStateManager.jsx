import { useState, useEffect } from 'react';
import axios from 'axios';
import featureSquares from '../utils/featureSquares';

// Function to load and cache word list in localStorage
const loadWordList = async () => {
    if (localStorage.getItem('wordList')) {
        console.log('✅ Loaded words from localStorage');
        return new Set(JSON.parse(localStorage.getItem('wordList')));
    }

    try {
        console.log('📥 Fetching words from backend...');
        const response = await axios.get('http://localhost:3000/api/words'); // Corrected URL

        // API returns an array, no need for destructuring
        const words = response.data;  

        // Save to localStorage
        localStorage.setItem('wordList', JSON.stringify(words));
        console.log('✅ Saved words to localStorage');

        return new Set(words); // Use Set for fast lookups
    } catch (error) {
        console.error('❌ Error loading word list:', error);
        return new Set(); // Return empty Set if something goes wrong
    }
};

const GameStateManager = (gridWidth) => {
    const [board, setBoard] = useState([]);
    const [tilesInPool, setTilesInPool] = useState([]);
    const [validWords, setValidWords] = useState(new Set());
    const [gameOver, setGameOver] = useState(false);
    const [attempts, setAttempts] = useState(2);
    const [incorrectWords, setIncorrectWords] = useState([]);
    const [starterWord, setStarterWord] = useState(""); 
    const [starterWordObj, setStaterWordObj] = useState([]);
    const [totalScore, setTotalScore] = useState(0); 
    const [isLoading, setIsLoading] = useState(true);
    const [maxScore, setMaxScore] = useState(0);
    
    // Fetches game data when component mounts
    // Checks every minute to see if new day has started
    // If date has changed, it clears stored game data and fetches a new puzzle
    useEffect(() => {
        const initializeGame = async () => {
            setIsLoading(true);
            // Load valid words first
            const wordsSet = await loadWordList();
            setValidWords(wordsSet);
    
            // Fetch game data after loading words
            await fetchGameData();
            setIsLoading(false);
        };
    
        initializeGame();
    }, []);
    useEffect(() => {
        // ✅ Function to check if a new day has started
        const checkForNewDay = setInterval(async () => {
            const now = new Date();
            const formattedCurrentDate = now.toISOString().split("T")[0]; // Ensure consistent format
    
            // ✅ Retrieve stored game data
            const storedGameState = JSON.parse(localStorage.getItem('gameState'));
            const storedDate = storedGameState?.date;
    
            console.log("📅 Checking for new day:", formattedCurrentDate, storedDate);
    
            // ✅ Only reset if the stored date is different from today's date
            if (storedDate && storedDate !== formattedCurrentDate) {
                console.log("🔥 New day detected! Checking for new puzzle before resetting...");
    
                try {
                    //const response = await axios.get(`http://localhost:3000/scrabble-setup?date=${encodeURIComponent(formattedCurrentDate)}`);
                    const response = await axios.get(`https://scrabbleapi.onrender.com/scrabble-setup?date=${encodeURIComponent(formattedCurrentDate)}`);
                    if (response.data) {
                        console.log("✅ New puzzle available. Refreshing game data.");
                        localStorage.removeItem('gameState');
                        fetchGameData();
                    } else {
                        console.log("❌ No new puzzle found. Keeping existing game state.");
                    }
                } catch (error) {
                    console.error("❌ Error checking for new puzzle:", error);
                }
            }
        }, 10000)// Runs every 60 seconds
    
        return () => clearInterval(checkForNewDay);
    }, []);
    
    

    const fetchGameData = async () => {
        setIsLoading(true);
        // Get local date in YYYY-MM-DD format
        const clientDate = new Date();
        const localDateString = clientDate.toISOString().split("T")[0]; // Standardized format
    
        console.time("⏳ API Response Time");
    
        // Retrieve game state from localStorage
        const localData = JSON.parse(localStorage.getItem('gameState'));
    
        // ✅ Ensure we compare the stored date in the same format
        if (localData) {
            const storedDate = new Date(localData.date).toISOString().split("T")[0]; // Ensure same format
    
            if (storedDate === localDateString) {
                console.log("✅ Using saved local data.");
                setTilesInPool(localData.tilesInPool);
                setBoard(localData.board);
                setStarterWord(localData.starterWord);
                setStaterWordObj(localData.starterWordObj);
                setGameOver(localData.gameOver);
                setTotalScore(localData.totalScore);
                setAttempts(localData.attempts);
                setIncorrectWords(localData.incorrectWords);
                setIsLoading(false);
                setMaxScore(localData.maxScore);
                return;
            }
        }
    
        try {        
            const response = await axios.get(`https://scrabbleapi.onrender.com/scrabble-setup?date=${encodeURIComponent(localDateString)}`);
            //const response = await axios.get(`http://localhost:3000/scrabble-setup?date=${encodeURIComponent(localDateString)}`);
            console.timeEnd("⏳ API Response Time");
            const { letterPool, starterWordObj, maxScore } = response.data;
    
            // Set state with new puzzle data
            setTilesInPool(letterPool);
            setMaxScore(maxScore);

            // Extract starter word (concatenating letters from `starterWordObj`)
            const starterWord = starterWordObj.map(t => t.letter).join("");
            setStarterWord(starterWord);
            setStaterWordObj(starterWordObj);
            console.log("🔠 Starter word:", starterWordObj);
    
           // ✅ Initialize board while **removing features from preplaced tiles**
           const initialBoardState = Array(gridWidth * gridWidth).fill(null).map((_, index) => {
                const preplacedTile = starterWordObj.find(t => t.position === index);
                return {
                    tile: preplacedTile || null,
                    feature: preplacedTile ? null : featureSquares[index] || null,  // ✅ Remove feature if tile is preplaced
                    isValid: false
                };
            });
    
            setBoard(initialBoardState);
    
            // Store puzzle in localStorage for persistence
            localStorage.setItem('gameState', JSON.stringify({
                date: localDateString,  // Store in correct local format
                tilesInPool: letterPool,
                board: initialBoardState,
                starterWord,
                starterWordObj,
                gameOver,
                totalScore,
                attempts,
                incorrectWords,
                maxScore
            }));
    
        } catch (error) {
            console.error("❌ Error fetching game data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateStats = (date, score, maxScore, lettersLeft) => {
        // ✅ Ensure `stats` has a valid structure
        let stats = JSON.parse(localStorage.getItem('gameStats')) || {}; 
    
        // ✅ Ensure `history` array exists
        if (!stats.history) {
            stats = {
                gamesPlayed: 0,
                history: []
            };
        }
    
        // ✅ Check if the game for this date already exists in history
        const existingGameIndex = stats.history.findIndex(entry => entry.date === date);
    
        if (existingGameIndex !== -1) {
            // ✅ Update existing entry for the same date
            stats.history[existingGameIndex] = { date, score, maxScore, lettersLeft };
        } else {
            // ✅ Add new entry
            stats.history.push({ date, score, maxScore, lettersLeft });
            stats.gamesPlayed += 1;
        }
    
        // ✅ Save updated stats
        localStorage.setItem('gameStats', JSON.stringify(stats));
        console.log("📊 Updated stats:", stats);
    };
    
    

    // Save game state to localStorage only when necessary
    useEffect(() => {
        if (board.length > 0 && tilesInPool.length >= 0) {
            
            saveGameState();
            console.log("🔥 Game state saved to localStorage.");
        }
    }, [board, tilesInPool, attempts, incorrectWords, gameOver, totalScore]);

    const saveGameState = () => {
        const clientDate = new Date().toISOString().split("T")[0];

        // ✅ Ensure preplaced tiles have no features when saving
        const cleanedBoard = board.map(square => ({
            ...square,
            feature: square.tile?.isPrePlaced ? null : square.feature
        }));

        localStorage.setItem('gameState', JSON.stringify({
            date: clientDate,
            tilesInPool,
            board: cleanedBoard,
            starterWord,
            gameOver,
            totalScore,
            attempts,
            incorrectWords
        }));
        console.log("💾 Game state saved.");
        updateStats(clientDate, totalScore, maxScore, tilesInPool.length);
    };    

    return {
        board, setBoard,
        tilesInPool, setTilesInPool,
        validWords,
        gameOver, setGameOver,
        attempts, setAttempts,
        incorrectWords, setIncorrectWords,
        starterWord, starterWordObj,
        totalScore, setTotalScore,
        isLoading, maxScore
    };
};

export default GameStateManager;
