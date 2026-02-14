import { useRef, useEffect } from 'react';

interface LogoElement {
  id: string;
  type: 'text' | 'shape';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  content: string;
  fontSize?: number;
  shapeType?: 'circle' | 'rectangle';
}

interface LogoCanvas2DProps {
  elements: LogoElement[];
  onElementsChange: (elements: LogoElement[]) => void;
}

export default function LogoCanvas2D({ elements }: LogoCanvas2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const CANVAS_WIDTH = 600;
  const CANVAS_HEIGHT = 600;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear with transparent background
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw checkerboard pattern to show transparency
    const squareSize = 20;
    for (let y = 0; y < CANVAS_HEIGHT; y += squareSize) {
      for (let x = 0; x < CANVAS_WIDTH; x += squareSize) {
        ctx.fillStyle = (x / squareSize + y / squareSize) % 2 === 0 ? '#f0f0f0' : '#ffffff';
        ctx.fillRect(x, y, squareSize, squareSize);
      }
    }

    // Draw elements
    elements.forEach((element) => {
      if (element.type === 'text') {
        ctx.fillStyle = element.color;
        ctx.font = `bold ${element.fontSize || 48}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(element.content, element.x, element.y);
      } else if (element.type === 'shape') {
        ctx.fillStyle = element.color;
        if (element.shapeType === 'circle') {
          ctx.beginPath();
          ctx.arc(element.x, element.y, element.width / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(element.x - element.width / 2, element.y - element.height / 2, element.width, element.height);
        }
      }
    });
  }, [elements]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-2 border-border rounded-lg shadow-lg bg-white max-w-full h-auto"
      />
    </div>
  );
}
