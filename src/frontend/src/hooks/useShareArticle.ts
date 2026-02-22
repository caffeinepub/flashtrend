import { ArticleId } from '../backend';
import { useShareArticle as useShareArticleMutation } from './useQueries';

export function useShareArticle() {
  const mutation = useShareArticleMutation();

  const shareArticle = (
    articleId: ArticleId,
    options?: {
      onSuccess?: () => void;
      onError?: (error: Error) => void;
    }
  ) => {
    mutation.mutate(articleId, {
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    });
  };

  return {
    shareArticle,
    isPending: mutation.isPending,
  };
}
