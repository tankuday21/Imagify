import { useState, useCallback } from 'react';

/**
 * Generate a unique ID for notifications
 * @returns {string} Unique ID
 */
const generateId = () => Math.random().toString(36).substring(2, 9);

/**
 * Custom hook for managing notifications
 * @param {number} defaultDuration - Default notification duration in ms
 * @returns {Object} Notification methods and state
 */
const useNotifications = (defaultDuration = 5000) => {
  const [notifications, setNotifications] = useState([]);

  /**
   * Add a notification
   * @param {string} type - Notification type (success, error, info)
   * @param {string} message - Notification message
   * @param {number} duration - Duration in ms (optional)
   * @returns {string} Notification ID
   */
  const addNotification = useCallback((type, message, duration = defaultDuration) => {
    if (!message) return null;
    
    const id = generateId();
    setNotifications(prev => [...prev, { id, type, message, duration }]);
    return id;
  }, [defaultDuration]);

  /**
   * Remove a notification by ID
   * @param {string} id - Notification ID
   */
  const removeNotification = useCallback((id) => {
    if (!id) return;
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  /**
   * Clear all notifications
   */
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  /**
   * Convenience method for success notifications
   * @param {string} message - Notification message
   * @param {number} duration - Duration in ms (optional)
   * @returns {string} Notification ID
   */
  const success = useCallback((message, duration) => {
    return addNotification('success', message, duration);
  }, [addNotification]);

  /**
   * Convenience method for error notifications
   * @param {string} message - Notification message
   * @param {number} duration - Duration in ms (optional)
   * @returns {string} Notification ID
   */
  const error = useCallback((message, duration) => {
    return addNotification('error', message, duration);
  }, [addNotification]);

  /**
   * Convenience method for info notifications
   * @param {string} message - Notification message
   * @param {number} duration - Duration in ms (optional)
   * @returns {string} Notification ID
   */
  const info = useCallback((message, duration) => {
    return addNotification('info', message, duration);
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    success,
    error,
    info
  };
};

export default useNotifications;