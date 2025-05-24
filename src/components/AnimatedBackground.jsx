import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * Enhanced animated background component with multiple visual layers
 */
const AnimatedBackground = () => {
  const canvasRef = useRef(null);
  const { darkMode } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let waves = [];
    let geometricShapes = [];
    let time = 0;

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Initialize particles with enhanced properties
    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(Math.floor(window.innerWidth / 15), 120);

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 3 + 0.5,
          speedX: Math.random() * 0.8 - 0.4,
          speedY: Math.random() * 0.8 - 0.4,
          opacity: Math.random() * 0.6 + 0.2,
          hue: Math.random() * 60 + 200, // Blue to purple range
          pulseSpeed: Math.random() * 0.02 + 0.01,
          pulsePhase: Math.random() * Math.PI * 2
        });
      }
    };

    // Initialize wave effects
    const initWaves = () => {
      waves = [];
      for (let i = 0; i < 3; i++) {
        waves.push({
          amplitude: Math.random() * 50 + 30,
          frequency: Math.random() * 0.02 + 0.01,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.02 + 0.01,
          y: canvas.height * (0.2 + i * 0.3),
          opacity: 0.1 + i * 0.05
        });
      }
    };

    // Initialize geometric shapes
    const initGeometricShapes = () => {
      geometricShapes = [];
      const shapeCount = Math.min(Math.floor(window.innerWidth / 200), 8);

      for (let i = 0; i < shapeCount; i++) {
        geometricShapes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 100 + 50,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: Math.random() * 0.01 - 0.005,
          speedX: Math.random() * 0.3 - 0.15,
          speedY: Math.random() * 0.3 - 0.15,
          opacity: Math.random() * 0.1 + 0.05,
          type: Math.floor(Math.random() * 3), // 0: triangle, 1: square, 2: hexagon
          hue: Math.random() * 60 + 200
        });
      }
    };

    // Draw waves
    const drawWaves = () => {
      waves.forEach(wave => {
        ctx.beginPath();
        ctx.moveTo(0, wave.y);

        for (let x = 0; x <= canvas.width; x += 5) {
          const y = wave.y + Math.sin(x * wave.frequency + wave.phase + time * wave.speed) * wave.amplitude;
          ctx.lineTo(x, y);
        }

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        if (darkMode) {
          gradient.addColorStop(0, `hsla(240, 100%, 80%, ${wave.opacity})`);
          gradient.addColorStop(0.5, `hsla(280, 100%, 80%, ${wave.opacity * 1.5})`);
          gradient.addColorStop(1, `hsla(320, 100%, 80%, ${wave.opacity})`);
        } else {
          gradient.addColorStop(0, `hsla(220, 100%, 60%, ${wave.opacity})`);
          gradient.addColorStop(0.5, `hsla(260, 100%, 60%, ${wave.opacity * 1.5})`);
          gradient.addColorStop(1, `hsla(300, 100%, 60%, ${wave.opacity})`);
        }

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    };

    // Draw geometric shapes
    const drawGeometricShapes = () => {
      geometricShapes.forEach(shape => {
        ctx.save();
        ctx.translate(shape.x, shape.y);
        ctx.rotate(shape.rotation);

        const color = `hsla(${shape.hue}, 70%, ${darkMode ? '80%' : '60%'}, ${shape.opacity})`;
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;

        ctx.beginPath();

        switch (shape.type) {
          case 0: // Triangle
            ctx.moveTo(0, -shape.size / 2);
            ctx.lineTo(-shape.size / 2, shape.size / 2);
            ctx.lineTo(shape.size / 2, shape.size / 2);
            ctx.closePath();
            break;
          case 1: // Square
            ctx.rect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
            break;
          case 2: // Hexagon
            for (let i = 0; i < 6; i++) {
              const angle = (i * Math.PI) / 3;
              const x = Math.cos(angle) * shape.size / 2;
              const y = Math.sin(angle) * shape.size / 2;
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.closePath();
            break;
        }

        ctx.stroke();
        ctx.restore();

        // Update shape properties
        shape.x += shape.speedX;
        shape.y += shape.speedY;
        shape.rotation += shape.rotationSpeed;

        // Wrap around edges
        if (shape.x < -shape.size) shape.x = canvas.width + shape.size;
        if (shape.x > canvas.width + shape.size) shape.x = -shape.size;
        if (shape.y < -shape.size) shape.y = canvas.height + shape.size;
        if (shape.y > canvas.height + shape.size) shape.y = -shape.size;
      });
    };

    // Enhanced particle drawing with pulsing and connections
    const drawParticles = () => {
      particles.forEach(particle => {
        // Update pulse effect
        particle.pulsePhase += particle.pulseSpeed;
        const pulseScale = 1 + Math.sin(particle.pulsePhase) * 0.3;
        const currentRadius = particle.radius * pulseScale;
        const currentOpacity = particle.opacity * (0.7 + Math.sin(particle.pulsePhase) * 0.3);

        // Create gradient for particle
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, currentRadius * 2
        );

        const color = `hsla(${particle.hue}, 70%, ${darkMode ? '80%' : '60%'}, ${currentOpacity})`;
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, `hsla(${particle.hue}, 70%, ${darkMode ? '80%' : '60%'}, 0)`);

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw connections between nearby particles
        particles.forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120 && distance > 0) {
            const connectionOpacity = (1 - distance / 120) * 0.15;
            const connectionGradient = ctx.createLinearGradient(
              particle.x, particle.y,
              otherParticle.x, otherParticle.y
            );

            connectionGradient.addColorStop(0, `hsla(${particle.hue}, 70%, ${darkMode ? '80%' : '60%'}, ${connectionOpacity})`);
            connectionGradient.addColorStop(1, `hsla(${otherParticle.hue}, 70%, ${darkMode ? '80%' : '60%'}, ${connectionOpacity})`);

            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = connectionGradient;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });

        // Update particle position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Bounce off edges with some randomness
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX = -particle.speedX * (0.8 + Math.random() * 0.4);
          particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        }

        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY = -particle.speedY * (0.8 + Math.random() * 0.4);
          particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        }
      });
    };

    // Enhanced animation loop with multiple layers
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update time for wave animations
      time += 0.01;

      // Draw layers in order (back to front)
      drawWaves();
      drawGeometricShapes();
      drawParticles();

      animationFrameId = requestAnimationFrame(animate);
    };

    // Initialize all elements
    setCanvasDimensions();
    initParticles();
    initWaves();
    initGeometricShapes();
    animate();

    // Handle window resize
    const handleResize = () => {
      setCanvasDimensions();
      initParticles();
      initWaves();
      initGeometricShapes();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [darkMode]);

  return (
    <>
      {/* Main animated canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0 opacity-40"
        aria-hidden="true"
      />

      {/* Additional floating shapes using CSS */}
      <div className="floating-shapes">
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
      </div>

      {/* Mesh gradient overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-mesh-gradient opacity-60" />
    </>
  );
};

export default AnimatedBackground;