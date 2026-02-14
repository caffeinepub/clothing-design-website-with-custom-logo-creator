import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import LogoCanvas2D from '../components/logo-maker/LogoCanvas2D';
import LogoControlsPanel from '../components/logo-maker/LogoControlsPanel';
import LogoExportButton from '../components/logo-maker/LogoExportButton';
import { useDesignerState } from '../state/useDesignerState';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function LogoMakerPage() {
  const navigate = useNavigate();
  const designerState = useDesignerState();
  const [logoElements, setLogoElements] = useState<any[]>([]);

  const handleAddToDesign = (logoDataUrl: string) => {
    designerState.addElement({
      id: `logo-${Date.now()}`,
      type: 'logo',
      x: 400,
      y: 300,
      width: 200,
      height: 200,
      rotation: 0,
      content: logoDataUrl,
      color: '',
    });
    toast.success('Logo added to design! Go to Designer to see it.');
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      {/* Top Toolbar */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/designer' })}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Designer
          </Button>
          <h2 className="text-lg font-semibold">Logo Maker</h2>
          <LogoExportButton logoElements={logoElements} onAddToDesign={handleAddToDesign} />
        </div>
      </div>

      {/* Main Logo Maker Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center bg-muted/20 p-4">
          <LogoCanvas2D elements={logoElements} onElementsChange={setLogoElements} />
        </div>

        {/* Right Sidebar */}
        <div className="w-80 border-l border-border bg-card/30 overflow-y-auto">
          <LogoControlsPanel elements={logoElements} onElementsChange={setLogoElements} />
        </div>
      </div>
    </div>
  );
}
