'use client';

import { themeClasses, getConditionalClasses } from '../../utils/themeClasses';

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  onProceed: () => void;
  darkMode: boolean;
};

export default function ConfirmationModal({ isOpen, onCancel, onProceed, darkMode }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`max-w-md w-full mx-4 p-6 rounded-lg shadow-xl ${getConditionalClasses(darkMode, 'bg-white', 'bg-gray-800')}`}>
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className={`text-xl font-bold mb-2 ${getConditionalClasses(darkMode, themeClasses.text.primary.light, themeClasses.text.primary.dark)}`}>
            Stop Game?
          </h3>
          <p className={`text-sm mb-6 ${getConditionalClasses(darkMode, themeClasses.text.secondary.light, themeClasses.text.secondary.dark)}`}>
            Are you sure you want to stop the current game? Your progress will be lost and this will be recorded as a lost game.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${getConditionalClasses(darkMode, themeClasses.button.secondary.light, themeClasses.button.secondary.dark)}`}
            >
              Cancel
            </button>
            <button
              onClick={onProceed}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${getConditionalClasses(darkMode, 'bg-red-600 hover:bg-red-700 text-white', 'bg-red-500 hover:bg-red-600 text-white')}`}
            >
              Stop Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 