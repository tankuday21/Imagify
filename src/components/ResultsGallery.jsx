import { useState, useCallback, memo } from 'react';
import { FiDownload, FiMaximize2, FiX, FiEye, FiTrash2, FiImage } from 'react-icons/fi';
import PropTypes from 'prop-types';
import DetailedResult from './DetailedResult';
import { formatFileSize } from '../services/imageService';

/**
 * Component to display a gallery of processed image results
 *
 * @param {Object} props - Component props
 * @param {Array} props.processedFiles - Array of processed image files
 * @param {Function} props.onDownload - Function to download a single image
 * @param {Function} props.onDownloadAll - Function to download all images
 * @param {Function} props.onClearAll - Function to clear all processed images
 */
const ResultsGallery = ({ processedFiles, onDownload, onDownloadAll, onClearAll }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);

  // Debug logging
  console.log('ResultsGallery: Received processedFiles:', processedFiles);

  // Handler functions
  const openPreview = useCallback((file) => {
    setPreviewImage(file);
  }, []);

  const closePreview = useCallback(() => {
    setPreviewImage(null);
  }, []);

  const viewDetails = useCallback((result) => {
    setSelectedResult(result);
  }, []);

  const closeDetails = useCallback(() => {
    setSelectedResult(null);
  }, []);

  const handleViewDetails = useCallback((item) => {
    closePreview();
    viewDetails(item);
  }, [closePreview, viewDetails]);

  const handleDownloadAndClose = useCallback((index) => {
    onDownload(index);
    closePreview();
  }, [onDownload, closePreview]);

  // Empty state when no files are processed
  if (!processedFiles || !Array.isArray(processedFiles) || processedFiles.length === 0) {
    console.log('ResultsGallery: Showing empty state, processedFiles:', processedFiles);
    return (
      <div
        className="w-full flex flex-col items-center justify-center p-8 text-center bg-white/50 dark:bg-gray-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-gray-700/50 min-h-[250px]"
        data-testid="empty-results"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-50 dark:bg-indigo-900/30 mb-6">
          <FiImage size={40} className="text-indigo-400" />
        </div>
        <h3 className="text-2xl font-semibold text-slate-800 dark:text-white mb-3">
          No Processed Images Yet
        </h3>
        <p className="text-slate-600 dark:text-gray-300 mb-2 max-w-lg">
          Your converted and compressed images will appear here once you process them.
        </p>
        <p className="text-sm text-slate-500 dark:text-gray-400 max-w-lg">
          Upload some images and click "Convert & Compress" to get started!
        </p>
      </div>
    );
  }

  // If detailed view is open, show it
  if (selectedResult) {
    const resultIndex = processedFiles.findIndex(item => item === selectedResult);
    return (
      <DetailedResult
        result={selectedResult}
        onBack={closeDetails}
        onDownload={() => onDownload(resultIndex)}
      />
    );
  }

  console.log('ResultsGallery: Rendering gallery with', processedFiles.length, 'files');

  return (
    <div className="w-full min-h-[400px]">
      {/* Debug info */}
      <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900/20 rounded text-sm">
        <strong>ResultsGallery Debug:</strong> {processedFiles.length} files
        {processedFiles.length > 0 && (
          <div className="mt-1">Files: {processedFiles.map(f => f.name).join(', ')}</div>
        )}
      </div>

      {/* Header with file count and clear button */}
      <div className="mb-6 flex justify-between items-center">
        <div className="text-sm text-slate-500 dark:text-gray-400">
          Showing {processedFiles.length} {processedFiles.length === 1 ? 'result' : 'results'}
        </div>
        {processedFiles.length > 0 && (
          <button
            onClick={onClearAll}
            className="bg-red-500/90 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
            title="Clear all processed images"
            data-testid="clear-all-button"
          >
            <FiTrash2 className="mr-2" /> Clear All
          </button>
        )}
      </div>

      {/* Grid of results with proper sizing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full min-h-[300px]">
        {processedFiles.map((item, index) => {
          console.log('ResultsGallery: Rendering card for item:', item, 'at index:', index);
          return (
            <ResultCard
              key={`result-${index}`}
              item={item}
              index={index}
              onPreview={openPreview}
              onViewDetails={viewDetails}
              onDownload={onDownload}
            />
          );
        })}
      </div>

      {/* Full image preview modal */}
      {previewImage && (
        <PreviewModal
          previewImage={previewImage}
          processedFiles={processedFiles}
          onClose={closePreview}
          onViewDetails={handleViewDetails}
          onDownload={handleDownloadAndClose}
        />
      )}
    </div>
  );
};

