import { useNavigate } from '@tanstack/react-router';
import { useDeleteProject } from '../../hooks/useProjects';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import type { ProjectSummary } from '../../backend';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ProjectListProps {
  projects: ProjectSummary[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  const navigate = useNavigate();
  const deleteProject = useDeleteProject();

  const handleDelete = async (projectId: string, projectName: string) => {
    try {
      await deleteProject.mutateAsync(projectId);
      toast.success(`"${projectName}" deleted successfully`);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete project');
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground text-lg mb-4">No projects yet</p>
        <p className="text-sm text-muted-foreground">Create your first design to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card key={project.id} className="hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-start justify-between">
              <span className="truncate">{project.projectName}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Last modified: {formatDate(project.lastModified)}
            </p>
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() => navigate({ to: '/designer', search: { projectId: project.id } })}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Project?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{project.projectName}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(project.id, project.projectName)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
