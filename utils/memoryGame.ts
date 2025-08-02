// util function to create a dynamic board based on number of icons

/**
 * Icons for the memory game. Each icon appears twice on the board.
 * The board size automatically adjusts based on the number of icons.
 */
export const ICONS = ["🍎", "🚀", "🎵", "🐶", "🌟", "🎲", "🎮", "🍕"];

/**
 * Shuffle an array.
 * 
 * @param array - The array to shuffle.
 * @returns The shuffled array.
 */
export function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Tile type definition
export type Tile = {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
};

/**
 * Calculate the board size based on the number of icons.
 * 
 * @param iconCount - The number of icons.
 * @returns The board size.
 */
export function calculateBoardSize(iconCount: number): {
  rows: number;
  cols: number;
  totalTiles: number;
} {
  const totalTiles = iconCount * 2; // Each icon appears twice
  const size = Math.ceil(Math.sqrt(totalTiles)); // Get the square root and round up
  return {
    rows: size,
    cols: size,
    totalTiles: size * size,
  };
}

/**
 * Generate a new board with dynamic size based on number of icons.
 * if 8 icons, the board will be 4x4
 * if 12 icons, 5*5 etc
 * @returns The new board.
 */
export function createBoard(): Tile[] {
  const boardSize = calculateBoardSize(ICONS.length);
  const tileIcons = [...ICONS, ...ICONS];

  // If we have more tiles than needed, truncate to the exact number
  const neededTiles = boardSize.totalTiles;
  const selectedIcons = tileIcons.slice(0, neededTiles);

  shuffle(selectedIcons);
  return selectedIcons.map((icon, index) => ({
    id: index,
    icon,
    isFlipped: false,
    isMatched: false,
  }));
}

/**
 * check if the icon of first tile and second tile match
 * @param a 
 * @param b 
 * @returns boolean
 */
export function checkMatch(a: Tile, b: Tile): boolean {
  return a.icon === b.icon;
}
