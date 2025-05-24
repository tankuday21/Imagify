import { FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

/**
 * Theme toggle button component
 */
const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <motion.button
      onClick={toggleDarkMode}
      className={`
        p-2 rounded-full transition-colors duration-300
        ${darkMode 
          ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
          : 'bg-amber-100 text-amber-600 hover:bg-amber-200'
        }
      `}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      data-testid="theme-toggle"
    >
      {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
    </motion.button>
  );
};

export default ThemeToggle;