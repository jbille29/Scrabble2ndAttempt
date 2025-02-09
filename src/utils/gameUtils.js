
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
  
  export const calculateScore = (words, letterScores, setModalContent, setShowModal) => {
    let score = 0;
    words.forEach(word => {
        score += word.split('').reduce((acc, letter) => acc + letterScores[letter.toUpperCase()], 0);
    });
    setModalContent(`Your score is: ${score}`);
    setShowModal(true);
  };
  
  export const isConnected = (board, gridWidth) => {
    const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]]; // Moves: down, up, right, left
    let visited = new Array(gridWidth * gridWidth).fill(false);
    let queue = [];
    let startFound = false;
  
    // Enqueue all pre-placed tiles
    for (let i = 0; i < gridWidth * gridWidth; i++) {
      if (board[i].tile && board[i].tile.isPrePlaced) {
          console.log(`Processing pre-placed tile at index ${i}`);
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
              console.log(`Visiting tile at index ${index} from (${x}, ${y}) to (${nx}, ${ny})`);
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
  
  