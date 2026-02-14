import { useDesignerState } from '../../state/useDesignerState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Trash2, RotateCw } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

export default function SelectionToolbar() {
  const { selectedElementId, elements, duplicateElement, deleteElement, updateElement } = useDesignerState();

  const selectedElement = elements.find((el) => el.id === selectedElementId);

  if (!selectedElement) {
    return (
      <Card className="border-0 rounded-none">
        <CardHeader>
          <CardTitle className="text-lg">Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">No element selected</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 rounded-none">
      <CardHeader>
        <CardTitle className="text-lg">Selection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => duplicateElement(selectedElement.id)}
          >
            <Copy className="w-4 h-4 mr-2" />
            Duplicate
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={() => deleteElement(selectedElement.id)}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Size: {Math.round(selectedElement.width)}px</Label>
          <Slider
            value={[selectedElement.width]}
            onValueChange={([width]) => updateElement(selectedElement.id, { width, height: width })}
            min={50}
            max={500}
            step={10}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm flex items-center gap-2">
            <RotateCw className="w-4 h-4" />
            Rotation: {Math.round(selectedElement.rotation)}°
          </Label>
          <Slider
            value={[selectedElement.rotation]}
            onValueChange={([rotation]) => updateElement(selectedElement.id, { rotation })}
            min={0}
            max={360}
            step={15}
          />
        </div>
      </CardContent>
    </Card>
  );
}