/**
 * Individual result card component
 */
const ResultCard = memo(({ item, index, onPreview, onViewDetails, onDownload }) => {
  console.log('ResultCard: Rendering card for item:', item, 'index:', index);

  if (!item || !item.processedFile) {
    console.error('ResultCard: Invalid item received:', item);
    return <div className="p-4 bg-red-100 text-red-800 rounded">Invalid item data</div>;
  }

  const reductionPercent = Math.round(100 - (item.processedSize / item.originalSize * 100));
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <div
      className="group w-full min-h-[400px] flex flex-col bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 border border-slate-200/50 dark:border-gray-700/50"
      data-testid={`result-card-${index}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image preview section */}
      <div
        className="h-48 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 relative cursor-pointer overflow-hidden"
        onClick={() => onPreview(item)}
      >
        {/* Loading skeleton */}
        {!isImageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-indigo-100 dark:border-indigo-900/50 border-t-indigo-500 dark:border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Actual image */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <img
            src={item.processedPreview || URL.createObjectURL(item.processedFile)}
            alt={item.name}
            className={`w-full h-full object-contain transition-all duration-500 ease-in-out ${isHovered ? 'scale-105' : 'scale-100'}`}
            onLoad={() => setIsImageLoaded(true)}
          />
        </div>

        {/* Hover overlay with action button */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            className="bg-white/90 text-indigo-600 dark:bg-gray-800/90 dark:text-indigo-400 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all duration-200 transform hover:scale-110 border border-slate-200/50 dark:border-gray-700/50"
            title="View full image"
            aria-label="View full image"
            onClick={(e) => {
              e.stopPropagation();
              onPreview(item);
            }}
          >
            <FiMaximize2 size={20} />
          </button>
        </div>

        {/* Format badge */}
        <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-900/90 text-xs font-medium px-2 py-1 rounded-full border border-slate-200/50 dark:border-gray-700/50 backdrop-blur-sm">
          {item.format?.toUpperCase() || 'IMG'}
        </div>
      </div>

      {/* Card info section */}
      <div className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-slate-100 dark:border-gray-700/50 flex-1 flex flex-col">
        <div className="flex-1">
          <p className="font-semibold text-sm text-slate-800 dark:text-gray-200 truncate mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" title={item.name}>
            {item.name}
          </p>

          {/* File size comparison */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500 dark:text-gray-400 line-through">
                {formatFileSize(item.originalSize)}
              </span>
              <span className="text-slate-400 dark:text-gray-500 text-xs">→</span>
              <span className={`text-sm font-semibold ${reductionPercent > 0 ? 'text-green-600 dark:text-green-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
                {formatFileSize(item.processedSize)}
              </span>
            </div>

            {/* Size reduction badge */}
            {reductionPercent > 0 && (
              <div className="inline-flex items-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-[11px] font-medium px-2 py-0.5 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                {reductionPercent}% saved
              </div>
            )}
          </div>

          {/* Progress bar showing size reduction */}
          {reductionPercent > 0 && (
            <div className="w-full bg-slate-100 dark:bg-gray-700/50 rounded-full h-1.5 mb-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-green-400 h-full rounded-full"
                style={{ width: `${Math.min(reductionPercent, 100)}%` }}
              ></div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-gray-700/30 mt-3">
          <button
            className="flex-1 flex items-center justify-center text-slate-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm font-medium py-1.5 px-2 rounded-lg hover:bg-slate-100/70 dark:hover:bg-gray-700/50 transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(item);
            }}
            title="View details"
            aria-label="View image details"
          >
            <FiEye size={16} className="mr-1.5" /> Details
          </button>
          <button
            className="flex-1 flex items-center justify-center bg-indigo-600 text-white text-sm font-medium py-1.5 px-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 ml-2"
            onClick={(e) => {
              e.stopPropagation();
              onDownload(index);
            }}
            title="Download image"
            aria-label="Download image"
          >
            <FiDownload size={16} className="mr-1.5" /> Download
          </button>
        </div>
      </div>
    </div>
  );
});

/**
 * Modal for full-size image preview
 */
const PreviewModal = memo(({ previewImage, processedFiles, onClose, onViewDetails, onDownload }) => {
  const reductionPercent = Math.round(100 - (previewImage.processedSize / previewImage.originalSize * 100));
  const imageIndex = processedFiles.findIndex(f => f === previewImage);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-4 sm:p-6 animate-fade-in"
      onClick={onClose}
      data-testid="preview-modal"
    >
      <div
        className="relative w-full max-w-5xl h-[90vh] bg-white dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200/30 dark:border-gray-700/50 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black/30 dark:bg-white/20 text-white dark:text-gray-200 rounded-full p-2 hover:bg-black/50 dark:hover:bg-white/30 transition-colors z-10 backdrop-blur-sm"
          onClick={onClose}
          title="Close preview"
          aria-label="Close preview"
        >
          <FiX size={22} />
        </button>

        {/* Image container */}
        <div className="flex-1 overflow-hidden relative">
          {/* Loading spinner */}
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Image with fade-in effect */}
          <div className="w-full h-full flex items-center justify-center p-4">
            <img
              src={previewImage.processedPreview || URL.createObjectURL(previewImage.processedFile)}
              alt={previewImage.name}
              className={`max-w-full max-h-full object-contain transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setIsLoaded(true)}
            />
          </div>

          {/* Zoom controls */}
          <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
            <button
              className="bg-white/90 dark:bg-gray-800/90 text-slate-700 dark:text-gray-200 p-2 rounded-lg shadow-lg hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                const img = e.target.closest('.relative').querySelector('img');
                const currentScale = parseFloat(img.style.transform?.replace('scale(', '')?.replace(')', '')) || 1;
                img.style.transform = `scale(${Math.min(currentScale + 0.2, 3)})`;
              }}
              title="Zoom in"
              aria-label="Zoom in"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              className="bg-white/90 dark:bg-gray-800/90 text-slate-700 dark:text-gray-200 p-2 rounded-lg shadow-lg hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                const img = e.target.closest('.relative').querySelector('img');
                const currentScale = parseFloat(img.style.transform?.replace('scale(', '')?.replace(')', '')) || 1;
                img.style.transform = `scale(${Math.max(currentScale - 0.2, 0.5)})`;
              }}
              title="Zoom out"
              aria-label="Zoom out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              className="bg-white/90 dark:bg-gray-800/90 text-slate-700 dark:text-gray-200 p-2 rounded-lg shadow-lg hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                const img = e.target.closest('.relative').querySelector('img');
                img.style.transform = 'scale(1)';
              }}
              title="Reset zoom"
              aria-label="Reset zoom"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Image info and actions */}
        <div className="p-4 sm:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-slate-200/30 dark:border-gray-700/50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-center sm:text-left">
              <p className="font-semibold text-slate-800 dark:text-gray-200 text-lg truncate max-w-xs sm:max-w-md" title={previewImage.name}>
                {previewImage.name}
              </p>
              <div className="flex items-center justify-center sm:justify-start space-x-2 text-sm text-slate-600 dark:text-gray-400 mt-1">
                <span className="line-through">{formatFileSize(previewImage.originalSize)}</span>
                <span>→</span>
                <span className={`font-medium ${reductionPercent > 0 ? 'text-green-600 dark:text-green-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
                  {formatFileSize(previewImage.processedSize)}
                </span>
                {reductionPercent > 0 && (
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium px-2 py-0.5 rounded-full">
                    {reductionPercent}% smaller
                  </span>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex space-x-2 sm:space-x-3 mt-3 sm:mt-0">
              <button
                className="bg-slate-200/70 dark:bg-gray-700/70 text-slate-700 dark:text-gray-200 px-4 py-2.5 rounded-lg hover:bg-slate-300/90 dark:hover:bg-gray-600/80 transition-colors flex items-center text-sm font-medium shadow-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(previewImage);
                }}
                aria-label="View image details"
              >
                <FiEye className="mr-1.5" /> Details
              </button>
              <button
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center text-sm font-medium shadow-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(imageIndex);
                }}
                aria-label="Download image"
              >
                <FiDownload className="mr-2" /> Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// PropTypes
ResultsGallery.propTypes = {
  processedFiles: PropTypes.array.isRequired,
  onDownload: PropTypes.func.isRequired,
  onDownloadAll: PropTypes.func.isRequired,
  onClearAll: PropTypes.func.isRequired
};

ResultCard.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onPreview: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired
};

ResultCard.displayName = 'ResultCard';

PreviewModal.propTypes = {
  previewImage: PropTypes.object.isRequired,
  processedFiles: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired
};

PreviewModal.displayName = 'PreviewModal';

export default memo(ResultsGallery);
