import { useDesignerState } from '../../state/useDesignerState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layers, ChevronUp, ChevronDown } from 'lucide-react';

export default function LayersPanel() {
  const { elements, selectedElementId, selectElement, moveElementUp, moveElementDown } = useDesignerState();

  return (
    <Card className="border-0 rounded-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Layers className="w-5 h-5" />
          Layers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {elements.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No elements yet</p>
        ) : (
          elements.map((element, index) => (
            <div
              key={element.id}
              className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors ${
                element.id === selectedElementId
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => selectElement(element.id)}
            >
              <div className="flex-1 truncate text-sm">
                {element.type === 'logo' ? '🖼️ Logo' : element.type === 'text' ? '📝 Text' : '⬛ Shape'}
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveElementUp(element.id);
                  }}
                  disabled={index === elements.length - 1}
                >
                  <ChevronUp className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveElementDown(element.id);
                  }}
                  disabled={index === 0}
                >
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
