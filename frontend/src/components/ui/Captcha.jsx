import { useEffect, useRef, useState, useImperativeHandle, forwardRef, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';

const CHARACTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';

const generateRandomString = (length) => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
  }
  return result;
};

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomColor = (min, max) => {
  const r = randomInt(min, max);
  const g = randomInt(min, max);
  const b = randomInt(min, max);
  return `rgb(${r},${g},${b})`;
};

const Captcha = forwardRef(({ length = 6, onTargetCodeChange }, ref) => {
  const canvasRef = useRef(null);
  const [captchaCode, setCaptchaCode] = useState('');

  const drawCaptcha = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Background color
    ctx.fillStyle = randomColor(230, 255);
    ctx.fillRect(0, 0, width, height);

    // Draw interference lines
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = randomColor(100, 200);
      ctx.beginPath();
      ctx.moveTo(randomInt(0, width), randomInt(0, height));
      ctx.lineTo(randomInt(0, width), randomInt(0, height));
      ctx.stroke();
    }

    // Draw interference dots
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = randomColor(150, 200);
      ctx.beginPath();
      ctx.arc(randomInt(0, width), randomInt(0, height), 1, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Generate new code
    const newCode = generateRandomString(length);
    setCaptchaCode(newCode);
    if (onTargetCodeChange) {
      onTargetCodeChange(newCode);
    }

    // Draw text
    const fontSize = 28;
    ctx.font = `bold ${fontSize}px "Comic Sans MS", cursive, sans-serif`;
    ctx.textBaseline = 'middle';

    for (let i = 0; i < length; i++) {
      const char = newCode.charAt(i);
      ctx.fillStyle = randomColor(50, 150); // Pink/Dark colors can fall here
      
      const x = (width / length) * i + 10;
      const y = height / 2;
      const deg = randomInt(-30, 30);
      
      ctx.translate(x, y);
      ctx.rotate((deg * Math.PI) / 180);
      ctx.fillText(char, 0, 0);
      ctx.rotate((-deg * Math.PI) / 180);
      ctx.translate(-x, -y);
    }
  }, [length, onTargetCodeChange]);

  useEffect(() => {
    drawCaptcha();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useImperativeHandle(ref, () => ({
    refresh: () => {
      drawCaptcha();
    },
    getCurrentCode: () => captchaCode
  }));

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <div className="overflow-hidden rounded-lg border border-white/20 bg-white/5 shadow-sm">
          <canvas
            ref={canvasRef}
            width={160}
            height={50}
            className="cursor-pointer"
            onClick={drawCaptcha}
            title="Click to refresh CAPTCHA"
          />
        </div>
        <button
          type="button"
          onClick={drawCaptcha}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
          title="Refresh verification code"
        >
          <RefreshCw size={18} />
        </button>
      </div>
      <p className="text-xs text-slate-500">Tap the image or the button to generate a new code.</p>
    </div>
  );
});

export default Captcha;
