import { useDesignerState } from '../../state/useDesignerState';
import { getGarmentTemplate } from '../../utils/garmentTemplates';
import { exportDesignToPng } from '../../utils/exportDesignPng';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

export default function ExportDesignButton() {
  const { garmentType, baseColor, elements } = useDesignerState();

  const handleExport = async () => {
    try {
      const template = getGarmentTemplate(garmentType);
      await exportDesignToPng(template, baseColor, elements);
      toast.success('Design exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export design');
    }
  };

  return (
    <Button onClick={handleExport} variant="default" size="sm">
      <Download className="w-4 h-4 mr-2" />
      Export PNG
    </Button>
  );
}
