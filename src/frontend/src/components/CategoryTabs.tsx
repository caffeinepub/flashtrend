import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Category } from '../backend';
import CategoryIcon from './CategoryIcon';

interface CategoryTabsProps {
  activeCategory: Category | 'all';
  onCategoryChange: (category: Category | 'all') => void;
}

const categories: Array<{ value: Category | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: Category.politics, label: 'Politics' },
  { value: Category.viral, label: 'Viral' },
  { value: Category.trending, label: 'Trending' },
  { value: Category.social, label: 'Social' },
];

export default function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <Tabs value={activeCategory} onValueChange={(value) => onCategoryChange(value as Category | 'all')} className="w-full">
      <TabsList className="grid w-full grid-cols-5 h-auto p-1">
        {categories.map((category) => (
          <TabsTrigger
            key={category.value}
            value={category.value}
            className="flex items-center gap-2 data-[state=active]:bg-flash-primary data-[state=active]:text-white font-bold py-3"
          >
            {category.value !== 'all' && <CategoryIcon category={category.value as Category} className="h-5 w-5" />}
            {category.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
