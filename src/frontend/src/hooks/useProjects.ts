import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { Project, ProjectSummary } from '../backend';

export function useGetUserProjects() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<ProjectSummary[]>({
    queryKey: ['projects', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getUserProjects(identity.getPrincipal());
    },
    enabled: !!actor && !!identity && !actorFetching,
  });
}

export function useGetProject(projectId: string | null) {
  const { actor } = useActor();

  return useQuery<Project | null>({
    queryKey: ['project', projectId],
    queryFn: async () => {
      if (!actor || !projectId) return null;
      return actor.getProject(projectId);
    },
    enabled: !!actor && !!projectId,
  });
}

export function useCreateProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { projectName: string; garmentType: string; baseColor: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createProject(params.projectName, params.garmentType, params.baseColor);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { projectId: string; project: Project }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProject(params.projectId, params.project);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
    },
  });
}

export function useDeleteProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteProject(projectId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
