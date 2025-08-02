// utils/storage.ts

export interface UserData {
  name: string;
  email: string;
  sessions: GameSession[];
}

export interface GameSession {
  gameNumber: number;
  startTime: string;
  endTime?: string;
  duration?: number; // in seconds
  status: GameStatus;
  boardSize: number;
}

export type GameStatus = "completed" | "lost" | "in-progress";

// Storage keys
const USER_DATA_KEY = "memory_game_user_data";
const CURRENT_SESSION_KEY = "memory_game_current_session";

// User data management
export const storage = {
  // Save user data to localStorage
  saveUserData: (userData: UserData): void => {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  },

  // Get user data from localStorage
  getUserData: (): UserData | null => {
    const data = localStorage.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  },

  // Check if user exists by email
  getUserByEmail: (email: string): UserData | null => {
    const userData = storage.getUserData();
    return userData && userData.email === email ? userData : null;
  },

  // Add new session to user data
  addSession: (session: GameSession): void => {
    const userData = storage.getUserData();
    if (userData) {
      userData.sessions.push(session);
      storage.saveUserData(userData);
    }
  },

  // Update current session
  updateCurrentSession: (session: Partial<GameSession>): void => {
    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session));
  },

  // Get current session
  getCurrentSession: (): Partial<GameSession> | null => {
    const data = localStorage.getItem(CURRENT_SESSION_KEY);
    return data ? JSON.parse(data) : null;
  },

  // Clear current session
  clearCurrentSession: (): void => {
    localStorage.removeItem(CURRENT_SESSION_KEY);
  },

  // Get next game number for user
  getNextGameNumber: (email: string): number => {
    const userData = storage.getUserByEmail(email);
    if (!userData) return 1;
    return userData.sessions.length + 1;
  },

  // Complete a session
  completeSession: (
    endTime: string,
    duration: number,
    status: "completed" | "lost"
  ): void => {
    const currentSession = storage.getCurrentSession();
    const userData = storage.getUserData();

    if (currentSession && userData) {
      const completedSession: GameSession = {
        ...(currentSession as GameSession),
        endTime,
        duration,
        status,
      };

      // Update the session in user data
      const sessionIndex = userData.sessions.findIndex(
        (s) => s.gameNumber === completedSession.gameNumber
      );

      if (sessionIndex !== -1) {
        userData.sessions[sessionIndex] = completedSession;
      } else {
        userData.sessions.push(completedSession);
      }

      storage.saveUserData(userData);
      storage.clearCurrentSession();
    }
  },
};
