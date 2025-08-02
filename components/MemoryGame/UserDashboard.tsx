'use client';

import { UserData, GameStatus } from '../../utils/storage';
import { themeClasses, getConditionalClasses } from '../../utils/themeClasses';

type Props = {
  userData: UserData;
  onStartNewGame: () => void;
  onLogout: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
};

export default function UserDashboard({ userData, onStartNewGame, onLogout, darkMode, toggleDarkMode }: Props) {

  /**
   * Format duration
   * 
   * @description: This function formats the duration of a game session.
   * 
   * @param seconds: number - The duration of the game session in seconds.
   * @returns: string in the format of "minutes:seconds"
   */
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  /**
   * Format date
   * 
   * @description: This function formats the date of a game session.
   * 
   * @param dateString: string - The date of the game session.
   * @returns: string in the format of "MM/DD/YYYY"
   */
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  /**
   * Get status color
   * 
   * @description: This function returns the color of the status of a game session.
   * 
   * @param status: string - The status of the game session.
   * @returns: string - The color of the status.
   */
  const getStatusColor = (status: GameStatus) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400';
      case 'lost':
        return 'text-red-600 dark:text-red-400';
      case 'in-progress':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  /**
   * Get status icon
   * 
   * @description: This function returns the icon of the status of a game session.
   * 
   * @param status: string - The status of the game session.
   * @returns: string - The icon of the status.
   */
  const getStatusIcon = (status: GameStatus) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'lost':
        return '❌';
      case 'in-progress':
        return '⏳';
      default:
        return '❓';
    }
  };

  /**
   * Header
   * 
   * @description: This component displays the header of the user dashboard.
   * Use closer to get the dark mode value.
   * 
   * @returns: JSX.Element
   */
  const Header = () => {
    return (
       <div className="flex justify-between items-center">
          <div>
            <h2 className={`text-2xl font-bold ${getConditionalClasses(darkMode, themeClasses.text.primary.light, themeClasses.text.primary.dark)}`}>
              Welcome back, {userData.name}!
            </h2>
            <p className={`text-sm ${getConditionalClasses(darkMode, themeClasses.text.secondary.light, themeClasses.text.secondary.dark)}`}>
              {userData.email}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggleDarkMode}
              className={`text-sm px-3 py-2 border rounded-md transition-colors ${getConditionalClasses(darkMode, themeClasses.button.secondary.light, themeClasses.button.secondary.dark)}`}
            >
              {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
            <button
              onClick={onLogout}
              className={`text-sm px-3 py-2 border rounded-md transition-colors ${getConditionalClasses(darkMode, 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100', 'border-red-600 bg-red-900 text-red-100 hover:bg-red-800')}`}
            >
              Logout
            </button>
          </div>
        </div>
    )
  }

  /**
   * Stats
   * 
   * @description: This component displays the stats of the user.
   * Use closer to get the dark mode value.
   * 
   * @returns: JSX.Element
   */
  const Stats = () => {
    return (
      <div className={`p-4 rounded-lg border ${getConditionalClasses(darkMode, 'bg-white border-gray-300', 'bg-gray-800 border-gray-600')}`}>
          <h3 className={`text-lg font-semibold mb-3 ${getConditionalClasses(darkMode, themeClasses.text.primary.light, themeClasses.text.primary.dark)}`}>
            Your Stats
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getConditionalClasses(darkMode, 'text-blue-600', 'text-blue-400')}`}>
                {userData.sessions.length}
              </div>
              <div className={`text-sm ${getConditionalClasses(darkMode, themeClasses.text.secondary.light, themeClasses.text.secondary.dark)}`}>
                Total Games
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getConditionalClasses(darkMode, 'text-green-600', 'text-green-400')}`}>
                {userData.sessions.filter(s => s.status === 'completed').length}
              </div>
              <div className={`text-sm ${getConditionalClasses(darkMode, themeClasses.text.secondary.light, themeClasses.text.secondary.dark)}`}>
                Completed
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getConditionalClasses(darkMode, 'text-red-600', 'text-red-400')}`}>
                {userData.sessions.filter(s => s.status === 'lost').length}
              </div>
              <div className={`text-sm ${getConditionalClasses(darkMode, themeClasses.text.secondary.light, themeClasses.text.secondary.dark)}`}>
                Lost
              </div>
            </div>
          </div>
        </div>
    )
  }

  /**
   * Start New Game
   * 
   * @description: This component displays the start new game button.
   * Use closer to get the dark mode value.
   * 
   * @returns: JSX.Element
   */
  const StartNewGame = () => {
    return (
      <div className={`p-4 rounded-lg border ${getConditionalClasses(darkMode, 'bg-white border-gray-300', 'bg-gray-800 border-gray-600')}`}>
          <h3 className={`text-lg font-semibold mb-3 ${getConditionalClasses(darkMode, themeClasses.text.primary.light, themeClasses.text.primary.dark)}`}>
            Start New Game
          </h3>
          <p className={`text-sm mb-4 ${getConditionalClasses(darkMode, themeClasses.text.secondary.light, themeClasses.text.secondary.dark)}`}>
            Ready for a new challenge? Click below to start a fresh game.
          </p>
          <button
            onClick={onStartNewGame}
            className={`py-3 px-6 rounded-lg text-lg font-semibold transition-colors ${getConditionalClasses(darkMode, themeClasses.button.primary.light, themeClasses.button.primary.dark)}`}
          >
            Start New Game
          </button>
        </div>
    )
  }

  /**
   * Previous Sessions
   * 
   * @description: This component displays the previous sessions of the user.
   * Use closer to get the dark mode value.
   * 
   * @returns: JSX.Element
   */
  const PreviousSessions = () => {
    return (
      <div className={`p-4 rounded-lg border ${getConditionalClasses(darkMode, 'bg-white border-gray-300', 'bg-gray-800 border-gray-600')}`}>
            <h3 className={`text-lg font-semibold mb-3 ${getConditionalClasses(darkMode, themeClasses.text.primary.light, themeClasses.text.primary.dark)}`}>
              Previous Sessions
            </h3>
            <div className="space-y-2">
              {userData.sessions.slice().reverse().map((session, index) => (
                <div
                  key={session.gameNumber}
                  className={`p-3 rounded border ${getConditionalClasses(darkMode, 'bg-gray-50 border-gray-200', 'bg-gray-700 border-gray-600')}`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getStatusIcon(session.status)}</span>
                      <span className={`font-medium ${getConditionalClasses(darkMode, themeClasses.text.primary.light, themeClasses.text.primary.dark)}`}>
                        Game #{session.gameNumber}
                      </span>
                      <span className={`text-sm ${getStatusColor(session.status)}`}>
                        {session.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm ${getConditionalClasses(darkMode, themeClasses.text.secondary.light, themeClasses.text.secondary.dark)}`}>
                        {formatDate(session.startTime)}
                      </div>
                      {session.duration && (
                        <div className={`text-sm font-medium ${getConditionalClasses(darkMode, themeClasses.text.primary.light, themeClasses.text.primary.dark)}`}>
                          {formatDuration(session.duration)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <Header />

        {/* Stats */}
        <Stats />

        {/* Start New Game */}
        <StartNewGame />

        {/* Previous Sessions */}
        {userData.sessions.length > 0 && (
          <PreviousSessions />
        )}
      </div>
    </div>
  );
} 