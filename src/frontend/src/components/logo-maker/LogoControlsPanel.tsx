import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Type, Circle, Square, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { validateImageFile } from '../../utils/imageImport';
import { useDesignerState } from '../../state/useDesignerState';

interface LogoControlsPanelProps {
  elements: any[];
  onElementsChange: (elements: any[]) => void;
}

export default function LogoControlsPanel({ elements, onElementsChange }: LogoControlsPanelProps) {
  const [textContent, setTextContent] = useState('LOGO');
  const [textColor, setTextColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(48);
  const [shapeColor, setShapeColor] = useState('#ef4444');
  const designerState = useDesignerState();

  const addText = () => {
    const newElement = {
      id: `text-${Date.now()}`,
      type: 'text' as const,
      x: 300,
      y: 300,
      width: 200,
      height: fontSize,
      color: textColor,
      content: textContent,
      fontSize,
    };
    onElementsChange([...elements, newElement]);
    toast.success('Text added!');
  };

  const addShape = (shapeType: 'circle' | 'rectangle') => {
    const newElement = {
      id: `shape-${Date.now()}`,
      type: 'shape' as const,
      x: 300,
      y: 300,
      width: 100,
      height: 100,
      color: shapeColor,
      content: shapeType,
      shapeType,
    };
    onElementsChange([...elements, newElement]);
    toast.success('Shape added!');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await validateImageFile(file);
      designerState.addElement({
        id: `logo-${Date.now()}`,
        type: 'logo',
        x: 400,
        y: 300,
        width: 200,
        height: 200,
        rotation: 0,
        content: dataUrl,
        color: '',
      });
      toast.success('Image uploaded! Go to Designer to see it.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image');
    }
  };

  return (
    <Card className="border-0 rounded-none">
      <CardHeader>
        <CardTitle className="text-lg">Add Elements</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="text">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="text">
              <Type className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="shapes">
              <Circle className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="upload">
              <Upload className="w-4 h-4" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4">
            <div className="space-y-2">
              <Label>Text</Label>
              <Input value={textContent} onChange={(e) => setTextContent(e.target.value)} placeholder="Enter text" />
            </div>
            <div className="space-y-2">
              <Label>Font Size</Label>
              <Input
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                min={12}
                max={120}
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2">
                <Input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-16" />
                <Input value={textColor} onChange={(e) => setTextColor(e.target.value)} className="flex-1" />
              </div>
            </div>
            <Button onClick={addText} className="w-full">
              <Type className="w-4 h-4 mr-2" />
              Add Text
            </Button>
          </TabsContent>

          <TabsContent value="shapes" className="space-y-4">
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={shapeColor}
                  onChange={(e) => setShapeColor(e.target.value)}
                  className="w-16"
                />
                <Input value={shapeColor} onChange={(e) => setShapeColor(e.target.value)} className="flex-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={() => addShape('circle')} variant="outline">
                <Circle className="w-4 h-4 mr-2" />
                Circle
              </Button>
              <Button onClick={() => addShape('rectangle')} variant="outline">
                <Square className="w-4 h-4 mr-2" />
                Rectangle
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <p className="text-sm text-muted-foreground">Upload an image to use as a logo in your design.</p>
            <Label htmlFor="image-upload" className="cursor-pointer">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">Click to upload</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, or SVG</p>
              </div>
              <Input
                id="image-upload"
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                onChange={handleImageUpload}
                className="hidden"
              />
            </Label>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
