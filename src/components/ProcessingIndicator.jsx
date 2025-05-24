import { useEffect, useState } from 'react';
import { FiRefreshCw, FiImage, FiCpu, FiCheckCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ProcessingIndicator = ({ current, total, currentFile }) => {
  const [processingStage, setProcessingStage] = useState('preparing');
  const percentage = Math.round((current / total) * 100);
  const { darkMode } = useTheme();
  
  // Simulate processing stages for better UX
  useEffect(() => {
    if (current > 0) {
      setProcessingStage('preparing');
      
      const stageTiming = setTimeout(() => {
        setProcessingStage('analyzing');
        
        const convertTiming = setTimeout(() => {
          setProcessingStage('converting');
          
          const finalizeTiming = setTimeout(() => {
            setProcessingStage('finalizing');
          }, 800);
          
          return () => clearTimeout(finalizeTiming);
        }, 600);
        
        return () => clearTimeout(convertTiming);
      }, 400);
      
      return () => clearTimeout(stageTiming);
    }
  }, [current]);

  // Icon variants for animation
  const iconVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      rotate: 0,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      rotate: 10,
      transition: { duration: 0.2 }
    }
  };

  // Get the appropriate icon based on processing stage
  const getStageIcon = () => {
    switch (processingStage) {
      case 'preparing':
        return (
          <motion.div
            key="preparing"
            variants={iconVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <FiImage className={`${darkMode ? 'text-indigo-400' : 'text-indigo-600'} text-4xl`} />
          </motion.div>
        );
      case 'analyzing':
        return (
          <motion.div
            key="analyzing"
            variants={iconVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <FiCpu className={`${darkMode ? 'text-indigo-400' : 'text-indigo-600'} text-4xl`} />
          </motion.div>
        );
      case 'converting':
      case 'finalizing':
        return (
          <motion.div
            key="converting"
            variants={iconVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            >
              <FiRefreshCw className={`${darkMode ? 'text-indigo-400' : 'text-indigo-600'} text-4xl`} />
            </motion.div>
          </motion.div>
        );
      default:
        return (
          <motion.div
            key="default"
            variants={iconVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <FiCheckCircle className={`${darkMode ? 'text-green-400' : 'text-green-600'} text-4xl`} />
          </motion.div>
        );
    }
  };

  // Get the stage message
  const getStageMessage = () => {
    switch (processingStage) {
      case 'preparing':
        return 'Preparing image...';
      case 'analyzing':
        return 'Analyzing image...';
      case 'converting':
        return 'Converting format...';
      case 'finalizing':
        return 'Finalizing...';
      default:
        return 'Processing complete';
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className={`
          rounded-xl p-8 w-80 shadow-2xl
          ${darkMode 
            ? 'bg-gray-900 border border-gray-700' 
            : 'bg-white'
          }
        `}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        <div className="flex justify-center mb-6">
          <div className="relative">
            <AnimatePresence mode="wait">
              {getStageIcon()}
            </AnimatePresence>
            
            <motion.div 
              className={`
                absolute -top-1 -right-1 w-3 h-3 rounded-full
                ${darkMode ? 'bg-indigo-400' : 'bg-indigo-600'}
              `}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [1, 0.7, 1]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            />
          </div>
        </div>
        
        <motion.h3 
          className={`
            text-xl font-semibold text-center mb-5
            ${darkMode ? 'text-white' : 'text-gray-900'}
          `}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Processing Images
        </motion.h3>
        
        <motion.div 
          className={`
            mb-2 flex justify-between text-sm
            ${darkMode ? 'text-gray-400' : 'text-gray-600'}
          `}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span>Progress</span>
          <span>{percentage}%</span>
        </motion.div>
        
        <div className={`
          w-full rounded-full h-3 mb-5 overflow-hidden
          ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}
        `}>
          <motion.div 
            className={`
              h-3 rounded-full
              ${darkMode 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600' 
                : 'bg-gradient-to-r from-indigo-500 to-purple-500'
              }
            `}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <AnimatePresence mode="wait">
            <motion.p 
              key={processingStage}
              className={`
                font-medium text-center
                ${darkMode ? 'text-white' : 'text-gray-900'}
              `}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {getStageMessage()}
            </motion.p>
          </AnimatePresence>
          
          <p className={`
            text-center mt-2 text-sm truncate
            ${darkMode ? 'text-gray-400' : 'text-gray-500'}
          `}>
            {currentFile ? currentFile : `Image ${current} of ${total}`}
          </p>
        </motion.div>
        
        <motion.div 
          className={`
            mt-6 text-xs text-center
            ${darkMode ? 'text-gray-500' : 'text-gray-400'}
          `}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Please wait while we process your images locally
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ProcessingIndicator;