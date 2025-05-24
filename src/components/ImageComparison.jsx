import { useState, useRef, useEffect } from 'react';
import { FiMove } from 'react-icons/fi';

const ImageComparison = ({ originalSrc, processedSrc, originalSize, processedSize }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  
  // Format file sizes
  const formatSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Calculate size reduction percentage
  const sizeReduction = originalSize && processedSize 
    ? Math.round(100 - (processedSize / originalSize * 100)) 
    : 0;
  
  // Handle mouse down on slider
  const handleMouseDown = () => {
    setIsDragging(true);
  };
  
  // Handle mouse move
  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const position = (x / rect.width) * 100;
    
    // Constrain to 0-100
    setSliderPosition(Math.max(0, Math.min(100, position)));
  };
  
  // Handle touch move for mobile
  const handleTouchMove = (e) => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const position = (x / rect.width) * 100;
    
    // Constrain to 0-100
    setSliderPosition(Math.max(0, Math.min(100, position)));
    
    // Prevent scrolling while dragging
    e.preventDefault();
  };
  
  // Handle mouse up / touch end
  const handleDragEnd = () => {
    setIsDragging(false);
  };
  
  // Add and remove event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleDragEnd);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging]);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 bg-gray-50 flex justify-between">
        <div className="text-sm font-medium">
          <span>Before: </span>
          <span className="text-gray-600">{formatSize(originalSize)}</span>
        </div>
        <div className="text-sm font-medium">
          <span>After: </span>
          <span className={sizeReduction > 0 ? "text-green-600" : "text-blue-600"}>
            {formatSize(processedSize)}
            {sizeReduction > 0 && ` (${sizeReduction}% smaller)`}
          </span>
        </div>
      </div>
      
      <div 
        ref={containerRef}
        className="relative h-[300px] overflow-hidden cursor-col-resize"
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        {/* Original Image (beneath) */}
        <div className="absolute inset-0 w-full h-full">
          <img 
            src={originalSrc} 
            alt="Original" 
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Processed Image (above, with clip-path) */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ 
            clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` 
          }}
        >
          <img 
            src={processedSrc} 
            alt="Processed" 
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Slider */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg cursor-col-resize"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
            <FiMove className="text-indigo-600" />
          </div>
        </div>
        
        {/* Labels */}
        <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          Before
        </div>
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          After
        </div>
      </div>
      
      <div className="p-3 text-center text-sm text-gray-500">
        Drag the slider to compare before and after
      </div>
    </div>
  );
};

export default ImageComparison;