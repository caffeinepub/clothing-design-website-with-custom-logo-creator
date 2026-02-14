import { useDesignerState } from '../../state/useDesignerState';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';

export default function BaseColorPicker() {
  const { baseColor, setBaseColor } = useDesignerState();

  const presetColors = [
    '#ffffff',
    '#000000',
    '#ef4444',
    '#f97316',
    '#eab308',
    '#22c55e',
    '#3b82f6',
    '#8b5cf6',
    '#ec4899',
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <div className="w-4 h-4 rounded border" style={{ backgroundColor: baseColor }} />
          Color
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              type="color"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              className="w-16 h-10"
            />
            <Input value={baseColor} onChange={(e) => setBaseColor(e.target.value)} className="flex-1" />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {presetColors.map((color) => (
              <button
                key={color}
                onClick={() => setBaseColor(color)}
                className="w-10 h-10 rounded border-2 hover:scale-110 transition-transform"
                style={{
                  backgroundColor: color,
                  borderColor: color === baseColor ? 'oklch(var(--primary))' : 'transparent',
                }}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
