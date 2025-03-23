const featureSquares = {
    0: { type: 'tripleWordScore', multiplier: 3 },   // 🔴 Top-left corner
    4: { type: 'tripleWordScore', multiplier: 3 },   // 🔴 Top-right corner
    20: { type: 'tripleWordScore', multiplier: 3 },  // 🔴 Bottom-left corner
    24: { type: 'tripleWordScore', multiplier: 3 },  // 🔴 Bottom-right corner

    2: { type: 'doubleWordScore', multiplier: 2 },   // 🟠 Center-top
    10: { type: 'doubleWordScore', multiplier: 2 },  // 🟠 Center-right
    14: { type: 'doubleWordScore', multiplier: 2 },  // 🟠 Center-left
    22: { type: 'doubleWordScore', multiplier: 2 },  // 🟠 Center-bottom

    6: { type: 'tripleLetterScore', multiplier: 3 },  // 🟣 Upper-middle-left
    8: { type: 'tripleLetterScore', multiplier: 3 },  // 🟣 Upper-middle-right
    16: { type: 'tripleLetterScore', multiplier: 3 }, // 🟣 Lower-middle-left
    18: { type: 'tripleLetterScore', multiplier: 3 }, // 🟣 Lower-middle-right

    12: { type: 'doubleLetterScore', multiplier: 2 }, // 🔵 Middle center
};

export default featureSquares;
