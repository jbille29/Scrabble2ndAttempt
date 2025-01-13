const validWords = ['ED', 'RG', 'ER','APPLE', 'ORANGE', 'GRAPE', 'BANANA', 'CHERRY'];


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
    const valid = words.every(word => validWords.includes(word.toUpperCase()));
    if (valid) {
      words.forEach(word => {
        score += word.split('').reduce((acc, letter) => acc + letterScores[letter.toUpperCase()], 0);
      });
      setModalContent(`Your score is: ${score}`);
    } else {
      setModalContent("Invalid words or tile placement.");
    }
    setShowModal(true);
  };
  
  export const isConnected = (board, gridWidth) => {
    const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]]; // Moves: down, up, right, left
    let visited = new Array(gridWidth * gridWidth).fill(false);
    let queue = [];
    let startFound = false;
  
    // Find the first pre-placed or any placed tile to start the BFS
    for (let i = 0; i < gridWidth * gridWidth; i++) {
      if (board[i].tile && board[i].tile.isPrePlaced) {
        queue.push(i);
        visited[i] = true;
        startFound = true;
        break;
      }
    }
  
    // If no starting tile is found (unlikely in your current setup), return false
    if (!startFound) return false;
  
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
          visited[index] = true;
          queue.push(index);
        }
      });
    }
  
    // Check if all tiles that are not pre-placed are visited
    return board.every((square, index) => !square.tile || square.tile.isPrePlaced || visited[index]);
  };
  
  