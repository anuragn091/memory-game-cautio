"use client";

import { Tile, calculateBoardSize, ICONS } from "../../utils/memoryGame";
import { themeClasses, getConditionalClasses } from "../../utils/themeClasses";

type Props = {
  tile: Tile;
  onClick: (index: number) => void;
  index: number;
  darkMode: boolean;
};

export default function TileComponent({
  tile,
  onClick,
  index,
  darkMode,
}: Props) {
  const content = tile.isFlipped || tile.isMatched ? tile.icon : "🎴";
  const boardSize = calculateBoardSize(ICONS.length);

  // Calculate responsive tile size based on board size
  const getTileSize = () => {
    if (boardSize.cols <= 4) return "w-20 h-20 sm:w-32 sm:h-32 md:w-48 md:h-32";
    if (boardSize.cols <= 5) return "w-18 h-18 sm:w-28 sm:h-28 md:w-40 md:h-24";
    if (boardSize.cols <= 6) return "w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-20";
    return "w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-16";
  };

  const base = `${themeClasses.tile.base} ${getConditionalClasses(
    darkMode,
    themeClasses.tile.border.light,
    themeClasses.tile.border.dark
  )}`;

  let bg = "";
  if (tile.isMatched) {
    bg = getConditionalClasses(
      darkMode,
      themeClasses.tile.background.matched.light,
      themeClasses.tile.background.matched.dark
    );
  } else if (tile.isFlipped) {
    bg = getConditionalClasses(
      darkMode,
      themeClasses.tile.background.flipped.light,
      themeClasses.tile.background.flipped.dark
    );
  } else {
    bg = getConditionalClasses(
      darkMode,
      themeClasses.tile.background.default.light,
      themeClasses.tile.background.default.dark
    );
  }

  return (
    <div
      className={`${base} ${bg} ${getTileSize()}`}
      onClick={() => onClick(index)}
    >
      {content}
    </div>
  );
}
