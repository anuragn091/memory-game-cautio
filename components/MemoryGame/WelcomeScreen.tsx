"use client";

import { themeClasses, getConditionalClasses } from "../../utils/themeClasses";

type Props = {
  onStart: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
};

export default function WelcomeScreen({
  onStart,
  darkMode,
  toggleDarkMode,
}: Props) {
  return (
    <div className="text-center space-y-6">
      <div className="flex justify-between items-center">
        <h2
          className={`text-2xl font-bold ${getConditionalClasses(
            darkMode,
            themeClasses.text.primary.light,
            themeClasses.text.primary.dark
          )}`}
        >
          Memory Game
        </h2>
        <button
          onClick={toggleDarkMode}
          className={`text-sm px-3 py-2 border rounded-md transition-colors ${getConditionalClasses(
            darkMode,
            themeClasses.button.secondary.light,
            themeClasses.button.secondary.dark
          )}`}
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
      <p
        className={`text-lg ${getConditionalClasses(
          darkMode,
          themeClasses.text.secondary.light,
          themeClasses.text.secondary.dark
        )}`}
      >
        Flip tiles to find matching pairs. Only two tiles can be flipped at a
        time.
      </p>
      <button
        onClick={onStart}
        className={`py-3 px-6 rounded-lg text-lg font-semibold transition-colors ${getConditionalClasses(
          darkMode,
          themeClasses.button.primary.light,
          themeClasses.button.primary.dark
        )}`}
      >
        Start Game
      </button>
    </div>
  );
}
