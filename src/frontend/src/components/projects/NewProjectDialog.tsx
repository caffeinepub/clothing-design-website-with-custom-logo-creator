import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCreateProject } from '../../hooks/useProjects';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NewProjectDialog({ open, onOpenChange }: NewProjectDialogProps) {
  const navigate = useNavigate();
  const createProject = useCreateProject();
  const [projectName, setProjectName] = useState('');
  const [garmentType, setGarmentType] = useState('tshirt');
  const [baseColor, setBaseColor] = useState('#ffffff');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    try {
      const projectId = await createProject.mutateAsync({
        projectName: projectName.trim(),
        garmentType,
        baseColor,
      });
      toast.success('Project created!');
      onOpenChange(false);
      setProjectName('');
      navigate({ to: '/designer', search: { projectId } });
    } catch (error) {
      console.error('Create error:', error);
      toast.error('Failed to create project');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>Choose a garment type and give your project a name.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="My Awesome Design"
              autoFocus
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Garment Type</Label>
            <RadioGroup value={garmentType} onValueChange={setGarmentType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tshirt" id="tshirt" />
                <Label htmlFor="tshirt" className="cursor-pointer">
                  T-Shirt
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hoodie" id="hoodie" />
                <Label htmlFor="hoodie" className="cursor-pointer">
                  Hoodie
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cap" id="cap" />
                <Label htmlFor="cap" className="cursor-pointer">
                  Cap
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="baseColor">Base Color</Label>
            <div className="flex gap-2">
              <Input
                id="baseColor"
                type="color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="w-20 h-10"
              />
              <Input value={baseColor} onChange={(e) => setBaseColor(e.target.value)} className="flex-1" />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={createProject.isPending || !projectName.trim()}>
            {createProject.isPending ? 'Creating...' : 'Create Project'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
