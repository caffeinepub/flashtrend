import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Category } from '../backend';
import { useCreateArticle } from '../hooks/useQueries';
import { toast } from 'sonner';
import CategoryIcon from './CategoryIcon';

const MAX_SUMMARY_LENGTH = 280;

export default function CreateArticleForm() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [source, setSource] = useState('');

  const { mutate: createArticle, isPending } = useCreateArticle();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !summary.trim() || !category || !source.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (summary.length > MAX_SUMMARY_LENGTH) {
      toast.error(`Summary must be ${MAX_SUMMARY_LENGTH} characters or less`);
      return;
    }

    createArticle(
      {
        title: title.trim(),
        summary: summary.trim(),
        category,
        source: source.trim(),
      },
      {
        onSuccess: () => {
          toast.success('Article created successfully!');
          setTitle('');
          setSummary('');
          setCategory('');
          setSource('');
        },
        onError: (error) => {
          toast.error('Failed to create article: ' + error.message);
        },
      }
    );
  };

  const remainingChars = MAX_SUMMARY_LENGTH - summary.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create News Article</CardTitle>
        <CardDescription>Add a new article to the FlashTrend feed</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter article title"
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="summary">Summary * (max {MAX_SUMMARY_LENGTH} characters)</Label>
              <span className={`text-xs font-medium ${remainingChars < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {remainingChars} remaining
              </span>
            </div>
            <Textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Enter a short summary"
              disabled={isPending}
              rows={4}
              className={remainingChars < 0 ? 'border-destructive' : ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as Category)} disabled={isPending}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Category.politics}>
                  <div className="flex items-center gap-2">
                    <CategoryIcon category={Category.politics} className="h-4 w-4" />
                    Politics
                  </div>
                </SelectItem>
                <SelectItem value={Category.viral}>
                  <div className="flex items-center gap-2">
                    <CategoryIcon category={Category.viral} className="h-4 w-4" />
                    Viral
                  </div>
                </SelectItem>
                <SelectItem value={Category.trending}>
                  <div className="flex items-center gap-2">
                    <CategoryIcon category={Category.trending} className="h-4 w-4" />
                    Trending
                  </div>
                </SelectItem>
                <SelectItem value={Category.social}>
                  <div className="flex items-center gap-2">
                    <CategoryIcon category={Category.social} className="h-4 w-4" />
                    Social
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">Source *</Label>
            <Input
              id="source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Enter source name"
              disabled={isPending}
            />
          </div>

          <Button type="submit" className="w-full font-bold" disabled={isPending}>
            {isPending ? 'Creating...' : 'Create Article'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
