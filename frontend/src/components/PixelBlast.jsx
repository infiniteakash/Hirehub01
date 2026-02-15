import React, { useEffect, useRef } from 'react';

const PixelBlast = ({
  variant = 'square',
  pixelSize = 4,
  color = '#B19EEF',
  patternScale = 2,
  patternDensity = 1,
  pixelSizeJitter = 0,
  enableRipples = true,
  rippleSpeed = 0.4,
  rippleThickness = 0.12,
  rippleIntensityScale = 1.5,
  liquid = false,
  liquidStrength = 0.12,
  liquidRadius = 1.2,
  liquidWobbleSpeed = 5,
  speed = 0.5,
  edgeFade = 0.25,
  transparent = true
}) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const animationFrameId = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    contextRef.current = ctx;

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          }
        : { r: 177, g: 158, b: 239 };
    };

    const rgb = hexToRgb(color);

    const modifiedPatternScale = patternScale === 2 ? 1.5 : patternScale;
    const modifiedPixelSize = pixelSize * modifiedPatternScale;

    const createParticles = () => {
      const cols = Math.ceil(canvas.width / modifiedPixelSize);
      const rows = Math.ceil(canvas.height / modifiedPixelSize);
      const particles = [];

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (Math.random() > patternDensity) continue;

          const baseSize =
            modifiedPixelSize * (1 - pixelSizeJitter + Math.random() * pixelSizeJitter * 2);

          particles.push({
            x: col * modifiedPixelSize + modifiedPixelSize / 2,
            y: row * modifiedPixelSize + modifiedPixelSize / 2,
            baseSize,
            size: baseSize,
            opacity: Math.random() * 0.8 + 0.2,
            vx: (Math.random() - 0.5) * 2 * speed,
            vy: (Math.random() - 0.5) * 2 * speed,
            life: Math.random(),
            originalX: col * modifiedPixelSize + modifiedPixelSize / 2,
            originalY: row * modifiedPixelSize + modifiedPixelSize / 2,
            wobbleX: Math.random() * Math.PI * 2,
            wobbleY: Math.random() * Math.PI * 2,
            wobbleSpeedX: Math.random() * 0.02 + 0.01,
            wobbleSpeedY: Math.random() * 0.02 + 0.01
          });
        }
      }

      return particles;
    };

    const particles = createParticles();

    const animate = () => {
      timeRef.current += 0.016 * speed;

      ctx.fillStyle = transparent ? 'rgba(255, 255, 255, 0)' : 'rgba(15, 15, 15, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.life = (p.life + 0.002) % 1;

        if (liquid) {
          p.wobbleX += p.wobbleSpeedX;
          p.wobbleY += p.wobbleSpeedY;
          p.x = p.originalX + Math.sin(p.wobbleX) * liquidRadius * liquidStrength;
          p.y = p.originalY + Math.cos(p.wobbleY) * liquidRadius * liquidStrength;
        } else {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

          p.x = Math.max(0, Math.min(canvas.width, p.x));
          p.y = Math.max(0, Math.min(canvas.height, p.y));
        }

        let distance = 0;
        if (enableRipples) {
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          distance =
            Math.sqrt(Math.pow(p.x - centerX, 2) + Math.pow(p.y - centerY, 2)) *
            rippleSpeed *
            0.01;
          const waveValue = Math.sin(distance - timeRef.current * rippleSpeed) * rippleThickness;
          p.size = p.baseSize * (1 + waveValue * rippleIntensityScale);
        } else {
          p.size = p.baseSize;
        }

        const distToCenter =
          Math.sqrt(Math.pow(p.x - canvas.width / 2, 2) + Math.pow(p.y - canvas.height / 2, 2)) /
          Math.sqrt(Math.pow(canvas.width / 2, 2) + Math.pow(canvas.height / 2, 2));

        let fadedOpacity = p.opacity;
        if (distToCenter > 1 - edgeFade) {
          fadedOpacity *= (1 - (distToCenter - (1 - edgeFade)) / edgeFade);
        }

        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${fadedOpacity})`;

        if (variant === 'square') {
          ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        } else if (variant === 'circle') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [
    variant,
    pixelSize,
    color,
    patternScale,
    patternDensity,
    pixelSizeJitter,
    enableRipples,
    rippleSpeed,
    rippleThickness,
    rippleIntensityScale,
    liquid,
    liquidStrength,
    liquidRadius,
    liquidWobbleSpeed,
    speed,
    edgeFade,
    transparent
  ]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        position: 'absolute',
        top: 0,
        left: 0
      }}
    />
  );
};

export default PixelBlast;
