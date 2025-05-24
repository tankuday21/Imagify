import React from 'react';
import { motion } from 'framer-motion';
import { FiMouse, FiZap, FiStar } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

/**
 * Demo component to showcase cursor follower functionality
 * This component can be temporarily added to test the cursor follower
 */
const CursorFollowerDemo = () => {
  const { darkMode } = useTheme();

  return (
    <motion.div
      className={`
        fixed bottom-4 right-4 p-6 rounded-2xl backdrop-blur-sm border z-50
        ${darkMode 
          ? 'bg-gray-900/80 border-gray-700/50 text-white' 
          : 'bg-white/80 border-gray-200/50 text-gray-800'
        }
        shadow-2xl max-w-sm
      `}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 1 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`
          p-2 rounded-xl
          ${darkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-500/10 text-blue-600'}
        `}>
          <FiMouse size={20} />
        </div>
        <h3 className="font-bold text-lg">Cursor Follower Active!</h3>
      </div>
      
      <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        Move your mouse around to see the smooth cursor animation in action.
      </p>
      
      <div className="space-y-3">
        <motion.button
          className="cursor-hover w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FiZap className="inline mr-2" />
          Hover me!
        </motion.button>
        
        <motion.button
          className="cursor-hover w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FiStar className="inline mr-2" />
          Click me!
        </motion.button>
      </div>
      
      <div className={`mt-4 p-3 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100/50'}`}>
        <p className="text-xs opacity-75">
          ✨ Features: Smooth tracking, hover effects, click animations, and theme integration
        </p>
      </div>
    </motion.div>
  );
};

export default CursorFollowerDemo;
