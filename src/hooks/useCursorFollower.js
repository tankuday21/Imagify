import { useState, useEffect, useCallback, useRef } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

/**
 * Custom hook for smooth cursor following functionality
 * Provides optimized mouse tracking with spring animations
 */
const useCursorFollower = ({
  springConfig = { damping: 15, stiffness: 600 },
  enabled = true,
  hoverSelector = 'button, a, [role="button"], .btn, .cursor-hover, input, textarea, select'
} = {}) => {
  // Motion values for smooth cursor position - initialize to center
  const cursorX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const cursorY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);

  // Spring animations for smooth following - optimized for speed
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  // State for cursor interactions
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // Start visible

  // Refs for performance optimization
  const hoveredElement = useRef(null);

  // Check if user prefers reduced motion - temporarily disabled for debugging
  const prefersReducedMotion = useRef(false);

  // Highly optimized mouse move handler
  const handleMouseMove = useCallback((event) => {
    if (!enabled || prefersReducedMotion.current) return;

    const { clientX, clientY } = event;

    // Direct update without requestAnimationFrame for better responsiveness
    cursorX.set(clientX);
    cursorY.set(clientY);

    // Show cursor if it's the first movement
    if (!isVisible) {
      setIsVisible(true);
    }
  }, [enabled, cursorX, cursorY, isVisible]);

  // Simplified hover detection for better performance
  const handleMouseEnter = useCallback((event) => {
    if (!enabled || prefersReducedMotion.current) return;

    const target = event.target;
    if (target.matches && target.matches(hoverSelector)) {
      setIsHovering(true);
    }
  }, [enabled, hoverSelector]);

  // Simplified mouse leave handler
  const handleMouseLeave = useCallback((event) => {
    if (!enabled || prefersReducedMotion.current) return;

    const target = event.target;
    if (target.matches && target.matches(hoverSelector)) {
      setIsHovering(false);
    }
  }, [enabled, hoverSelector]);

  // Handle mouse down for click effect
  const handleMouseDown = useCallback((event) => {
    if (!enabled || prefersReducedMotion.current) return;
    setIsClicking(true);
  }, [enabled]);

  // Handle mouse up to end click effect
  const handleMouseUp = useCallback((event) => {
    if (!enabled || prefersReducedMotion.current) return;
    setIsClicking(false);
  }, [enabled]);

  // Handle mouse leave from window
  const handleMouseLeaveWindow = useCallback(() => {
    if (!enabled) return;
    setIsVisible(false);
    setIsHovering(false);
    setIsClicking(false);
  }, [enabled]);

  // Handle mouse enter to window
  const handleMouseEnterWindow = useCallback(() => {
    if (!enabled || prefersReducedMotion.current) return;
    setIsVisible(true);
  }, [enabled]);

  // Set up event listeners
  useEffect(() => {
    if (!enabled || prefersReducedMotion.current) return;

    const options = { passive: true };

    // Global mouse tracking
    document.addEventListener('mousemove', handleMouseMove, options);
    document.addEventListener('mousedown', handleMouseDown, options);
    document.addEventListener('mouseup', handleMouseUp, options);
    document.addEventListener('mouseleave', handleMouseLeaveWindow, options);
    document.addEventListener('mouseenter', handleMouseEnterWindow, options);

    // Interactive element hover detection
    document.addEventListener('mouseover', handleMouseEnter, options);
    document.addEventListener('mouseout', handleMouseLeave, options);

    return () => {
      // Cleanup event listeners
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('mouseout', handleMouseLeave);
    };
  }, [
    enabled,
    handleMouseMove,
    handleMouseDown,
    handleMouseUp,
    handleMouseLeaveWindow,
    handleMouseEnterWindow,
    handleMouseEnter,
    handleMouseLeave
  ]);

  return {
    // Motion values for positioning
    springX,
    springY,

    // State for styling
    isHovering,
    isClicking,
    isVisible,

    // Utility values
    enabled: enabled && !prefersReducedMotion.current,
    hoveredElement: hoveredElement.current
  };
};

export default useCursorFollower;
