import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface LogoExportButtonProps {
  logoElements: any[];
  onAddToDesign: (dataUrl: string) => void;
}

export default function LogoExportButton({ logoElements, onAddToDesign }: LogoExportButtonProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const exportLogo = (addToDesign: boolean = false) => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Transparent background
    ctx.clearRect(0, 0, 600, 600);

    // Draw elements
    logoElements.forEach((element) => {
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

    const dataUrl = canvas.toDataURL('image/png');

    if (addToDesign) {
      onAddToDesign(dataUrl);
    } else {
      // Download
      const link = document.createElement('a');
      link.download = `logo-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      toast.success('Logo exported!');
    }
  };

  return (
    <div className="flex gap-2">
      <Button onClick={() => exportLogo(true)} variant="outline" size="sm">
        <Plus className="w-4 h-4 mr-2" />
        Add to Design
      </Button>
      <Button onClick={() => exportLogo(false)} size="sm">
        <Download className="w-4 h-4 mr-2" />
        Export PNG
      </Button>
    </div>
  );
}
