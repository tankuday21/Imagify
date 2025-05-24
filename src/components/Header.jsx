import { FiImage, FiZap, FiStar, FiShield } from 'react-icons/fi';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
  const { darkMode } = useTheme();

  return (
    <header className="mb-16 pt-8 text-center relative">
      {/* Theme toggle positioned in the top right */}
      <div className="absolute right-4 top-4 z-20">
        <ThemeToggle />
      </div>

      {/* Enhanced logo and title section */}
      <motion.div
        className="flex items-center justify-center mb-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="relative mr-4"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Glow effect behind icon */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full blur-xl opacity-30 animate-pulse" />

          {/* Main icon container */}
          <div className={`
            relative bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-5
            rounded-2xl shadow-2xl border border-white/20
            backdrop-blur-sm
          `}>
            <FiImage size={32} />
          </div>

          {/* Decorative elements */}
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 bg-accent-400 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        <div className="text-left">
          <motion.h1
            className="text-6xl md:text-7xl font-black leading-none"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-500 relative">
              Imagify
              {/* Underline decoration */}
              <motion.div
                className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.8 }}
              />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className={`text-lg mt-3 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            
          </motion.p>
        </div>
      </motion.div>

      {/* Enhanced description */}
      <motion.p
        className={`max-w-3xl mx-auto text-xl leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        Transform your images with our{' '}
        <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
          lightning-fast
        </span>
        {' '}conversion tools. Convert, compress, and enhance with{' '}
        <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-secondary-600 to-accent-500">
          professional quality
        </span>
        {' '}— all processed locally in your browser.
      </motion.p>

      {/* Enhanced feature badges */}
      <motion.div
        className="flex flex-wrap justify-center gap-4 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        {[
          {
            icon: FiZap,
            text: 'Lightning Fast',
            color: 'blue',
            description: 'Instant processing'
          },
          {
            icon: FiShield,
            text: 'Privacy First',
            color: 'purple',
            description: 'Local processing'
          },
          {
            icon: FiStar,
            text: 'Pro Quality',
            color: 'orange',
            description: 'Professional results'
          }
        ].map((feature, index) => (
          <motion.div
            key={feature.text}
            className={`
              group relative flex items-center px-6 py-3 rounded-2xl
              backdrop-blur-sm border transition-all duration-300
              ${darkMode
                ? `bg-${feature.color}-900/20 border-${feature.color}-700/30 hover:bg-${feature.color}-900/30 hover:border-${feature.color}-600/50`
                : `bg-${feature.color}-50/70 border-${feature.color}-200/50 hover:bg-${feature.color}-100/80 hover:border-${feature.color}-300/60`
              }
              shadow-lg hover:shadow-xl transform hover:-translate-y-1
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
          >
            {/* Glow effect on hover */}
            <div className={`
              absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
              bg-gradient-to-r from-${feature.color}-500/10 to-${feature.color}-600/10 blur-xl
            `} />

            <div className="relative flex items-center space-x-3">
              <div className={`
                p-2 rounded-xl
                ${darkMode
                  ? `bg-${feature.color}-600/20 text-${feature.color}-400`
                  : `bg-${feature.color}-500/10 text-${feature.color}-600`
                }
              `}>
                <feature.icon size={20} />
              </div>

              <div className="text-left">
                <div className={`
                  font-semibold text-sm
                  ${darkMode ? `text-${feature.color}-300` : `text-${feature.color}-700`}
                `}>
                  {feature.text}
                </div>
                <div className={`
                  text-xs opacity-75
                  ${darkMode ? 'text-gray-400' : 'text-gray-600'}
                `}>
                  {feature.description}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </header>
  );
};

export default Header;
