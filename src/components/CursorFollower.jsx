import React, { useEffect, useState } from 'react';

/**
 * Simple, Guaranteed-to-Work Cursor Follower
 * Both default cursor and cursor follower will be visible
 */
const CursorFollower = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (target.matches && target.matches('button, a, [role="button"], .btn, input, textarea')) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target;
      if (target.matches && target.matches('button, a, [role="button"], .btn, input, textarea')) {
        setIsHovering(false);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [isVisible]);

  // Don't render on mobile
  const isMobile = typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  if (!isVisible || isMobile) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: mousePos.x,
        top: mousePos.y,
        pointerEvents: 'none',
        zIndex: 99999,
        transform: 'translate(-50%, -50%)',
        width: '50px',
        height: '50px'
      }}
    >
      {/* Outer ring */}
      <div
        style={{
          position: 'absolute',
          width: isHovering ? '35px' : '25px',
          height: isHovering ? '35px' : '25px',
          border: '2px solid #4facfe',
          borderRadius: '50%',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: isHovering ? 0.8 : 0.5,
          background: 'rgba(79, 172, 254, 0.1)',
          transition: 'all 0.3s ease',
          boxShadow: '0 0 20px rgba(79, 172, 254, 0.3)'
        }}
      />

      {/* Inner dot */}
      <div
        style={{
          position: 'absolute',
          width: isHovering ? '12px' : '8px',
          height: isHovering ? '12px' : '8px',
          backgroundColor: '#4facfe',
          borderRadius: '50%',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          transition: 'all 0.3s ease',
          boxShadow: '0 0 15px rgba(79, 172, 254, 0.6)'
        }}
      />

      {/* Hover glow effect */}
      {isHovering && (
        <div
          style={{
            position: 'absolute',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(79, 172, 254, 0.2) 0%, transparent 70%)',
            opacity: 0.6
          }}
        />
      )}
    </div>
  );
};

export default CursorFollower;
