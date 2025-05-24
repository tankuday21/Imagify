import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import PropTypes from 'prop-types';

const AnimatedTooltip = ({
  text,
  children,
  position = 'top',
  className = '',
  delay = 300,
  showCursor = true,
  springConfig = { damping: 25, stiffness: 400 }
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);
  const timeoutRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Motion values for smooth cursor following
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  // Spring animations for smooth following
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  // Update cursor position with smooth animation
  const updateCursorPosition = useCallback((clientX, clientY) => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      const relativeY = clientY - rect.top;

      cursorX.set(relativeX);
      cursorY.set(relativeY);

      setMousePosition({ x: clientX, y: clientY });
    }
  }, [cursorX, cursorY]);

  // Handle mouse movement with throttling for performance
  const handleMouseMove = useCallback((event) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      updateCursorPosition(event.clientX, event.clientY);
    });
  }, [updateCursorPosition]);

  const showTooltip = useCallback((event) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    updateCursorPosition(event.clientX, event.clientY);

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  }, [delay, updateCursorPosition]);

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  }, []);

  // Get tooltip position based on cursor and preferred position
  const getTooltipPosition = () => {
    if (!triggerRef.current) return {};

    const rect = triggerRef.current.getBoundingClientRect();
    const tooltipWidth = 320; // Estimated max width
    const tooltipHeight = 80; // Estimated height
    const offset = 16;

    let x, y;

    switch (position) {
      case 'bottom':
        x = mousePosition.x - tooltipWidth / 2;
        y = rect.bottom + offset;
        break;
      case 'left':
        x = rect.left - tooltipWidth - offset;
        y = mousePosition.y - tooltipHeight / 2;
        break;
      case 'right':
        x = rect.right + offset;
        y = mousePosition.y - tooltipHeight / 2;
        break;
      case 'top':
      default:
        x = mousePosition.x - tooltipWidth / 2;
        y = rect.top - tooltipHeight - offset;
        break;
    }

    // Keep tooltip within viewport
    const padding = 16;
    x = Math.max(padding, Math.min(x, window.innerWidth - tooltipWidth - padding));
    y = Math.max(padding, Math.min(y, window.innerHeight - tooltipHeight - padding));

    return { x, y };
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const tooltipPosition = getTooltipPosition();

  return (
    <>
      <div
        className={`relative inline-block ${className}`}
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onMouseMove={handleMouseMove}
      >
        {children}

        {/* Cursor follower indicator */}
        {showCursor && isVisible && (
          <motion.div
            className="fixed pointer-events-none"
            style={{
              x: springX,
              y: springY,
              left: triggerRef.current?.getBoundingClientRect().left || 0,
              top: triggerRef.current?.getBoundingClientRect().top || 0,
              zIndex: 999998,
            }}
          >
            <motion.div
              className="w-3 h-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full shadow-lg"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.8 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30
              }}
            />
            {/* Ripple effect */}
            <motion.div
              className="absolute inset-0 w-3 h-3 bg-primary-400/30 rounded-full"
              animate={{
                scale: [1, 2, 1],
                opacity: [0.6, 0, 0.6]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        )}
      </div>

      {/* Portal for tooltip */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            className="fixed pointer-events-none"
            style={{
              left: tooltipPosition.x,
              top: tooltipPosition.y,
              zIndex: 999999,
            }}
            initial={{
              opacity: 0,
              scale: 0.8,
              y: position === 'top' ? 10 : position === 'bottom' ? -10 : 0,
              x: position === 'left' ? 10 : position === 'right' ? -10 : 0
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              x: 0
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              y: position === 'top' ? 10 : position === 'bottom' ? -10 : 0,
              x: position === 'left' ? 10 : position === 'right' ? -10 : 0
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
              opacity: { duration: 0.2 }
            }}
          >
            <motion.div
              className="relative max-w-sm bg-slate-900/98 text-white text-sm rounded-2xl py-4 px-5 shadow-2xl backdrop-blur-md border-2 border-slate-700/80 font-medium leading-relaxed"
              initial={{ rotateX: -15, rotateY: 0 }}
              animate={{ rotateX: 0, rotateY: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
            >
              {/* Background gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl -z-10" />

              {/* Content */}
              <div className="relative z-10">
                {text}
              </div>

              {/* Animated border */}
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-gradient-to-r from-primary-500/50 to-secondary-500/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Arrow */}
              <div
                className={`absolute w-3 h-3 transform rotate-45 bg-slate-900/98 border-slate-700/80 ${
                  position === 'top' ? 'bottom-[-6px] left-1/2 -translate-x-1/2 border-r border-b' :
                  position === 'bottom' ? 'top-[-6px] left-1/2 -translate-x-1/2 border-l border-t' :
                  position === 'left' ? 'right-[-6px] top-1/2 -translate-y-1/2 border-t border-r' :
                  'left-[-6px] top-1/2 -translate-y-1/2 border-b border-l'
                }`}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

AnimatedTooltip.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  children: PropTypes.node.isRequired,
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  className: PropTypes.string,
  delay: PropTypes.number,
  showCursor: PropTypes.bool,
  springConfig: PropTypes.object
};

export default AnimatedTooltip;
