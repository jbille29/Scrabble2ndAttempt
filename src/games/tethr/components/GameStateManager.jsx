import { useState, useEffect } from 'react';
import axios from 'axios';
import featureSquares from '../utils/featureSquares';

const GAME_KEY = "tethr"; // This will be the key inside localStorage.games

// Function to load and cache word list in Local Storage
const loadWordList = async () => {
    const storedGames = JSON.parse(localStorage.getItem("games")) || {};
    
    if (storedGames.wordList) {
        console.log("✅ Loaded words from Local Storage");
        return new Set(storedGames.wordList);
    }

    try {
        console.log("📥 Fetching words from backend...");
        const response = await axios.get('http://localhost:3000/api/letterpool/words');
        const words = response.data;

        // Save under `games.wordList`
        storedGames.wordList = words;
        localStorage.setItem("games", JSON.stringify(storedGames));
        console.log("✅ Saved words to Local Storage");

        return new Set(words);
    } catch (error) {
        console.error("❌ Error loading word list:", error);
        return new Set();
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
    const [scoreBreakdown, setScoreBreakdown] = useState([]);


    useEffect(() => {
        const initializeGame = async () => {
            setIsLoading(true);
            const wordsSet = await loadWordList();
            setValidWords(wordsSet);
            await fetchGameData();
            setIsLoading(false);
        };

        initializeGame();
    }, []);

   
    useEffect(() => {
        const checkForNewDay = setInterval(async () => {
            const now = new Date();
            const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const nextDayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
            const timeToNextDay = nextDayStart - now;
    
            // Retrieve stored game data from localStorage
            const storedGames = JSON.parse(localStorage.getItem("games")) || {};
            const storedGameState = storedGames[GAME_KEY]?.state;
            const storedDate = storedGameState?.date;  // storedDate should be in format "YYYY-MM-DD"
          
            // Log the current and stored dates for debugging
           
            if (storedDate !== dayStart.toISOString().split('T')[0]) {
                console.log("🔥 New day detected! Fetching a new puzzle...");
    
                try {
                    const formattedCurrentDate = dayStart.toISOString().split('T')[0];
                    const response = await axios.get(`http://localhost:3000/api/letterpool/daily?date=${encodeURIComponent(formattedCurrentDate)}`);
                    if (response.data) {
                        console.log("✅ New puzzle available. Refreshing game data.");
                        fetchGameData();
                    } else {
                        console.log("❌ No new puzzle found. Keeping existing game state.");
                    }
                } catch (error) {
                    console.error("❌ Error checking for new puzzle:", error);
                }
            } else {
                console.log("✅ It's not a new day yet.");
            }
        }, 15000); // Runs every 60 seconds to reduce frequency of checks
    
        return () => clearInterval(checkForNewDay);
    }, []);
    
    
    const fetchGameData = async () => {
        setIsLoading(true);
        
        // Create a local date string
        const now = new Date();
        const clientDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
        console.log('fetch data time: ', clientDate);
        console.time("⏳ API Response Time");

        const storedGames = JSON.parse(localStorage.getItem("games")) || {};
        const localData = storedGames[GAME_KEY]?.state; 

        if (localData && localData.date === clientDate) {
            setTilesInPool(localData.tilesInPool);
            setBoard(localData.board);
            setStarterWord(localData.starterWord);
            setStaterWordObj(localData.starterWordObj);
            setGameOver(localData.gameOver);
            setTotalScore(localData.totalScore);
            setAttempts(localData.attempts);
            setIncorrectWords(localData.incorrectWords);
            setScoreBreakdown(localData.scoreBreakdown || []);
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.get(`http://localhost:3000/api/letterpool/daily?date=${encodeURIComponent(clientDate)}`);
            console.timeEnd("⏳ API Response Time");
            const { letterPool, starterWordObj } = response.data;
            console.log("🎲 Game data fetched:", response.data);
            setTilesInPool(letterPool);

            const starterWord = starterWordObj.map(t => t.letter).join("");
            setStarterWord(starterWord);
            setStaterWordObj(starterWordObj);

            const initialBoardState = Array(gridWidth * gridWidth).fill(null).map((_, index) => {
                const preplacedTile = starterWordObj.find(t => t.position === index);
                return {
                    tile: preplacedTile || null,
                    feature: preplacedTile ? null : featureSquares[index] || null,
                    isValid: false
                };
            });

            setBoard(initialBoardState);

            storedGames[GAME_KEY] = storedGames[GAME_KEY] || {};
            storedGames[GAME_KEY].state = {
                date: clientDate,
                tilesInPool: letterPool,
                board: initialBoardState,
                starterWord,
                starterWordObj,
                gameOver,
                totalScore,
                attempts,
                incorrectWords,
                scoreBreakdown
            };
            console.log("HELLOW");
            localStorage.setItem("games", JSON.stringify(storedGames));
           
        } catch (error) {
            console.error("❌ Error fetching game data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateStats = (date, score, lettersLeft) => {
        const storedGames = JSON.parse(localStorage.getItem("games")) || {};
        storedGames[GAME_KEY] = storedGames[GAME_KEY] || {};
       
        let stats = storedGames[GAME_KEY].stats || { gamesPlayed: 0, history: [] };

        const existingGameIndex = stats.history.findIndex(entry => entry.date === date);

        if (existingGameIndex !== -1) {
            stats.history[existingGameIndex] = { date, score, lettersLeft };
        } else {
            stats.history.push({ date, score, lettersLeft });
            stats.gamesPlayed += 1;
        }

        storedGames[GAME_KEY].stats = stats;
        localStorage.setItem("games", JSON.stringify(storedGames));
        console.log("📊 Updated stats:", stats);
    };

    useEffect(() => {
        if (board.length > 0 && tilesInPool.length >= 0) {
            saveGameState();
            console.log("🔥 Game state saved to Local Storage.");
        }
    }, [board, tilesInPool, attempts, incorrectWords, gameOver, totalScore, scoreBreakdown]);

    const saveGameState = () => {
        const clientDate = new Date().toISOString().split("T")[0];

        const cleanedBoard = board.map(square => ({
            ...square,
            feature: square.tile?.isPrePlaced ? null : square.feature
        }));

        const storedGames = JSON.parse(localStorage.getItem("games")) || {};
        storedGames[GAME_KEY] = storedGames[GAME_KEY] || {};
        storedGames[GAME_KEY].state = {
            date: clientDate,
            tilesInPool,
            board: cleanedBoard,
            starterWord,
            starterWordObj,
            gameOver,
            totalScore,
            attempts,
            incorrectWords,
            scoreBreakdown
        };

        localStorage.setItem("games", JSON.stringify(storedGames));
        console.log("💾 Game state saved.");
        updateStats(clientDate, totalScore, tilesInPool.length);
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
        isLoading,
        scoreBreakdown, setScoreBreakdown
    };
};

export default GameStateManager;
