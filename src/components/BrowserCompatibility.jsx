import { useState, useEffect } from 'react';
import { FiAlertCircle, FiX } from 'react-icons/fi';

const BrowserCompatibility = () => {
  const [isCompatible, setIsCompatible] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [compatibilityIssues, setCompatibilityIssues] = useState([]);

  useEffect(() => {
    // Check for necessary browser features
    const issues = [];
    
    // Check for File API
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
      issues.push("File API is not fully supported");
    }
    
    // Check for Canvas support (needed for image processing)
    if (!document.createElement('canvas').getContext) {
      issues.push("Canvas is not supported");
    }
    
    // Check for Web Workers (used for image compression)
    if (!window.Worker) {
      issues.push("Web Workers are not supported");
    }
    
    // Check for Blob URL support
    if (!window.URL || !window.URL.createObjectURL) {
      issues.push("Blob URLs are not supported");
    }
    
    // Check for modern JavaScript features by trying to parse an arrow function
    try {
      // eslint-disable-next-line no-new-func
      new Function('() => {}');
    } catch (e) {
      issues.push("Modern JavaScript features are not supported");
    }
    
    // Update state based on compatibility checks
    setCompatibilityIssues(issues);
    setIsCompatible(issues.length === 0);
    setShowAlert(issues.length > 0);
  }, []);

  if (!showAlert || isCompatible) {
    return null;
  }

  return (
    <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-8 rounded-lg">
      <div className="flex">
        <div className="flex-shrink-0">
          <FiAlertCircle className="h-5 w-5 text-orange-500" />
        </div>
        <div className="ml-3 flex-grow">
          <h3 className="text-sm font-medium text-orange-800">Browser Compatibility Warning</h3>
          <div className="mt-2 text-sm text-orange-700">
            <p>
              Your browser might not fully support all features needed for image conversion and compression. 
              You may experience limited functionality or errors.
            </p>
            {compatibilityIssues.length > 0 && (
              <ul className="list-disc list-inside mt-2">
                {compatibilityIssues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            )}
            <p className="mt-2">
              For the best experience, we recommend using the latest version of Chrome, Firefox, Edge, or Safari.
            </p>
          </div>
        </div>
        <button
          className="flex-shrink-0 ml-2"
          onClick={() => setShowAlert(false)}
          aria-label="Dismiss"
        >
          <FiX className="h-5 w-5 text-orange-500" />
        </button>
      </div>
    </div>
  );
};

export default BrowserCompatibility;