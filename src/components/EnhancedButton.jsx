import { motion } from 'framer-motion';
import { useState } from 'react';

/**
 * Enhanced button component with modern styling and animations
 */
const EnhancedButton = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  loading = false,
  ripple = true,
  ...props
}) => {
  const [rippleEffect, setRippleEffect] = useState([]);

  const handleClick = (e) => {
    if (disabled || loading) return;

    // Create ripple effect
    if (ripple) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newRipple = {
        x,
        y,
        id: Date.now(),
      };
      
      setRippleEffect(prev => [...prev, newRipple]);
      
      // Remove ripple after animation
      setTimeout(() => {
        setRippleEffect(prev => prev.filter(r => r.id !== newRipple.id));
      }, 600);
    }

    onClick?.(e);
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return `
          bg-gradient-to-r from-primary-500 to-secondary-500 
          hover:from-primary-600 hover:to-secondary-600
          text-white shadow-lg hover:shadow-xl
          border border-transparent
        `;
      case 'secondary':
        return `
          bg-white/10 backdrop-blur-sm border border-white/20
          hover:bg-white/20 hover:border-white/30
          text-gray-800 dark:text-white
          shadow-glass hover:shadow-glass-dark
        `;
      case 'outline':
        return `
          bg-transparent border-2 border-primary-500
          hover:bg-primary-500 hover:text-white
          text-primary-500 hover:border-primary-600
        `;
      case 'ghost':
        return `
          bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800
          text-gray-700 dark:text-gray-300
          border border-transparent
        `;
      case 'danger':
        return `
          bg-gradient-to-r from-error-500 to-error-600
          hover:from-error-600 hover:to-error-700
          text-white shadow-lg hover:shadow-xl
          border border-transparent
        `;
      default:
        return '';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'md':
        return 'px-4 py-2 text-base';
      case 'lg':
        return 'px-6 py-3 text-lg';
      case 'xl':
        return 'px-8 py-4 text-xl';
      default:
        return 'px-4 py-2 text-base';
    }
  };

  const baseClasses = `
    relative inline-flex items-center justify-center
    font-semibold rounded-xl
    transition-all duration-300 ease-out
    focus:outline-none focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-800
    disabled:opacity-50 disabled:cursor-not-allowed
    overflow-hidden
    transform-gpu
  `;

  return (
    <motion.button
      className={`
        ${baseClasses}
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${className}
      `}
      onClick={handleClick}
      disabled={disabled || loading}
      whileHover={{ 
        scale: disabled || loading ? 1 : 1.02,
        y: disabled || loading ? 0 : -1
      }}
      whileTap={{ 
        scale: disabled || loading ? 1 : 0.98,
        y: disabled || loading ? 0 : 0
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17
      }}
      {...props}
    >
      {/* Ripple effects */}
      {rippleEffect.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}

      {/* Shimmer effect */}
      <div className="absolute inset-0 -top-px overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:animate-shimmer" />
      </div>

      {/* Content */}
      <div className="relative flex items-center space-x-2">
        {loading ? (
          <div className="loading-spinner w-4 h-4" />
        ) : Icon ? (
          <Icon className="w-4 h-4" />
        ) : null}
        
        {children && (
          <span className={Icon || loading ? 'ml-2' : ''}>
            {children}
          </span>
        )}
      </div>
    </motion.button>
  );
};

export default EnhancedButton;
