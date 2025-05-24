import { useCallback, useState, memo } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiAlertCircle } from 'react-icons/fi';
import PropTypes from 'prop-types';

/**
 * Accepted image MIME types
 */
const ACCEPTED_IMAGE_TYPES = {
  'image/jpeg': [],
  'image/png': [],
  'image/webp': [],
  'image/gif': [],
  'image/bmp': [],
  'image/tiff': []
};

/**
 * File size and count limits
 */
const FILE_LIMITS = {
  MAX_FILES: 10,
  MAX_SIZE: 10485760 // 10MB
};

/**
 * Dropzone component for image file uploads
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onFilesAdded - Callback when files are added
 */
const Dropzone = ({ onFilesAdded }) => {
  const [error, setError] = useState(null);

  /**
   * Handle dropped files
   */
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Process accepted files
    if (acceptedFiles?.length) {
      onFilesAdded(acceptedFiles);
      setError(null);
    }

    // Handle rejected files with error messages
    if (rejectedFiles?.length) {
      const errorMessages = rejectedFiles.map(file => {
        const errors = file.errors.map(e => e.message).join(', ');
        return `${file.file.name}: ${errors}`;
      });
      setError(errorMessages.join('. '));
    }
  }, [onFilesAdded]);

  /**
   * Configure dropzone
   */
  const { 
    getRootProps, 
    getInputProps, 
    isDragActive, 
    isDragReject, 
    open 
  } = useDropzone({
    onDrop,
    noClick: true, // We'll handle click on the button manually
    noKeyboard: true, // Disable keyboard interaction on the root
    accept: ACCEPTED_IMAGE_TYPES,
    maxFiles: FILE_LIMITS.MAX_FILES,
    maxSize: FILE_LIMITS.MAX_SIZE,
  });

  /**
   * Get dynamic classes for the dropzone container
   */
  const getDropzoneClasses = () => {
    const baseClasses = "border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ease-in-out float-animation";
    
    if (isDragActive && !isDragReject) {
      return `${baseClasses} bg-indigo-50/70 border-indigo-500 transform scale-[1.03] shadow-xl`;
    } else if (isDragReject) {
      return `${baseClasses} bg-red-50/70 border-red-500 transform scale-[1.01]`;
    }
    
    return `${baseClasses} border-slate-300 hover:border-indigo-400 hover:bg-slate-50/50`;
  };

  /**
   * Get dynamic classes for the upload icon
   */
  const getIconClasses = () => {
    const baseClasses = "mx-auto text-6xl mb-4 transition-colors duration-300 ease-in-out";
    
    if (isDragActive && !isDragReject) {
      return `${baseClasses} text-indigo-600 animate-bounce`;
    } else if (isDragReject) {
      return `${baseClasses} text-red-500`;
    }
    
    return `${baseClasses} text-slate-400 group-hover:text-indigo-500`;
  };

  /**
   * Get the heading text based on drag state
   */
  const getHeadingText = () => {
    if (isDragActive) {
      return isDragReject ? 'Unsupported File Type' : 'Release to Drop Files';
    }
    return 'Drag & Drop Images Here';
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={getDropzoneClasses()}
        data-testid="dropzone-container"
      >
        <input {...getInputProps()} data-testid="dropzone-input" />
        <FiUpload className={getIconClasses()} />
        
        <h2 className="text-xl sm:text-2xl font-semibold mb-2 gradient-text">
          {getHeadingText()}
        </h2>
        
        <p className="text-slate-500 mb-6">
          or click to select files from your device
        </p>
        
        <button 
          type="button" 
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 btn-modern"
          onClick={open}
          data-testid="browse-button"
        >
          Browse Files
        </button>
        
        <p className="text-xs text-slate-400 mt-4">
          Supports JPG, PNG, WEBP, GIF, BMP, TIFF (Max: 10MB per file, 10 files)
        </p>
      </div>

      {error && (
        <div 
          className="bg-red-100/80 border border-red-300 text-red-700 rounded-lg p-4 flex items-start shadow-sm"
          data-testid="error-message"
        >
          <FiAlertCircle className="mr-3 mt-0.5 flex-shrink-0 text-red-500" size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};

Dropzone.propTypes = {
  onFilesAdded: PropTypes.func.isRequired
};

// Memoize the component to prevent unnecessary re-renders
export default memo(Dropzone);
