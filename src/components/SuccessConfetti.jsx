import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

/**
 * Component that triggers a confetti animation
 * @param {Object} props - Component props
 * @param {boolean} props.trigger - Whether to trigger the confetti
 */
const SuccessConfetti = ({ trigger }) => {
  const [hasTriggered, setHasTriggered] = useState(false);
  
  useEffect(() => {
    // Only trigger once per session
    if (trigger && !hasTriggered) {
      setHasTriggered(true);
      
      // Fire confetti
      const duration = 2000;
      const end = Date.now() + duration;
      
      const colors = ['#4f46e5', '#8b5cf6', '#a855f7', '#ec4899'];
      
      (function frame() {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });
        
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
      
      // Reset after a while
      setTimeout(() => {
        setHasTriggered(false);
      }, 5000);
    }
  }, [trigger, hasTriggered]);
  
  return null; // This component doesn't render anything
};

export default SuccessConfetti;