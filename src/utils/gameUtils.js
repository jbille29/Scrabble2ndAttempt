
// utils/gameUtils.js
export const extractWords = (board, gridWidth) => {
    let words = [];
    let word = '';
    
    // Horizontal words
    for (let i = 0; i < gridWidth; i++) {
        word = '';
        for (let j = 0; j < gridWidth; j++) {
          const tile = board[i * gridWidth + j].tile;
          if (tile) {
            word += tile.letter;
          } else if (word.length > 1) {
            words.push(word);
            word = '';
          } else {
            word = '';
          }
        }
        if (word.length > 1) words.push(word); // Check last word in the row
      }
  
      // Vertical words
      for (let j = 0; j < gridWidth; j++) {
        word = '';
        for (let i = 0; i < gridWidth; i++) {
          const tile = board[i * gridWidth + j].tile;
          if (tile) {
            word += tile.letter;
          } else if (word.length > 1) {
            words.push(word);
            word = '';
          } else {
            word = '';
          }
        }
        if (word.length > 1) words.push(word); // Check last word in the column
      }
    return words;
};

export const extractWordsAgain = (board, gridWidth) => {
  let words = [];
  let word = '';
  let indices = [];

  // Horizontal words
  for (let i = 0; i < gridWidth; i++) {
      word = '';
      indices = [];
      for (let j = 0; j < gridWidth; j++) {
          const tileIndex = i * gridWidth + j;
          const tile = board[tileIndex].tile;
          if (tile) {
              word += tile.letter;
              indices.push(tileIndex);
          } else if (word.length > 1) {
              words.push({ word, indices });
              word = '';
              indices = [];
          } else {
              word = '';
              indices = [];
          }
      }
      if (word.length > 1) words.push({ word, indices }); // Check last word in the row
  }

  // Vertical words
  for (let j = 0; j < gridWidth; j++) {
      word = '';
      indices = [];
      for (let i = 0; i < gridWidth; i++) {
          const tileIndex = i * gridWidth + j;
          const tile = board[tileIndex].tile;
          if (tile) {
              word += tile.letter;
              indices.push(tileIndex);
          } else if (word.length > 1) {
              words.push({ word, indices });
              word = '';
              indices = [];
          } else {
              word = '';
              indices = [];
          }
      }
      if (word.length > 1) words.push({ word, indices }); // Check last word in the column
  }
  
  return words;
};

export const calculateScore = (board, words, letterScores) => {
    let totalScore = 0;
    let scoreBreakdown = [];
  
    words.forEach(entry => {
      let baseWordScore = 0; // Step 1: Base letter score
        let finalWordScore = 0; // Step 2: Apply letter multipliers
      let wordMultipliers = []; // Step 3: Collect multiple word multipliers
      let appliedFeatures = [];
  
      // Calculate the base score
      entry.indices.forEach(index => {
        const tile = board[index].tile;
        const letterScore = letterScores[tile.letter.toUpperCase()];
        let tileScore = letterScore;
  
        baseWordScore += tileScore; // Add letter score to total base score
      });
      // Calculate score with features 
      entry.indices.forEach(index => {
        const tile = board[index].tile;
        const feature = board[index].feature;
        const letterScore = letterScores[tile.letter.toUpperCase()];
        let tileScore = letterScore;
        
        if (feature) {
          switch (feature.type) {
            case 'doubleLetterScore':
              tileScore *= 2;
              appliedFeatures.push({ name: "Double Letter", value: letterScore });
              break;
            case 'tripleLetterScore':
              tileScore *= 3;
              appliedFeatures.push({ name: "Triple Letter", value: letterScore * 2 });
              break;
            case 'doubleWordScore':
              wordMultipliers.push(2); // Collect word multipliers separately
              appliedFeatures.push({ name: "Double Word", value: 0 });
              break;
            case 'tripleWordScore':
              wordMultipliers.push(3);
              appliedFeatures.push({ name: "Triple Word", value: 0 });
              break;
            default:
              break;
          }
        }
  
        finalWordScore += tileScore; // Add letter score to total base score
      });
  
      // Step 3: Apply **all** word multipliers one by one
      wordMultipliers.forEach(multiplier => {
        finalWordScore *= multiplier;
      });
  
      totalScore += finalWordScore; // Step 4: Add to total score
      
      console.log(`Word: ${entry.word}, Base Score: ${baseWordScore}, Final Score: ${totalScore}`);
      scoreBreakdown.push({
        word: entry.word,
        baseScore: baseWordScore,
        features: appliedFeatures,
        finalScore: finalWordScore,
      });
    });
    
    console.log("\n🏆 FINAL TOTAL SCORE:", totalScore);
    console.log("📝 SCORE BREAKDOWN:", scoreBreakdown);
    return { totalScore, scoreBreakdown };
  };
  


