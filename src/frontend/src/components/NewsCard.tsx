import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { NewsArticle } from '../backend';
import { formatRelativeTime } from '../utils/timeFormat';
import CategoryIcon from './CategoryIcon';
import { useShareArticle } from '../hooks/useShareArticle';
import { toast } from 'sonner';

interface NewsCardProps {
  article: NewsArticle;
}

export default function NewsCard({ article }: NewsCardProps) {
  const { shareArticle, isPending } = useShareArticle();

  const handleShare = async () => {
    try {
      const text = `${article.title}\n\n${article.summary}\n\nSource: ${article.source}`;
      await navigator.clipboard.writeText(text);

      shareArticle(article.id, {
        onSuccess: () => {
          toast.success('Copied to clipboard!');
        },
        onError: (error) => {
          toast.error('Failed to share: ' + error.message);
        },
      });
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const categoryColors = {
    politics: 'bg-flash-politics text-white',
    viral: 'bg-flash-viral text-white',
    trending: 'bg-flash-trending text-white',
    social: 'bg-flash-social text-white',
  };

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200 border-2">
      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-center justify-between">
          <Badge className={`${categoryColors[article.category]} font-bold flex items-center gap-1.5 px-3 py-1`}>
            <CategoryIcon category={article.category} className="h-4 w-4" />
            {article.category.toUpperCase()}
          </Badge>
          <span className="text-xs text-muted-foreground font-medium">{formatRelativeTime(Number(article.timestamp))}</span>
        </div>
        <h3 className="text-xl font-black leading-tight tracking-tight line-clamp-2">{article.title}</h3>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">{article.summary}</p>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-3 border-t">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Share2 className="h-4 w-4" />
          <span className="font-semibold">{Number(article.shareCount)}</span>
          <span>shares</span>
        </div>
        <Button onClick={handleShare} disabled={isPending} size="sm" variant="outline" className="gap-2 font-bold">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </CardFooter>
    </Card>
  );
}
