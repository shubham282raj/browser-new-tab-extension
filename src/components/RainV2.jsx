import { useEffect, useRef, useState } from "react";

const RainV2Canvas = () => {
  const canvasRef = useRef(null);
  const [settings, setSettings] = useState({
    speed: 1,
    density: 1,
  });

  // Mock function to replace localStorage dependency
  const getRelativeRainNums = (key) => {
    if (key === "misc_rain_speed") return settings.speed;
    if (key === "misc_rain_density") return settings.density;
    return 1;
  };

  let relSpeedChange = getRelativeRainNums("misc_rain_speed");
  let relRainDensity = getRelativeRainNums("misc_rain_density");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    let drops = [];
    let wind = 0;
    let windTarget = 0;

    const initDrops = () => {
      // Adjusted drop count for better performance and realism
      const dropCount = Math.floor(
        200 * (width / 1920) * (height / 1080) * relRainDensity
      );

      drops.length = 0;
      for (let i = 0; i < dropCount; i++) {
        const speed = Math.random() * 8 + 12; // Faster, more realistic speeds
        drops.push({
          x: Math.random() * (width + 200) - 100, // Start some drops off-screen for wind
          y: Math.random() * height - height, // Start above screen
          length: Math.random() * 25 + 15, // Longer raindrops
          speed: speed * 0.2 * relSpeedChange,
          opacity: Math.random() * 0.6 + 0.3, // More visible
          thickness: Math.random() * 1.5 + 0.5, // Variable thickness
          // Add slight randomness to make drops less uniform
          wobble: Math.random() * 0.02 + 0.01,
          wobbleOffset: Math.random() * Math.PI * 2,
        });
      }
    };
    initDrops();

    // Add subtle wind effect
    const updateWind = () => {
      // Gradually change wind direction
      if (Math.random() < 0.01) {
        windTarget = (Math.random() - 0.5) * 3; // Wind between -1.5 and 1.5
      }
      wind += (windTarget - wind) * 0.02; // Smooth wind transition
    };

    const drawRain = () => {
      // Clear canvas completely for transparent background
      ctx.clearRect(0, 0, width, height);

      updateWind();

      drops.forEach((drop, index) => {
        // More realistic raindrop color (bluish-gray)
        ctx.strokeStyle = `rgba(200, 220, 255, ${drop.opacity})`;
        ctx.lineWidth = drop.thickness;
        ctx.lineCap = "round";

        // Add slight wobble for more natural movement
        const wobbleX =
          Math.sin(Date.now() * drop.wobble + drop.wobbleOffset) * 0.5;
        const windEffect = wind * (drop.speed / 20); // Wind affects faster drops more

        ctx.beginPath();
        ctx.moveTo(drop.x + wobbleX + windEffect, drop.y);
        ctx.lineTo(
          drop.x + wobbleX + windEffect,
          drop.y + drop.length + windEffect * 0.3 // Slight angle from wind
        );
        ctx.stroke();

        // Update drop position
        drop.y += drop.speed;
        drop.x += windEffect * 0.5; // Gradual horizontal drift

        // Reset drop when it goes off screen
        if (drop.y > height + 50) {
          drop.y = -drop.length - Math.random() * 100;
          drop.x = Math.random() * (width + 200) - 100;
          // Occasionally vary the drop properties for more variety
          if (Math.random() < 0.1) {
            drop.speed = (Math.random() * 8 + 12) * relSpeedChange;
            drop.opacity = Math.random() * 0.6 + 0.3;
            drop.length = Math.random() * 25 + 15;
          }
        }

        // Handle drops that drift too far horizontally
        if (drop.x < -200 || drop.x > width + 200) {
          drop.x = Math.random() * (width + 200) - 100;
          drop.y = -drop.length - Math.random() * 100;
        }
      });

      requestAnimationFrame(drawRain);
    };

    drawRain();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initDrops();
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [relSpeedChange, relRainDensity]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
};

export default RainV2Canvas;
