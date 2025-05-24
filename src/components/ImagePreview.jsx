import { useState, useEffect } from 'react';
import { FiX, FiCheck, FiDownload, FiTrash2 } from 'react-icons/fi';

const ImagePreview = ({ file, converted, originalSize, convertedSize, onRemove, onDownload }) => {
  const [preview, setPreview] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  
  useEffect(() => {
    if (!file) {
      console.log('ImagePreview.jsx: No file prop received.');
      return;
    }
    
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    console.log('ImagePreview.jsx: File received:', file);
    console.log('ImagePreview.jsx: Generated preview URL:', objectUrl);
    
    // Free memory when component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);
  
  const formatSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const compressionRate = originalSize && convertedSize 
    ? Math.round(100 - (convertedSize / originalSize * 100)) 
    : 0;

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    onRemove && onRemove();
  };

  const handleDownloadClick = (e) => {
    e.stopPropagation();
    onDownload && onDownload();
  };

  return (
    <div 
      className="relative group glass-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 border border-slate-200/50"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="aspect-square overflow-hidden bg-slate-50/50">
        {preview ? (
          <img 
            src={preview} 
            alt={file.name} 
            className={`w-full h-full object-contain transition-all duration-300 ease-in-out ${isHovering ? 'scale-110' : 'scale-100'}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-200/70">
            <span className="text-slate-400">Preview N/A</span>
          </div>
        )}
        
        {/* Overlay with actions on hover */}
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col items-center justify-end p-3 z-20 ${isHovering ? 'opacity-100' : 'opacity-0'} ${isHovering ? 'bg-red-500/50' : ''}`}
        >
          <div className="flex space-x-3 mb-2">
            <button 
              onClick={handleRemoveClick}
              className="bg-white/80 text-red-600 backdrop-blur-sm rounded-full p-2.5 shadow-md hover:bg-red-100 hover:text-red-700 transition-all duration-200 transform hover:scale-110"
              title="Remove image"
            >
              <FiTrash2 size={18} />
            </button>
            
            {converted && (
              <button 
                onClick={handleDownloadClick}
                className="bg-white/80 text-indigo-600 backdrop-blur-sm rounded-full p-2.5 shadow-md hover:bg-indigo-100 hover:text-indigo-700 transition-all duration-200 transform hover:scale-110"
                title="Download converted image"
              >
                <FiDownload size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-3 bg-white/60 backdrop-blur-sm">
        <p className="font-semibold text-sm text-slate-700 truncate" title={file.name}>
          {file.name}
        </p>
        <div className="flex justify-between items-center text-xs text-slate-500 mt-1.5">
          <span className="bg-slate-100/70 px-1.5 py-0.5 rounded-full">{formatSize(file.size)}</span>
          
          {converted && (
            <span className={`flex items-center font-medium ${compressionRate > 0 ? 'text-green-600' : 'text-indigo-600'}`}>
              {compressionRate > 0 ? (
                <>
                  <FiCheck className="mr-1 stroke-2" />
                  {compressionRate}% Saved
                </>
              ) : (
                'Converted'
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
