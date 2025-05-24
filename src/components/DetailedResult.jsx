import { useState } from 'react';
import { FiDownload, FiArrowLeft, FiMaximize2, FiMinimize2, FiZoomIn, FiZoomOut, FiRotateCw, FiZap, FiInfo } from 'react-icons/fi';
import ImageComparison from './ImageComparison';
import { formatFileSize } from '../services/imageService';

const DetailedResult = ({ result, onBack, onDownload }) => {
  const [showFullSize, setShowFullSize] = useState(false);
  
  if (!result) return null;
  
  const {
    name,
    originalSize,
    processedSize,
    originalPreview,
    processedPreview,
    originalDimensions,
    compressionRate,
    format,
    quality
  } = result;
  
  const handleDownload = () => {
    onDownload && onDownload();
  };
  
  const handleToggleFullSize = () => {
    setShowFullSize(!showFullSize);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200/30 dark:border-gray-700/50">
      {/* Header */}
      <div className="border-b border-slate-200/30 dark:border-gray-700/50 p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <button 
            onClick={onBack}
            className="text-slate-600 dark:text-gray-300 hover:text-slate-800 dark:hover:text-white transition-colors flex items-center text-sm sm:text-base"
          >
            <FiArrowLeft className="mr-2" />
            Back to results
          </button>
          <h2 className="font-semibold text-lg sm:text-xl mt-1 text-slate-800 dark:text-white truncate" title={name}>
            {name}
          </h2>
        </div>
        
        <button 
          onClick={handleDownload}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center text-sm font-medium shadow-lg whitespace-nowrap"
        >
          <FiDownload className="mr-2" /> Download Image
        </button>
      </div>
      
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image comparison */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-slate-800 dark:text-gray-200 text-lg">Image Comparison</h3>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleToggleFullSize}
                  className="text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-gray-700/50 transition-colors"
                  title={showFullSize ? 'Show comparison' : 'Show full size'}
                >
                  {showFullSize ? (
                    <FiZoomIn size={20} />
                  ) : (
                    <FiMaximize2 size={20} />
                  )}
                </button>
              </div>
            </div>
            
            <div className="relative bg-slate-50 dark:bg-gray-900/50 rounded-xl overflow-hidden border border-slate-200/50 dark:border-gray-700/50">
              {showFullSize ? (
                <div className="relative w-full aspect-square flex items-center justify-center p-4">
                  <img 
                    src={processedPreview} 
                    alt={`Processed ${name}`}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ) : (
                <ImageComparison 
                  originalSrc={originalPreview} 
                  processedSrc={processedPreview}
                  originalSize={originalSize}
                  processedSize={processedSize}
                />
              )}
              
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <button 
                  onClick={() => {
                    const img = document.querySelector('.detailed-result-image');
                    if (img) {
                      const currentScale = parseFloat(img.style.transform?.replace('scale(', '')?.replace(')', '')) || 1;
                      img.style.transform = `scale(${Math.min(currentScale + 0.2, 3)})`;
                    }
                  }}
                  className="bg-white/90 dark:bg-gray-800/90 text-slate-700 dark:text-gray-200 p-2 rounded-lg shadow-lg hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
                  title="Zoom in"
                >
                  <FiZoomIn size={18} />
                </button>
                <button 
                  onClick={() => {
                    const img = document.querySelector('.detailed-result-image');
                    if (img) {
                      const currentScale = parseFloat(img.style.transform?.replace('scale(', '')?.replace(')', '')) || 1;
                      img.style.transform = `scale(${Math.max(currentScale - 0.2, 0.5)})`;
                    }
                  }}
                  className="bg-white/90 dark:bg-gray-800/90 text-slate-700 dark:text-gray-200 p-2 rounded-lg shadow-lg hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
                  title="Zoom out"
                >
                  <FiZoomOut size={18} />
                </button>
                <button 
                  onClick={() => {
                    const img = document.querySelector('.detailed-result-image');
                    if (img) {
                      img.style.transform = 'scale(1)';
                    }
                  }}
                  className="bg-white/90 dark:bg-gray-800/90 text-slate-700 dark:text-gray-200 p-2 rounded-lg shadow-lg hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
                  title="Reset zoom"
                >
                  <FiRotateCw size={18} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Metadata and details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800 dark:text-gray-200 text-lg">Image Information</h3>
            
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <div>
                <div className="text-gray-500 text-sm mb-1">File Name</div>
                <div className="font-medium">{name}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-500 text-sm mb-1">Original Format</div>
                  <div className="font-medium">{result.originalFile.type.split('/')[1].toUpperCase()}</div>
                </div>
                
                <div>
                  <div className="text-gray-500 text-sm mb-1">Converted Format</div>
                  <div className="font-medium">{format.toUpperCase()}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-500 text-sm mb-1">Original Size</div>
                  <div className="font-medium">{formatFileSize(originalSize)}</div>
                </div>
                
                <div>
                  <div className="text-gray-500 text-sm mb-1">Processed Size</div>
                  <div className={`font-medium ${compressionRate > 0 ? 'text-green-600' : 'text-blue-600'}`}>
                    {formatFileSize(processedSize)}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-500 text-sm mb-1">Dimensions</div>
                  <div className="font-medium">
                    {originalDimensions ? `${originalDimensions.width} × ${originalDimensions.height}` : 'Unknown'}
                  </div>
                </div>
                
                <div>
                  <div className="text-gray-500 text-sm mb-1">Quality Setting</div>
                  <div className="font-medium">{quality}%</div>
                </div>
              </div>
              
              {compressionRate > 0 && (
                <div className="bg-green-50 border-l-4 border-green-500 p-3 flex">
                  <FiZap className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-green-700">
                      {Math.round(compressionRate)}% Smaller!
                    </div>
                    <div className="text-sm text-green-600">
                      You saved {formatFileSize(originalSize - processedSize)} of storage space
                    </div>
                  </div>
                </div>
              )}
              
              {compressionRate <= 0 && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 flex">
                  <FiInfo className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-blue-700">Format Converted</div>
                    <div className="text-sm text-blue-600">
                      The image was successfully converted to {format.toUpperCase()} format
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Full size image view */}
        {showFullSize && (
          <div className="mt-8 border rounded-lg overflow-hidden">
            <div className="bg-gray-50 border-b p-3 flex justify-between items-center">
              <div className="font-medium">Full Size Preview</div>
              <button 
                onClick={handleToggleFullSize}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX />
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[600px]">
              <img 
                src={processedPreview} 
                alt={name}
                className="max-w-full h-auto mx-auto"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedResult;