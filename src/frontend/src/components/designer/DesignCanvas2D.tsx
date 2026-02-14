import { useRef, useEffect, useState } from 'react';
import { useDesignerState } from '../../state/useDesignerState';
import { getGarmentTemplate } from '../../utils/garmentTemplates';

export default function DesignCanvas2D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { garmentType, baseColor, elements, selectedElementId, selectElement, updateElement } = useDesignerState();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [garmentImage, setGarmentImage] = useState<HTMLImageElement | null>(null);

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 800;

  // Load garment template
  useEffect(() => {
    const template = getGarmentTemplate(garmentType);
    const img = new Image();
    img.src = template.path;
    img.onload = () => setGarmentImage(img);
  }, [garmentType]);

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Fill with base color
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw garment template
    if (garmentImage) {
      ctx.drawImage(garmentImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    // Draw print area bounds
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(200, 200, 400, 400);
    ctx.setLineDash([]);

    // Draw elements
    elements.forEach((element) => {
      ctx.save();
      ctx.translate(element.x + element.width / 2, element.y + element.height / 2);
      ctx.rotate((element.rotation * Math.PI) / 180);
      ctx.translate(-(element.x + element.width / 2), -(element.y + element.height / 2));

      if (element.type === 'logo' && element.content) {
        const img = new Image();
        img.src = element.content;
        ctx.drawImage(img, element.x, element.y, element.width, element.height);
      } else if (element.type === 'text') {
        ctx.fillStyle = element.color || '#000000';
        ctx.font = `${element.height}px Arial`;
        ctx.fillText(element.content || '', element.x, element.y + element.height);
      } else if (element.type === 'shape') {
        ctx.fillStyle = element.color || '#000000';
        if (element.content === 'circle') {
          ctx.beginPath();
          ctx.arc(element.x + element.width / 2, element.y + element.height / 2, element.width / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(element.x, element.y, element.width, element.height);
        }
      }

      ctx.restore();

      // Draw selection handles
      if (element.id === selectedElementId) {
        ctx.strokeStyle = 'oklch(0.646 0.222 41.116)';
        ctx.lineWidth = 2;
        ctx.strokeRect(element.x - 2, element.y - 2, element.width + 4, element.height + 4);

        // Corner handles
        const handleSize = 8;
        ctx.fillStyle = 'oklch(0.646 0.222 41.116)';
        ctx.fillRect(element.x - handleSize / 2, element.y - handleSize / 2, handleSize, handleSize);
        ctx.fillRect(element.x + element.width - handleSize / 2, element.y - handleSize / 2, handleSize, handleSize);
        ctx.fillRect(element.x - handleSize / 2, element.y + element.height - handleSize / 2, handleSize, handleSize);
        ctx.fillRect(
          element.x + element.width - handleSize / 2,
          element.y + element.height - handleSize / 2,
          handleSize,
          handleSize
        );
      }
    });
  }, [garmentImage, baseColor, elements, selectedElementId]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Check if clicking on an element (reverse order for top-to-bottom)
    for (let i = elements.length - 1; i >= 0; i--) {
      const el = elements[i];
      if (x >= el.x && x <= el.x + el.width && y >= el.y && y <= el.y + el.height) {
        selectElement(el.id);
        setIsDragging(true);
        setDragOffset({ x: x - el.x, y: y - el.y });
        return;
      }
    }

    // Clicked on empty space
    selectElement(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !selectedElementId) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    updateElement(selectedElementId, {
      x: x - dragOffset.x,
      y: y - dragOffset.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-2 border-border rounded-lg shadow-lg bg-white max-w-full h-auto cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
}
