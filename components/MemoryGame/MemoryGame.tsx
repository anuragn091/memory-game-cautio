'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import LoginScreen from './LoginScreen';
import UserDashboard from './UserDashboard';
import WelcomeScreen from './WelcomeScreen';
import GameBoard from './GameBoard';
import ConfirmationModal from './ConfirmationModal';
import Timer from './Timer';
import { createBoard, Tile, ICONS } from '../../utils/memoryGame';
import { themeClasses, getConditionalClasses } from '../../utils/themeClasses';
import { storage, UserData, GameSession } from '../../utils/storage';

export default function MemoryGame() {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [board, setBoard] = useState<Tile[]>([]);
  const [timerActive, setTimerActive] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showStopModal, setShowStopModal] = useState(false);
  const [currentSession, setCurrentSession] = useState<Partial<GameSession> | null>(null);


  // Handle user login
  const handleLogin = useCallback((userData: UserData) => {
    setCurrentUser(userData);
    setShowDashboard(true);
  }, []);

  /**
   * Handle logout
   * 
   * @description: This function is called when the user clicks the logout button.
   * It clears the current user, sets the dashboard to false, and clears the game session.
   * 
   * @returns: void
   */
  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setShowDashboard(false);
    setGameStarted(false);
    setBoard([]);
    setTimerActive(false);
    storage.clearCurrentSession();
  }, []);

  /**
   * Start a new game
   * 
   * @description: This function is called when the user clicks the start game button.
   * It creates a new game session and starts the game.
   * 
   * @returns: void
   */
  const startGame = useCallback(() => {
    // If no user is logged in, do nothing
    if (!currentUser) return;

    const gameNumber = storage.getNextGameNumber(currentUser.email);
    const startTime = new Date().toISOString();
    const boardSize = ICONS.length;

    const session: GameSession = {
      gameNumber,
      startTime,
      status: 'in-progress',
      boardSize
    };

    // Save session to localStorage
    storage.updateCurrentSession(session);
    setCurrentSession(session);

    // Start game
    setBoard(createBoard());
    setTimerActive(true);
    setGameStarted(true);
    setShowDashboard(false);
  }, [currentUser]);

  /**
   * Handle win
   * 
   * @description: This function is called when the user wins the game.
   * It stops the timer, saves the session, and returns to the dashboard.
   * It also refreshes the user data to show the updated stats.
   * 
   * @returns: void
   */
  const handleWin = useCallback(() => {
    setTimerActive(false);
    
    if (currentSession && currentSession.startTime) {
      const endTime = new Date().toISOString();
      const duration = Math.floor((new Date(endTime).getTime() - new Date(currentSession.startTime).getTime()) / 1000);
      storage.completeSession(endTime, duration, 'completed');
      setCurrentSession(null);
    }
    
    // Return to dashboard after a short delay to show win message
    setTimeout(() => {
      setGameStarted(false);
      setBoard([]);
      setShowDashboard(true);
      
      // Refresh user data to show updated stats
      if (currentUser) {
        const updatedUserData = storage.getUserByEmail(currentUser.email);
        if (updatedUserData) {
          setCurrentUser(updatedUserData);
        }
      }
    }, 2000); // Show win message for 2 seconds
  }, [currentSession, currentUser]);

  /**
   * Handle stop game
   * 
   * @description: This function is called when the user clicks the stop game button.
   * It opens the confirmation modal.
   * 
   * @returns: void
   */
  const handleStopGame = useCallback(() => {
    setShowStopModal(true);
  }, []);

  /**
   * Handle stop game confirmation
   * 
   * @description: This function is called when the user clicks the stop game confirmation button.
   * It stops the timer, saves the session, and returns to the dashboard.
   * It also refreshes the user data to show the updated stats.
   * 
   * @returns: void
   */
  const handleStopGameConfirm = useCallback(() => {
    setTimerActive(false);
    setGameStarted(false);
    setBoard([]);
    setShowStopModal(false);
    
    if (currentSession && currentSession.startTime) {
      const endTime = new Date().toISOString();
      const duration = Math.floor((new Date(endTime).getTime() - new Date(currentSession.startTime).getTime()) / 1000);
      storage.completeSession(endTime, duration, 'lost');
      setCurrentSession(null);
    }
    
    setShowDashboard(true);
    
    // Refresh user data to show updated stats
    if (currentUser) {
      const updatedUserData = storage.getUserByEmail(currentUser.email);
      if (updatedUserData) {
        setCurrentUser(updatedUserData);
      }
    }
  }, [currentSession, currentUser]);

  /**
   * Handle stop game cancel
   * 
   * @description: This function is called when the user clicks the cancel button in the confirmation modal.
   * It closes the modal.
   * 
   * @returns: void
   */
  const handleStopGameCancel = useCallback(() => {
    setShowStopModal(false);
  }, []);


  // OPTIMIZATION: Memoize the GameBoard component to prevent re-renders when timer updates
  // PROBLEM: The timer updates every second, causing the entire component to re-render
  // This was causing the GameBoard to re-render unnecessarily, which is expensive
  // SOLUTION: Only re-render GameBoard when its actual dependencies change (board, setBoard, handleWin, darkMode)
  // RESULT: Timer updates no longer trigger GameBoard re-renders, improving performance significantly
  const memoizedGameBoard = useMemo(() => (
    <GameBoard board={board} setBoard={setBoard} onWin={handleWin} darkMode={darkMode} />
  ), [board, setBoard, handleWin, darkMode]);

  // OPTIMIZATION: Memoize the win message to prevent re-renders
  // PROBLEM: The win message was being recreated on every render (every second)
  // even when the game state hadn't changed
  // SOLUTION: Only recreate the win message when board state or darkMode changes
  // RESULT: Reduces unnecessary DOM updates and improves rendering performance
  const winMessage = useMemo(() => {
    if (board.length > 0 && board.every((t) => t.isMatched)) {
      return (
        <div className={`text-center mt-4 space-y-2 ${getConditionalClasses(darkMode, themeClasses.text.success.light, themeClasses.text.success.dark)}`}>
          <div className="text-2xl">🎉</div>
          <div className="font-bold text-lg">Congratulations!</div>
          <div className="font-semibold">You matched all the tiles!</div>
          <div className="text-sm opacity-75">Returning to dashboard in 2 seconds...</div>
        </div>
      );
    }
    return null;
  }, [board, darkMode]);

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: darkMode ? '#111827' : '#f5f5f5' }}>
      <div className={`w-full h-full p-4 sm:p-6 lg:p-8 ${getConditionalClasses(darkMode, themeClasses.container.main.light, themeClasses.container.main.dark)}`}>
        {!currentUser ? (
          // Login screen
          <LoginScreen
            onLogin={handleLogin}
            darkMode={darkMode}
            toggleDarkMode={() => setDarkMode((d) => !d)}
          />
        ) : showDashboard ? (
          // User dashboard
          <UserDashboard
            userData={currentUser}
            onStartNewGame={startGame}
            onLogout={handleLogout}
            darkMode={darkMode}
            toggleDarkMode={() => setDarkMode((d) => !d)}
          />
        ) : !gameStarted ? (
          // Welcome screen
          <WelcomeScreen
            onStart={startGame}
            darkMode={darkMode}
            toggleDarkMode={() => setDarkMode((d) => !d)}
          />
        ) : (
          // Game screen
          <>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <Timer isActive={timerActive} darkMode={darkMode} />
                {currentSession && (
                  <span className={`text-sm ${getConditionalClasses(darkMode, themeClasses.text.secondary.light, themeClasses.text.secondary.dark)}`}>
                    Game #{currentSession.gameNumber}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleStopGame}
                  className={`text-sm px-3 py-2 border rounded-md transition-colors ${getConditionalClasses(darkMode, 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100', 'border-red-600 bg-red-900 text-red-100 hover:bg-red-800')}`}
                >
                  Stop Game
                </button>
                <button
                  onClick={() => setDarkMode((d) => !d)}
                  className={`text-sm px-3 py-2 border rounded-md transition-colors ${getConditionalClasses(darkMode, themeClasses.button.secondary.light, themeClasses.button.secondary.dark)}`}
                >
                  {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
                </button>
              </div>
            </div>
            {memoizedGameBoard}
            {winMessage}
          </>
        )}
      </div>
      
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showStopModal}
        onCancel={handleStopGameCancel}
        onProceed={handleStopGameConfirm}
        darkMode={darkMode}
      />
    </div>
  );
}