import { useState, useCallback } from 'react';
import { processImage, formatFileSize } from '../services/imageService';

/**
 * Custom hook for handling image processing
 * @param {Object} options - Hook options
 * @param {Function} options.onSuccess - Success callback
 * @param {Function} options.onError - Error callback
 * @param {number} options.processingDelay - Delay between processing files in ms
 * @returns {Object} Image processing methods and state
 */
const useImageProcessing = ({
  onSuccess,
  onError,
  processingDelay = 300
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentFile, setCurrentFile] = useState('');

  /**
   * Process multiple images with the given settings
   * @param {Array} files - Array of files to process
   * @param {Object} settings - Processing settings
   * @param {string} settings.format - Target format
   * @param {number} settings.quality - Quality setting (0-100)
   * @returns {Promise<Array>} Array of processed files
   */
  const processImages = useCallback(async (files, settings) => {
    if (!files || files.length === 0) {
      console.log('useImageProcessing: No files to process');
      return [];
    }

    console.log('useImageProcessing: Starting to process', files.length, 'files with settings:', settings);
    setIsProcessing(true);
    setCurrentIndex(0);
    const processed = [];

    try {
      // Process each file sequentially
      for (let i = 0; i < files.length; i++) {
        setCurrentIndex(i);
        setCurrentFile(files[i].name);
        console.log(`useImageProcessing: Processing file ${i + 1}/${files.length}: ${files[i].name}`);

        // Process the file
        const result = await processImage(files[i], settings);
        console.log('useImageProcessing: File processed successfully:', result);
        processed.push(result);

        // Short delay for UI feedback
        if (processingDelay > 0) {
          await new Promise(resolve => setTimeout(resolve, processingDelay));
        }
      }

      console.log('useImageProcessing: All files processed:', processed);

      // Calculate total size savings
      const totalOriginalSize = processed.reduce((sum, file) => sum + file.originalSize, 0);
      const totalProcessedSize = processed.reduce((sum, file) => sum + file.processedSize, 0);
      const savedBytes = totalOriginalSize - totalProcessedSize;

      // Call success callback with results
      if (onSuccess) {
        if (savedBytes > 0) {
          const savedSizeFormatted = formatFileSize(savedBytes);
          onSuccess(processed, {
            savedBytes,
            savedSizeFormatted,
            fileCount: files.length,
            format: settings.format
          });
        } else {
          onSuccess(processed, {
            savedBytes: 0,
            fileCount: files.length,
            format: settings.format
          });
        }
      }

      return processed;
    } catch (error) {
      console.error('useImageProcessing: Error processing images:', error);
      if (onError) {
        onError(error);
      }
      return [];
    } finally {
      setIsProcessing(false);
    }
  }, [onSuccess, onError, processingDelay]);

  return {
    processImages,
    isProcessing,
    currentIndex,
    currentFile
  };
};

export default useImageProcessing;