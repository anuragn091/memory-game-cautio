// util theme styles to get theme classes for light and dark mode
export const themeClasses = {
  // Background colors for light and dark mode
  background: {
    light: "bg-[#f5f5f5]",
    dark: "bg-gray-900",
  },

  // Text colors for light and dark mode
  text: {
    primary: {
      light: "text-gray-900",
      dark: "text-gray-100",
    },
    secondary: {
      light: "text-gray-700",
      dark: "text-gray-300",
    },
    success: {
      light: "text-green-600",
      dark: "text-green-400",
    },
  },

  // Button styles for light and dark mode
  button: {
    primary: {
      light: "bg-blue-600 hover:bg-blue-700 text-white",
      dark: "bg-blue-500 hover:bg-blue-600 text-white",
    },
    secondary: {
      light: "border-gray-300 bg-white text-gray-900 hover:bg-gray-50",
      dark: "border-gray-600 bg-gray-800 text-gray-100 hover:bg-gray-700",
    },
  },

  // Border colors for light and dark mode
  border: {
    light: "border-gray-300",
    dark: "border-gray-600",
  },

  // Tile styles for light and dark mode
  tile: {
    base: "flex items-center justify-center rounded border text-2xl select-none transition-colors duration-300",
    border: {
      light: "border-gray-300",
      dark: "border-gray-600",
    },
    background: {
      default: {
        light: "bg-gray-200 hover:bg-gray-300 cursor-pointer",
        dark: "bg-gray-700 hover:bg-gray-600 cursor-pointer",
      },
      flipped: {
        light: "bg-blue-100",
        dark: "bg-blue-800",
      },
      matched: {
        light: "bg-green-100 cursor-default",
        dark: "bg-green-800 cursor-default",
      },
    },
  },

  // Container styles for light and dark mode
  container: {
    main: {
      light: "bg-[#f5f5f5] text-gray-900",
      dark: "bg-gray-900 text-gray-100",
    },
  },
};

// Helper function to get conditional classes for light and dark mode
export function getConditionalClasses(
  isDark: boolean,
  lightClass: string,
  darkClass: string
): string {
  return isDark ? darkClass : lightClass;
}
