"use client";

import { useState } from "react";
import { storage, UserData } from "../../utils/storage";
import { themeClasses, getConditionalClasses } from "../../utils/themeClasses";

type Props = {
  onLogin: (userData: UserData) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
};

export default function LoginScreen({
  onLogin,
  darkMode,
  toggleDarkMode,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      alert("Please fill in all fields");
      return;
    }

    const existingUser = storage.getUserByEmail(email);

    if (existingUser) {
      // User exists - show their sessions
      onLogin(existingUser);
    } else {
      // New user - create account
      const newUser: UserData = {
        name: name.trim(),
        email: email.trim(),
        sessions: [],
      };
      storage.saveUserData(newUser);
      onLogin(newUser);
    }
  };

  return (
    <div className="max-w-md mx-auto">
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

        <div
          className={`p-6 rounded-lg border ${getConditionalClasses(
            darkMode,
            "bg-white border-gray-300",
            "bg-gray-800 border-gray-600"
          )}`}
        >
          <h3
            className={`text-xl font-semibold mb-4 ${getConditionalClasses(
              darkMode,
              themeClasses.text.primary.light,
              themeClasses.text.primary.dark
            )}`}
          >
            Welcome to Memory Game
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${getConditionalClasses(
                  darkMode,
                  themeClasses.text.primary.light,
                  themeClasses.text.primary.dark
                )}`}
              >
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${getConditionalClasses(
                  darkMode,
                  themeClasses.text.primary.light,
                  themeClasses.text.primary.dark
                )}`}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                placeholder="Enter your email"
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full py-3 px-6 rounded-lg text-lg font-semibold transition-colors ${
                !name.trim() || !email.trim()
                  ? "opacity-50 cursor-not-allowed bg-gray-300 text-gray-900"
                  : getConditionalClasses(
                      darkMode,
                      themeClasses.button.primary.light,
                      themeClasses.button.primary.dark
                    )
              }`}
              disabled={!name.trim() || !email.trim()}
            >
              Register your game account
            </button>
          </form>

          <p
            className={`text-sm mt-4 ${getConditionalClasses(
              darkMode,
              themeClasses.text.secondary.light,
              themeClasses.text.secondary.dark
            )}`}
          >
            Enter your details to start playing. If you&apos;ve played before,
            we&apos;ll show your previous sessions.
          </p>
        </div>
      </div>
    </div>
  );
}
