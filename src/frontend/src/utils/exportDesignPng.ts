import type { GarmentTemplate } from './garmentTemplates';
import type { DesignElement } from '../state/designerTypes';

export async function exportDesignToPng(
  template: GarmentTemplate,
  baseColor: string,
  elements: DesignElement[]
): Promise<void> {
  const canvas = document.createElement('canvas');
  canvas.width = template.width;
  canvas.height = template.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // Fill with base color
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Load and draw garment template
  const garmentImg = new Image();
  garmentImg.crossOrigin = 'anonymous';

  await new Promise<void>((resolve, reject) => {
    garmentImg.onload = () => resolve();
    garmentImg.onerror = reject;
    garmentImg.src = template.path;
  });

  ctx.drawImage(garmentImg, 0, 0, canvas.width, canvas.height);

  // Scale factor from canvas (800x800) to export (2000x2000)
  const scale = template.width / 800;

  // Draw elements
  for (const element of elements) {
    ctx.save();

    const scaledX = element.x * scale;
    const scaledY = element.y * scale;
    const scaledWidth = element.width * scale;
    const scaledHeight = element.height * scale;

    ctx.translate(scaledX + scaledWidth / 2, scaledY + scaledHeight / 2);
    ctx.rotate((element.rotation * Math.PI) / 180);
    ctx.translate(-(scaledX + scaledWidth / 2), -(scaledY + scaledHeight / 2));

    if (element.type === 'logo' && element.content) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve) => {
        img.onload = () => {
          ctx.drawImage(img, scaledX, scaledY, scaledWidth, scaledHeight);
          resolve();
        };
        img.onerror = () => resolve();
        img.src = element.content;
      });
    } else if (element.type === 'text') {
      ctx.fillStyle = element.color || '#000000';
      ctx.font = `${scaledHeight}px Arial`;
      ctx.fillText(element.content || '', scaledX, scaledY + scaledHeight);
    } else if (element.type === 'shape') {
      ctx.fillStyle = element.color || '#000000';
      if (element.content === 'circle') {
        ctx.beginPath();
        ctx.arc(scaledX + scaledWidth / 2, scaledY + scaledHeight / 2, scaledWidth / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);
      }
    }

    ctx.restore();
  }

  // Download
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `design-${Date.now()}.png`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}
