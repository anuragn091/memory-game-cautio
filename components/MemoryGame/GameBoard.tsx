"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import TileComponent from "./Tile";
import {
  Tile,
  checkMatch,
  calculateBoardSize,
  ICONS,
} from "../../utils/memoryGame";

type Props = {
  board: Tile[];
  setBoard: (tiles: Tile[] | ((prev: Tile[]) => Tile[])) => void;
  onWin: () => void;
  darkMode: boolean;
};

export default function GameBoard({ board, setBoard, onWin, darkMode }: Props) {
  const [selected, setSelected] = useState<number[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  // OPTIMIZATION: Memoize board size calculation
  // PROBLEM: Board size was being recalculated on every render
  // Since ICONS.length is constant, this calculation never changes
  // SOLUTION: Cache the result and only recalculate if ICONS array changes
  // RESULT: Eliminates unnecessary calculations on every render
  const boardSize = useMemo(() => calculateBoardSize(ICONS.length), []);

  // OPTIMIZATION: Memoize the handleTileClick function to prevent unnecessary re-renders
  // PROBLEM: The click handler was being recreated on every render
  // This caused child components (Tile) to re-render unnecessarily
  // SOLUTION: Use useCallback to memoize the function with proper dependencies
  // RESULT: Tiles only re-render when the click handler actually changes
  const handleTileClick = useCallback(
    (index: number) => {
      if (isChecking) return;
      const tile = board[index];
      if (tile.isFlipped || tile.isMatched) return;

      // Flip tile
      const newBoard = board.map((t, i) =>
        i === index ? { ...t, isFlipped: true } : t
      );
      setBoard(newBoard);

      const newSelected = [...selected, index];
      setSelected(newSelected);

      if (newSelected.length === 2) {
        setIsChecking(true);
        const [firstIndex, secondIndex] = newSelected;
        const firstTile = newBoard[firstIndex];
        const secondTile = newBoard[secondIndex];

        if (checkMatch(firstTile, secondTile)) {
          // Match found: mark as matched
          setTimeout(() => {
            setBoard((prev: Tile[]) =>
              prev.map((tile: Tile, index: number) =>
                index === firstIndex || index === secondIndex
                  ? { ...tile, isMatched: true }
                  : tile
              )
            );
            setSelected([]);
            setIsChecking(false);
          }, 500);
        } else {
          // No match found: flip back
          setTimeout(() => {
            setBoard((prev: Tile[]) =>
              prev.map((tile: Tile, index: number) =>
                index === firstIndex || index === secondIndex
                  ? { ...tile, isFlipped: false }
                  : tile
              )
            );
            setSelected([]);
            setIsChecking(false);
          }, 1000);
        }
      }
    },
    [isChecking, board, selected, setBoard]
  );

  /**
   * Check win condition
   *
   * @description: This effecr is called when the user wins the game.
   * It stops the timer, saves the session, and returns to the dashboard.
   * It also refreshes the user data to show the updated stats.
   *
   * @returns: void
   */
  useEffect(() => {
    if (board.length > 0 && board.every((t) => t.isMatched)) {
      onWin();
    }
  }, [board, onWin]);

  return (
    <div className="flex justify-center items-center w-full">
      <div
        className={`grid gap-2 sm:gap-4 max-w-fit`}
        style={{
          gridTemplateColumns: `repeat(${boardSize.cols}, minmax(0, 1fr))`,
        }}
      >
        {board.map((tile, idx) => (
          <TileComponent
            key={tile.id}
            tile={tile}
            onClick={handleTileClick}
            index={idx}
            darkMode={darkMode}
          />
        ))}
      </div>
    </div>
  );
}
