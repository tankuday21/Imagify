import { useState } from 'react';
import { FiInfo, FiX } from 'react-icons/fi';

const InfoBanner = ({ className }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className={`bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-lg relative animate-fade-in ${className}`}>
      <button 
        className="absolute top-2 right-2 text-indigo-400 hover:text-indigo-600 transition-colors"
        onClick={() => setIsVisible(false)}
        aria-label="Dismiss"
      >
        <FiX />
      </button>
      
      <div className="flex">
        <div className="flex-shrink-0">
          <FiInfo className="h-5 w-5 text-indigo-500" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-indigo-800">Privacy First</h3>
          <div className="mt-1 text-sm text-indigo-700">
            <p>
              Your images are processed entirely in your browser and never uploaded to any server. 
              This keeps your data private and secure while providing fast conversions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoBanner;