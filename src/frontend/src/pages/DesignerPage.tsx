import { useState, useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetProject, useUpdateProject } from '../hooks/useProjects';
import { useDesignerState } from '../state/useDesignerState';
import { deserializeProject } from '../state/projectSerialization';
import GarmentSelector from '../components/designer/GarmentSelector';
import BaseColorPicker from '../components/designer/BaseColorPicker';
import DesignCanvas2D from '../components/designer/DesignCanvas2D';
import LayersPanel from '../components/designer/LayersPanel';
import SelectionToolbar from '../components/designer/SelectionToolbar';
import ExportDesignButton from '../components/designer/ExportDesignButton';
import OnboardingTips from '../components/designer/OnboardingTips';
import { Button } from '@/components/ui/button';
import { Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function DesignerPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const searchParams = useSearch({ strict: false }) as { projectId?: string };
  const projectId = searchParams.projectId || null;

  const { data: project, isLoading: projectLoading } = useGetProject(projectId);
  const updateProject = useUpdateProject();
  const designerState = useDesignerState();

  const [isSaving, setIsSaving] = useState(false);

  // Load project into state
  useEffect(() => {
    if (project && !projectLoading) {
      const state = deserializeProject(project);
      designerState.loadState(state);
    }
  }, [project, projectLoading]);

  const handleSave = async () => {
    if (!identity) {
      toast.error('Please sign in to save your project');
      return;
    }

    if (!projectId || !project) {
      toast.error('No project loaded');
      return;
    }

    setIsSaving(true);
    try {
      const updatedProject = {
        ...project,
        garmentType: designerState.garmentType,
        baseColor: designerState.baseColor,
        elements: designerState.elements.map((el) => ({
          type: el.type,
          posX: BigInt(Math.round(el.x)),
          posY: BigInt(Math.round(el.y)),
          color: el.color || '#000000',
          size: BigInt(Math.round(el.width)),
          content: el.content || '',
        })),
        lastModified: BigInt(Date.now()) * BigInt(1_000_000),
      };

      await updateProject.mutateAsync({ projectId, project: updatedProject });
      toast.success('Project saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save project');
    } finally {
      setIsSaving(false);
    }
  };

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Sign In Required</h2>
        <p className="text-muted-foreground mb-8">Please sign in to access the designer.</p>
        <Button onClick={() => navigate({ to: '/' })}>Go to Home</Button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      {/* Top Toolbar */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/projects' })}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Projects
            </Button>
            {project && <span className="text-sm font-medium">{project.projectName}</span>}
          </div>

          <div className="flex items-center gap-3">
            <GarmentSelector />
            <BaseColorPicker />
            <Button onClick={handleSave} disabled={isSaving || !projectId} size="sm">
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <ExportDesignButton />
          </div>
        </div>
      </div>

      {/* Main Designer Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center bg-muted/20 p-4 overflow-auto">
          <DesignCanvas2D />
        </div>

        {/* Right Sidebar */}
        <div className="w-80 border-l border-border bg-card/30 overflow-y-auto">
          <SelectionToolbar />
          <LayersPanel />
        </div>
      </div>

      <OnboardingTips />
    </div>
  );
}
