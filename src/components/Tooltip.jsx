import { useState, useRef, useEffect } from 'react';

const Tooltip = ({ text, children, position = 'top', className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);

  const showTooltip = () => setIsVisible(true);
  const hideTooltip = () => setIsVisible(false);

  // Position the tooltip based on the specified position
  const getPosition = () => {
    switch (position) {
      case 'bottom':
        return 'top-full mt-1';
      case 'left':
        return 'right-full mr-1';
      case 'right':
        return 'left-full ml-1';
      case 'top':
      default:
        return 'bottom-full mb-1';
    }
  };

  // Handle click outside to hide tooltip
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        hideTooltip();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onClick={() => setIsVisible(!isVisible)}
      >
        {children}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          className={`
            absolute z-[99999] ${getPosition()} w-max max-w-sm
            bg-slate-900/98 text-white text-sm rounded-xl py-3 px-4
            pointer-events-none transition-all duration-300
            backdrop-blur-md border-2 border-slate-700/80 shadow-2xl
            font-medium leading-relaxed
            before:absolute before:inset-0 before:bg-gradient-to-br
            before:from-slate-800/50 before:to-slate-900/50 before:rounded-xl before:-z-10
          `}
          role="tooltip"
        >
          <div className="relative z-10">
            {text}
          </div>
          <div
            className={`tooltip-arrow absolute w-3 h-3 transform rotate-45
              ${position === 'top' ? 'bottom-[-6px] left-1/2 -translate-x-1/2 bg-slate-900/98 border-r border-b border-slate-700/80' :
                position === 'bottom' ? 'top-[-6px] left-1/2 -translate-x-1/2 bg-slate-900/98 border-l border-t border-slate-700/80' :
                position === 'left' ? 'right-[-6px] top-1/2 -translate-y-1/2 bg-slate-900/98 border-t border-r border-slate-700/80' :
                'left-[-6px] top-1/2 -translate-y-1/2 bg-slate-900/98 border-b border-l border-slate-700/80'
              }
            `}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;