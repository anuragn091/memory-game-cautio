"use client";

import { useState, useEffect, useMemo } from "react";
import { themeClasses, getConditionalClasses } from "../../utils/themeClasses";

type Props = {
  isActive: boolean;
  darkMode: boolean;
  className?: string;
};

export default function Timer({ isActive, darkMode, className = "" }: Props) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isActive) {
      interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  // Memoize formatted time to prevent unnecessary recalculations
  const formattedTime = useMemo(() => {
    const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
    const seconds = String(elapsed % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [elapsed]);

  return (
    <span
      className={`font-mono text-sm ${getConditionalClasses(
        darkMode,
        themeClasses.text.primary.light,
        themeClasses.text.primary.dark
      )} ${className}`}
    >
      Time: {formattedTime}
    </span>
  );
}
