import { useState } from 'react';
import { useGetPaginatedArticles, useGetArticlesByCategory } from '../hooks/useQueries';
import { Category } from '../backend';
import CategoryTabs from '../components/CategoryTabs';
import NewsCard from '../components/NewsCard';
import PaginationControls from '../components/PaginationControls';
import { Skeleton } from '@/components/ui/skeleton';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function NewsFeedPage() {
  const { identity } = useInternetIdentity();
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(0);

  const isAuthenticated = !!identity;

  const {
    data: paginatedArticles,
    isLoading: paginatedLoading,
    error: paginatedError,
  } = useGetPaginatedArticles(currentPage, activeCategory === 'all');

  const {
    data: categoryArticles,
    isLoading: categoryLoading,
    error: categoryError,
  } = useGetArticlesByCategory(activeCategory as Category, activeCategory !== 'all');

  const articles = activeCategory === 'all' ? paginatedArticles : categoryArticles;
  const isLoading = activeCategory === 'all' ? paginatedLoading : categoryLoading;
  const error = activeCategory === 'all' ? paginatedError : categoryError;

  const handleCategoryChange = (category: Category | 'all') => {
    setActiveCategory(category);
    setCurrentPage(0);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>Please log in to view news articles.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CategoryTabs activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load articles. Please try again.</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      ) : articles && articles.length > 0 ? (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <NewsCard key={article.id.toString()} article={article} />
            ))}
          </div>

          {activeCategory === 'all' && (
            <PaginationControls currentPage={currentPage} onPageChange={setCurrentPage} hasArticles={articles.length === 10} />
          )}
        </>
      ) : (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold text-muted-foreground">No articles found</p>
            <p className="text-sm text-muted-foreground">Check back later for new updates!</p>
          </div>
        </div>
      )}
    </div>
  );
}
