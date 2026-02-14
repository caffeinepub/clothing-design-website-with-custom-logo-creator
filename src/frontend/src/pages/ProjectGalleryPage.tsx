import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetUserProjects } from '../hooks/useProjects';
import ProjectList from '../components/projects/ProjectList';
import NewProjectDialog from '../components/projects/NewProjectDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function ProjectGalleryPage() {
  const { identity } = useInternetIdentity();
  const { data: projects, isLoading } = useGetUserProjects();
  const [showNewDialog, setShowNewDialog] = useState(false);

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Sign In Required</h2>
        <p className="text-muted-foreground">Please sign in to view your projects.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Projects</h1>
          <p className="text-muted-foreground">Create and manage your clothing designs</p>
        </div>
        <Button onClick={() => setShowNewDialog(true)} size="lg">
          <Plus className="w-5 h-5 mr-2" />
          New Project
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      ) : (
        <ProjectList projects={projects || []} />
      )}

      <NewProjectDialog open={showNewDialog} onOpenChange={setShowNewDialog} />
    </div>
  );
}
