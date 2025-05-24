import { useState, useEffect } from 'react';
import { FiCheckCircle, FiAlertCircle, FiX } from 'react-icons/fi';

const Notification = ({ type = 'success', message, duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    if (!duration) return;
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose && onClose();
      }, 300); // Allow animation to complete
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose && onClose();
    }, 300);
  };
  
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="text-white text-xl" />;
      case 'error':
        return <FiAlertCircle className="text-white text-xl" />;
      default:
        return null;
    }
  };
  
  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-indigo-500';
    }
  };
  
  return (
    <div 
      className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
      }`}
    >
      <div className={`${getBgColor()} text-white rounded-lg shadow-lg overflow-hidden max-w-md flex items-center`}>
        <div className="p-3 flex items-center">
          <div className="mr-3">
            {getIcon()}
          </div>
          <div className="mr-8">
            <p>{message}</p>
          </div>
          <button 
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
          >
            <FiX className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

// NotificationContainer to manage multiple notifications
export const NotificationContainer = ({ notifications = [], removeNotification }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          type={notification.type}
          message={notification.message}
          duration={notification.duration}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

export default Notification;