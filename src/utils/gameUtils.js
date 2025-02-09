
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

export const calculateScore = (board, words, letterScores, setModalContent, setShowModal) => {
  let score = 0;
  words.forEach(entry => {
      let wordScore = 0; // Initialize the score for the current word
      let wordMultiplier = 1; // Start with no multiplier

      entry.indices.forEach(index => {
          const tile = board[index].tile;
          const feature = board[index].feature;
          const letterScore = letterScores[tile.letter.toUpperCase()];
          let tileScore = letterScore; // Start with base letter score

          // Apply feature effects to the tileScore
          if (feature) {
              switch (feature.type) {
                  case 'doubleLetterScore':
                      tileScore *= 2; // Double the letter score
                      break;
                  case 'tripleLetterScore':
                      tileScore *= 3; // Triple the letter score
                      break;
                  case 'doubleWordScore':
                      wordMultiplier *= 2; // Double the entire word score later
                      break;
                  case 'tripleWordScore':
                      wordMultiplier *= 3; // Triple the entire word score later
                      break;
                  case 'subtractPoints':
                      tileScore -= letterScore * 2; // Subtract the letter score (or another rule)
                      break;
                  default:
                      // No additional actions needed for other types
                      break;
              }
          }

          // Add the tileScore to the wordScore
          wordScore += tileScore;
      }); // iterating through each letter
      console.log(`Word ${entry.word} has a score of ${wordScore}`);
      // After processing all letters, apply any word multipliers
      wordScore *= wordMultiplier;
      console.log(`Word ${entry.word} has a score of ${wordScore} after multiplier`);
      // Add the wordScore to the total score for the game
      score += wordScore;
  }); // iterating through each word

  // Update the UI with the final score
  setModalContent(`Your score is: ${score}`);
  setShowModal(true);
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
  
  