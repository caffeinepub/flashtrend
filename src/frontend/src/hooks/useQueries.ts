import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Category, NewsArticle, UserProfile, ArticleId } from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Admin Check
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// News Article Queries
export function useGetPaginatedArticles(page: number, enabled: boolean = true) {
  const { actor, isFetching } = useActor();

  return useQuery<NewsArticle[]>({
    queryKey: ['articles', 'paginated', page],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPaginatedArticles(BigInt(page));
    },
    enabled: !!actor && !isFetching && enabled,
  });
}

export function useGetArticlesByCategory(category: Category, enabled: boolean = true) {
  const { actor, isFetching } = useActor();

  return useQuery<NewsArticle[]>({
    queryKey: ['articles', 'category', category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getArticlesByCategory(category);
    },
    enabled: !!actor && !isFetching && enabled,
  });
}

export function useCreateArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { title: string; summary: string; category: Category; source: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createNewsArticle(data.title, data.summary, data.category, data.source);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
}

export function useShareArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (articleId: ArticleId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.shareNewsArticle(articleId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
}
