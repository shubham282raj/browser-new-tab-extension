import { useEffect, useRef } from "react";

const RainCanvas = () => {
  const canvasRef = useRef(null);

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

    const initDrops = () => {
      // drop count proportionate to 2560x1440 screen
      const dropCount = 300 * (width / 2560) * (height / 1440) * relRainDensity;

      drops.length = 0;
      for (let i = 0; i < dropCount; i++) {
        drops.push({
          x: Math.random() * width,
          y: Math.random() * height,
          length: Math.random() * 20 + 10,
          speed: (Math.random() * 5 + 4) * 1,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
    };
    initDrops();

    const drawRain = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = "rgba(174,194,224,0.5)";
      ctx.lineWidth = 1;
      ctx.lineCap = "round";

      drops.forEach((d) => {
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x, d.y + d.length);
        ctx.stroke();

        d.y += d.speed * relSpeedChange;
        if (d.y > height) {
          d.y = -d.length;
          d.x = Math.random() * width;
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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none", // allows clicks through canvas
      }}
    />
  );
};

const getRelativeRainNums = (lsKey) => {
  let s = localStorage.getItem(lsKey);
  s = Number(s);
  return s == NaN || s == 0 ? 1 : s;
};

export default RainCanvas;
