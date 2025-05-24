import { useState, useCallback, lazy, Suspense, useEffect } from 'react';
import './App.css';
import {
  FiDownload,
  FiSettings,
  FiImage,
  FiCheckCircle,
  FiZap,
  FiLayers,
  FiTrash2,
  FiX
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Dropzone from './components/Dropzone';
import ImagePreview from './components/ImagePreview';
import Header from './components/Header';
import SettingsPanel from './components/SettingsPanel';
import ProcessingIndicator from './components/ProcessingIndicator';
import ErrorBoundary from './components/ErrorBoundary';
import BrowserCompatibility from './components/BrowserCompatibility';
import { NotificationContainer } from './components/Notification';
import AnimatedBackground from './components/AnimatedBackground';
import SuccessConfetti from './components/SuccessConfetti';
import CursorFollower from './components/CursorFollower';
import { downloadImage, downloadAllImages } from './services/imageService';
import useNotifications from './hooks/useNotifications';
import useImageProcessing from './hooks/useImageProcessing';
import { useTheme } from './context/ThemeContext';

// Constants
const DEFAULT_FORMAT = 'jpg';
const DEFAULT_QUALITY = 80;
const PROCESSING_DELAY = 300; // ms
const TEST_IMAGES = [
  '/test-image-1.png',
  '/test-image-2.png',
  '/test-image-3.png'
];

// Lazy load components that aren't needed on initial render
const ResultsGallery = lazy(() => import('./components/ResultsGallery'));

/**
 * Main application component
 */
function App() {
    // State management with better organization
  const [files, setFiles] = useState([]);
  const [processedFiles, setProcessedFiles] = useState([]);
  const [format, setFormat] = useState(DEFAULT_FORMAT);
  const [quality, setQuality] = useState(DEFAULT_QUALITY);
  const [showConfetti, setShowConfetti] = useState(false);
  const [conversionInProgress, setConversionInProgress] = useState(false);


  // Advanced settings state - matches SettingsPanel structure
  const [advancedSettings, setAdvancedSettings] = useState({
    resize: null,
    watermark: null,
    filter: null,
    rotation: null,
    flip: null,
    batchRename: null
  });

  // Use our custom notifications hook
  const {
    notifications,
    removeNotification,
    success,
    error,
    info
  } = useNotifications();

  /**
   * Handle successful image processing
   * @param {Array} processed - Processed files
   * @param {Object} stats - Processing statistics
   */
  const handleProcessingSuccess = useCallback((processed, stats) => {
    console.log('App.jsx: Processing success, processed files:', processed);
    setProcessedFiles(processed);

    // Trigger confetti animation on successful processing
    setShowConfetti(true);

    // Reset confetti trigger after a delay
    setTimeout(() => {
      setShowConfetti(false);
    }, 2500);

    if (stats.savedBytes > 0) {
      success(
        `Processed ${stats.fileCount} image${stats.fileCount !== 1 ? 's' : ''} and saved ${stats.savedSizeFormatted}!`
      );
    } else {
      success(
        `Successfully converted ${stats.fileCount} image${stats.fileCount !== 1 ? 's' : ''} to ${stats.format.toUpperCase()} format`
      );
    }
  }, [success]);

  /**
   * Handle image processing error
   * @param {Error} err - Error object
   */
  const handleProcessingError = useCallback(() => {
    error('Error processing images. Please try again or check file types.');
  }, [error]);

  // Use our custom image processing hook
  const {
    processImages,
    isProcessing,
    currentIndex: currentProcessingIndex,
    currentFile: currentProcessingFile
  } = useImageProcessing({
    onSuccess: handleProcessingSuccess,
    onError: handleProcessingError,
    processingDelay: PROCESSING_DELAY
  });

  // Sync conversionInProgress with isProcessing
  useEffect(() => {
    setConversionInProgress(isProcessing);
  }, [isProcessing]);

  /**
   * Handle files added to the dropzone
   * @param {Array} newFiles - Array of new files
   */
  const handleFilesAdded = useCallback((newFiles) => {
    if (!newFiles || newFiles.length === 0) return;

    setFiles(prevFiles => {
      const updatedFiles = [...prevFiles, ...newFiles];
      console.log('App.jsx: Files after adding:', updatedFiles);
      return updatedFiles;
    });
    success(`Added ${newFiles.length} image${newFiles.length !== 1 ? 's' : ''}`);
  }, [success]);

  /**
   * Remove a file by index
   * @param {number} index - File index
   */
  const handleRemoveFile = useCallback((index) => {
    console.log('App.jsx: Removing file at index:', index);
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    // Only remove from processed files if it exists at that index
    setProcessedFiles(prevProcessed => {
      if (prevProcessed.length > index) {
        return prevProcessed.filter((_, i) => i !== index);
      }
      return prevProcessed;
    });
  }, []);

  /**
   * Clear all files
   */
  const handleClearAllFiles = useCallback(() => {
    console.log('App.jsx: Clearing all selected files');
    setFiles([]);
    info('Cleared all selected images');
  }, [info]);

  /**
   * Handle format change
   * @param {Object} e - Event object
   */
  const handleFormatChange = useCallback((e) => {
    setFormat(e.target.value);
  }, []);

  /**
   * Handle quality change
   * @param {Object} e - Event object
   */
  const handleQualityChange = useCallback((e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setQuality(value);
    }
  }, []);

  /**
   * Handle changes to advanced settings
   * @param {Object} settings - Advanced settings object
   */
  const handleAdvancedSettingsChange = useCallback((settings) => {
    setAdvancedSettings(settings);
  }, []);

  /**
   * Process all images with current settings
   */
  const handleProcessImages = useCallback(async () => {
    if (files.length === 0) return;

    console.log('App.jsx: Starting image processing with files:', files);
    const result = await processImages(files, {
      format,
      quality,
      ...advancedSettings
    });
    console.log('App.jsx: Processing completed, result:', result);
    setFiles([]); // Clear selected files after processing
  }, [files, format, quality, advancedSettings, processImages]);

  /**
   * Download all processed images
   */
  const handleDownloadAll = useCallback(() => {
    if (processedFiles.length === 0) return;

    try {
      downloadAllImages(processedFiles);
      success('Downloading all images');
    } catch (err) {
      console.error('Failed to download images:', err);
      error('Error downloading images');
    }
  }, [processedFiles, success, error]);

  /**
   * Download a single processed image
   * @param {number} index - Image index
   */
  const handleDownloadSingle = useCallback((index) => {
    if (!processedFiles[index]) return;

    try {
      downloadImage(processedFiles[index].processedFile);
      success(`Downloading ${processedFiles[index].name}`);
    } catch (err) {
      console.error('Failed to download image:', err);
      error('Error downloading image');
    }
  }, [processedFiles, success, error]);

  /**
   * Clear all processed files
   */
  const handleClearProcessedFiles = useCallback(() => {
    console.log('App.jsx: Clearing all processed files');
    setProcessedFiles([]);
    info('Cleared all processed images.');
  }, [info]);

  /**
   * Load test images
   * @param {Event} e - Event object
   */
  const handleLoadTestImages = useCallback(async (e) => {
    e.preventDefault();

    try {
      const loadedFiles = await Promise.all(TEST_IMAGES.map(async (path) => {
        try {
          const response = await fetch(path);
          const blob = await response.blob();
          return new File([blob], path.split('/').pop(), { type: blob.type });
        } catch (err) {
          console.error(`Failed to load test image: ${path}`, err);
          return null;
        }
      }));

      const validFiles = loadedFiles.filter(file => file !== null);
      if (validFiles.length > 0) {
        handleFilesAdded(validFiles);
      } else {
        error('Failed to load test images');
      }
    } catch (err) {
      console.error('Error loading test images:', err);
      error('Failed to load test images');
    }
  }, [handleFilesAdded, error]);

  // emptyResultsState is no longer needed as ResultsGallery handles its own empty state.
  // const emptyResultsState = useMemo(() => (
  //   <div className="p-8 text-center text-gray-500">
  //     <p>Your processed images will appear here</p>
  //   </div>
  // ), []);

  const { darkMode } = useTheme();

  // Debug effect to track processedFiles changes
  useEffect(() => {
    console.log('App.jsx: processedFiles state changed:', processedFiles);
  }, [processedFiles]);

  return (
    <div className="min-h-screen relative overflow-hidden transition-colors duration-300">
      <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-gray-50 to-blue-50 text-gray-800'}`}>
        <AnimatedBackground />

        {/* Background pattern */}
        <div className={`absolute inset-0 bg-dot-pattern ${darkMode ? 'opacity-10' : 'opacity-30'} z-0`}></div>

        {/* Toast notifications */}
        <Toaster position="top-center" toastOptions={{
          style: {
            background: darkMode ? '#1f2937' : '#ffffff',
            color: darkMode ? '#fff' : '#111827',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          },
          duration: 3000,
        }} />

        <Header />

        <main className="max-w-[1400px] mx-auto px-6 lg:px-8 xl:px-12 py-12 relative z-10">
          <BrowserCompatibility />

          {/* Enhanced Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-20 lg:mb-24"
          >
            

            

            
            
          </motion.div>

          <div className="max-w-full mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 mb-16 lg:mb-20">
              {/* Upload Section */}
              <ErrorBoundary>
                <motion.section
                  className="lg:col-span-4 space-y-8"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Dropzone onFilesAdded={handleFilesAdded} />

                  {files.length > 0 && (
                    <motion.div
                      className="glass-card-enhanced rounded-3xl p-8 lg:p-10 transition-all duration-300 hover:shadow-2xl border border-white/20 dark:border-gray-700/30"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <motion.h3
                        className="text-xl font-bold flex items-center text-gray-800 dark:text-white"
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <FiLayers className="mr-2 text-blue-500" />
                        Selected Images ({files.length})
                      </motion.h3>

                      {files.length > 1 && (
                        <motion.button
                          className={`
                            px-3 py-1.5 text-sm rounded-lg transition-all flex items-center
                            ${darkMode
                              ? 'text-red-400 hover:bg-red-900/30 hover:text-red-300'
                              : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                            }
                          `}
                          onClick={handleClearAllFiles}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <FiX className="mr-1" /> Clear All
                        </motion.button>
                      )}
                    </div>

                    <motion.div
                      className="grid grid-cols-2 gap-4"
                      data-testid="selected-images-grid"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2, staggerChildren: 0.1 }}
                    >
                      {files.map((file, index) => (
                        <motion.div
                          key={`${file.name}-${index}`}
                          className="relative group"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: index * 0.05,
                            type: 'spring',
                            stiffness: 100
                          }}
                          whileHover={{ scale: 1.02, zIndex: 10 }}
                        >
                          <ImagePreview
                            file={file}
                            converted={processedFiles[index]}
                            originalSize={file.size}
                            convertedSize={processedFiles[index]?.processedSize}
                            onRemove={() => handleRemoveFile(index)}
                            onDownload={() => processedFiles[index] && handleDownloadSingle(index)}
                          />
                          {processedFiles[index] && (
                            <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                              <FiCheckCircle size={14} />
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </motion.div>
                </motion.div>
              )}
            </motion.section>
          </ErrorBoundary>

          {/* Options Section */}
          <ErrorBoundary>
            <motion.section
              className="lg:col-span-8 space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="glass-card-enhanced rounded-3xl p-10 lg:p-12 xl:p-14 transition-all duration-300 hover:shadow-2xl border border-white/20 dark:border-gray-700/30">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center text-gray-800 dark:text-white">
                      <FiSettings className="mr-2 text-blue-500" /> Conversion Settings
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Customize your image conversion settings
                    </p>
                  </div>
                  <motion.button
                    onClick={handleProcessImages}
                    disabled={files.length === 0 || conversionInProgress}
                    className={`
                      btn-primary-enhanced px-8 py-4 text-lg font-bold
                      ${files.length === 0 || conversionInProgress
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:shadow-glow-lg'
                      }
                    `}
                    whileHover={files.length > 0 && !conversionInProgress ? { scale: 1.05, y: -2 } : {}}
                    whileTap={files.length > 0 && !conversionInProgress ? { scale: 0.98 } : {}}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    {conversionInProgress ? (
                      <span className="flex items-center">
                        <div className="loading-spinner w-5 h-5 mr-3" />
                        Processing Magic...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <FiZap className="mr-3" size={20} />
                        Transform Images
                      </span>
                    )}
                  </motion.button>
                </div>

                <SettingsPanel
                  format={format}
                  quality={quality}
                  onFormatChange={handleFormatChange}
                  onQualityChange={handleQualityChange}
                  onProcessImages={handleProcessImages}
                  onAdvancedSettingsChange={handleAdvancedSettingsChange}
                  isProcessing={conversionInProgress}
                  hasFiles={files.length > 0}
                />
              </div>
            </motion.section>
          </ErrorBoundary>
            </div>

            {/* Results Section - Full width outside the grid */}
            <ErrorBoundary>
              <motion.section
                className="glass-card-enhanced flex flex-col items-stretch w-full rounded-4xl shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700/30"
                data-testid="results-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
              {/* Enhanced modern header with gradient accent */}
              <div className={`relative ${darkMode ? 'bg-gradient-to-r from-primary-900/30 to-secondary-900/30' : 'bg-gradient-to-r from-primary-50/80 to-secondary-50/80'} px-8 py-6`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500"></div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  {/* Title with animated icon */}
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 dark:bg-white/10 mr-4">
                      <motion.div
                        animate={{
                          rotate: processedFiles.length ? [0, 10, 0, -10, 0] : 0,
                          scale: processedFiles.length ? [1, 1.1, 1] : 1
                        }}
                        transition={{
                          repeat: processedFiles.length ? Infinity : 0,
                          repeatDelay: 4,
                          duration: 1.5
                        }}
                      >
                        <FiImage className={`text-xl ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`} />
                      </motion.div>
                    </div>
                    <div>
                      <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                        Processed Images
                      </h2>
                      <p className={`text-sm ${darkMode ? 'text-indigo-200/70' : 'text-indigo-700/70'}`}>
                        {processedFiles.length > 0
                          ? `${processedFiles.length} ${processedFiles.length === 1 ? 'image' : 'images'} ready to download`
                          : 'Your processed images will appear here'}
                      </p>
                    </div>
                  </div>

                  {/* Enhanced action buttons */}
                  {processedFiles.length > 0 && (
                    <div className="flex items-center space-x-4">
                      <motion.button
                        className={`
                          px-4 py-2 rounded-xl text-sm font-medium flex items-center
                          backdrop-blur-sm border transition-all duration-300
                          ${darkMode
                            ? 'bg-gray-800/50 border-gray-600/50 text-gray-300 hover:bg-gray-700/60 hover:border-gray-500/60'
                            : 'bg-white/50 border-gray-300/50 text-gray-700 hover:bg-white/70 hover:border-gray-400/60'
                          }
                          hover:shadow-lg transform hover:-translate-y-0.5
                        `}
                        onClick={handleClearProcessedFiles}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        data-testid="clear-all-button"
                      >
                        <FiTrash2 className="mr-2" size={16} /> Clear All
                      </motion.button>

                      <motion.button
                        className="btn-primary-enhanced px-6 py-2 text-sm font-bold"
                        onClick={handleDownloadAll}
                        whileHover={{ scale: 1.05, y: -1 }}
                        whileTap={{ scale: 0.95 }}
                        data-testid="download-all-button"
                      >
                        <FiDownload className="mr-2" size={16} /> Download All
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>

              {/* Gallery content with improved loading state */}
              <div className="p-4 sm:p-6">

                <Suspense fallback={
                  <div className="p-8 flex flex-col items-center justify-center min-h-[300px]">
                    <div className="relative w-16 h-16 mb-4">
                      <motion.div
                        className="absolute inset-0 rounded-full border-4 border-indigo-200 dark:border-indigo-900/30"
                        initial={{ opacity: 0.2 }}
                        animate={{ opacity: 0.8 }}
                        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-full border-t-4 border-indigo-600 dark:border-indigo-400"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      />
                    </div>
                    <p className={`text-lg font-medium ${darkMode ? 'text-indigo-200' : 'text-indigo-700'}`}>
                      Loading gallery...
                    </p>
                    <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Preparing your processed images
                    </p>
                  </div>
                }>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={processedFiles.length > 0 ? "results-gallery" : "empty-gallery-state"}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4 }}
                      className="w-full"
                    >
                      {/* Empty state when no processed files */}
                      {processedFiles.length === 0 ? (
                        <motion.div
                          className="flex flex-col items-center justify-center text-center py-16 px-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${darkMode ? 'bg-indigo-900/30' : 'bg-indigo-50'}`}>
                            <FiImage size={40} className={darkMode ? 'text-indigo-300' : 'text-indigo-400'} />
                          </div>
                          <h3 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            No Processed Images Yet
                          </h3>
                          <p className={`max-w-md ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Upload your images and click "Convert Now" to see your processed images appear here.
                          </p>
                          <div className="flex flex-col gap-3 mt-6">
                            <motion.button
                              className={`px-5 py-2 rounded-full text-sm font-medium ${darkMode ? 'bg-indigo-800/50 text-indigo-200 hover:bg-indigo-700/50' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'} transition-colors`}
                              onClick={handleLoadTestImages}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Try with sample images
                            </motion.button>

                            <motion.button
                              className={`px-5 py-2 rounded-full text-sm font-medium ${darkMode ? 'bg-green-800/50 text-green-200 hover:bg-green-700/50' : 'bg-green-100 text-green-700 hover:bg-green-200'} transition-colors`}
                              onClick={() => {
                                // Create a mock processed file for testing
                                const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
                                const mockProcessed = {
                                  originalFile: mockFile,
                                  processedFile: mockFile,
                                  originalSize: 1000000,
                                  processedSize: 500000,
                                  name: 'test-image.jpg',
                                  originalPreview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk9yaWdpbmFsPC90ZXh0Pjwvc3ZnPg==',
                                  processedPreview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlByb2Nlc3NlZDwvdGV4dD48L3N2Zz4=',
                                  originalDimensions: { width: 800, height: 600 },
                                  compressionRate: 50,
                                  format: 'jpg',
                                  quality: 80
                                };
                                console.log('Adding mock processed file:', mockProcessed);
                                setProcessedFiles([mockProcessed]);
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Test with mock data
                            </motion.button>
                          </div>
                        </motion.div>
                      ) : (
                        <>
                          {console.log('App.jsx: Rendering ResultsGallery with processedFiles:', processedFiles)}
                          <ResultsGallery
                            processedFiles={processedFiles}
                            onDownload={handleDownloadSingle}
                            onDownloadAll={handleDownloadAll}
                            onClearAll={handleClearProcessedFiles}
                          />
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </Suspense>
              </div>
            </motion.section>
          </ErrorBoundary>
          </div>
        </main>

        {/* Enhanced Footer */}
        <motion.footer
          className={`mt-20 text-center pb-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="max-w-4xl mx-auto px-4">
            {/* Tech stack badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {['React', 'Tailwind CSS', 'Framer Motion', 'Browser API'].map((tech) => (
                <motion.span
                  key={tech}
                  className={`
                    px-3 py-1 rounded-full text-xs font-medium
                    ${darkMode
                      ? 'bg-gray-800/50 text-gray-300 border border-gray-700/50'
                      : 'bg-gray-100/70 text-gray-600 border border-gray-200/50'
                    }
                    backdrop-blur-sm
                  `}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>

            {/* Privacy message */}
            <motion.div
              className={`
                glass-card-enhanced rounded-2xl p-6 mb-6 border border-white/20 dark:border-gray-700/30
                ${darkMode ? 'text-gray-300' : 'text-gray-600'}
              `}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="flex items-center justify-center mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg">100% Private & Secure</h3>
              </div>
              <p className="text-sm leading-relaxed">
                All image processing happens locally in your browser. Your images never leave your device,
                ensuring complete privacy and security for your sensitive content.
              </p>
            </motion.div>

            {/* Sample images CTA */}
            <motion.button
              className="btn-primary-enhanced px-6 py-3 text-sm font-bold"
              onClick={handleLoadTestImages}
              data-testid="load-test-images"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              🎨 Try with Sample Images
            </motion.button>

            {/* Copyright */}
            <p className="mt-8 text-xs opacity-75">
              © 2024 Imagify. Built with ❤️ for the web.
            </p>
          </div>
        </motion.footer>

        {/* Processing Indicator */}
        <AnimatePresence>
          {isProcessing && (
            <ProcessingIndicator
              current={currentProcessingIndex + 1}
              total={files.length}
              currentFile={currentProcessingFile}
            />
          )}
        </AnimatePresence>

        {/* Success Confetti */}
        <SuccessConfetti trigger={showConfetti} />

        {/* Notifications */}
        <NotificationContainer
          notifications={notifications}
          removeNotification={removeNotification}
        />

        {/* Global Cursor Follower */}
        <CursorFollower />
      </div>
    </div>
  );
}

export default App;