/*
export const calculateScore = (board, words, letterScores, setModalContent, setShowModal) => {
  console.log('Calculating score for words:', words);
  console.log(board)
  let score = 0;
  // Iterate over each word collected from the game board
  words.forEach(word => {
      let wordScore = 0; // Score for this particular word
      let wordMultiplier = 1; // This will be used for word multipliers like "double word score"
      let usedTileIds = new Set();  // To keep track of used tiles in this word

      // Process each character in the word
      for (let i = 0; i < word.length; i++) {
          const char = word.charAt(i);
          console.log(`Processing character ${char} in word ${word}`);
          // Find the tile on the board that matches this letter
          const index = board.findIndex(tile => tile.tile && tile.tile.letter === char);
          const tile = board[index];
          const letterScore = letterScores[char.toUpperCase()]; // Get the score for the letter
          console.log(`Letter ${char} has a score of ${letterScore}`);

          // Apply feature effects based on the tile's feature
          if (tile.feature) {
              switch (tile.feature.type) {
                  case 'doubleLetterScore':
                      // Double the score of this letter
                      wordScore += letterScore * 2;
                      break;
                  case 'tripleLetterScore':
                      // Triple the score of this letter
                      wordScore += letterScore * 3;
                      break;
                  case 'doubleWordScore':
                      // Double the score of the entire word
                      wordScore += letterScore;
                      wordMultiplier *= 2;
                      break;
                  case 'tripleWordScore':
                      // Triple the score of the entire word
                      wordScore += letterScore;
                      wordMultiplier *= 3;
                      break;
                  case 'subtractPoints':
                      // Subtract points for this letter (a penalty)
                      wordScore -= letterScore;
                      break;
                  default:
                      // If no special feature, just add the base letter score
                      wordScore += letterScore;
              }
          } else {
              // If no feature, add the letter score to the word score
              wordScore += letterScore;
              console.log(`Letter ${char} has a score of ${letterScore}`);
              console.log(`Word score is now ${wordScore}`);
          }
      }

      // After processing all letters, multiply the word score by any word multipliers
      score += wordScore * wordMultiplier;
  });

  // Display the total score
  setModalContent(`Your score is: ${score}`);
  setShowModal(true);
};
*/
  
/*
  export const calculateScore = (words, letterScores, setModalContent, setShowModal) => {
    let score = 0;
    words.forEach(word => {
        score += word.split('').reduce((acc, letter) => acc + letterScores[letter.toUpperCase()], 0);
    });
    setModalContent(`Your score is: ${score}`);
    setShowModal(true);
  };
  */
  
  export const isConnected = (board, gridWidth) => {
    const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]]; // Moves: down, up, right, left
    let visited = new Array(gridWidth * gridWidth).fill(false);
    let queue = [];
    let startFound = false;
  
    // Enqueue all pre-placed tiles
    for (let i = 0; i < gridWidth * gridWidth; i++) {
      if (board[i].tile && board[i].tile.isPrePlaced) {
          //console.log(`Processing pre-placed tile at index ${i}`);
          queue.push(i);
          visited[i] = true;
          startFound = true;
      }
    }
    // If no pre-placed tile is found, return false
    if (!startFound) {
      console.log("No pre-placed tiles found to start connection check.");
      return false;
    }
  
    // Perform BFS to mark all reachable tiles
    while (queue.length > 0) {
      let current = queue.shift();
      let x = Math.floor(current / gridWidth);
      let y = current % gridWidth;

      directions.forEach(([dx, dy]) => {
          let nx = x + dx;
          let ny = y + dy;
          let index = nx * gridWidth + ny;

          if (nx >= 0 && nx < gridWidth && ny >= 0 && ny < gridWidth && !visited[index] && board[index].tile) {
              //console.log(`Visiting tile at index ${index} from (${x}, ${y}) to (${nx}, ${ny})`);
              visited[index] = true;
              queue.push(index);
          }
      });
    }
  
     // Verify all tiles that are placed (but not pre-placed) are connected
     const allConnected = board.every((square, index) => !square.tile || square.tile.isPrePlaced || visited[index]);
     if (!allConnected) {
         console.log("Not all placed tiles are connected to a pre-placed tile.");
     }
     return allConnected;
  };
  
// Validates words placed on the board
export const validateWords = (board, gridWidth, validWords) => {
    let isValid = true;
    const words = extractWords(board, gridWidth);
    console.log('Words:', words);

    words.forEach(word => {
        if (!validWords.includes(word.toUpperCase())) {
            console.log('Invalid word:', word);
            isValid = false;
        } 
    });

    const newBoard = board.map(square => {
        if (square.tile && words.includes(square.tile.letter)) {
            return { ...square, isValid };
        }
        return square;
    });

    return newBoard;
};

// Handles score calculation
export const handleCalculateScore = (board, setBoard, validWords, setModalContent, setShowModal) => {
    const newBoard = validateWords(board, Math.sqrt(board.length), validWords);
    setBoard(newBoard);

    const words = extractWords(board, Math.sqrt(board.length));

    if (!isConnected(board, Math.sqrt(board.length))) {
        setModalContent("Please ensure all tiles are connected to an anchor tile.");
        setShowModal(true);
    } else if (!words.every(word => validWords.includes(word.toUpperCase()))) {
        setModalContent("One or more words are not valid. Please check and try again.");
        setShowModal(true);
    } else {
        calculateScore(board, extractWordsAgain(board, Math.sqrt(board.length)), letterScores, setModalContent, setShowModal);
    }
};

// Moves a tile to the board
export const moveTileToBoard = (tile, toIndex, board, setBoard, tilesInPool, setTilesInPool) => {
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

// Returns a tile to the pool
export const returnTileToPool = (tileId, board, setBoard, tilesInPool, setTilesInPool) => {
    const tileIndex = board.findIndex(square => square.tile?.id === tileId);
    if (tileIndex !== -1) {
        const tile = board[tileIndex].tile;
        board[tileIndex].tile = null;
        setBoard([...board]);
        setTilesInPool([...tilesInPool, tile]);
    }
};
