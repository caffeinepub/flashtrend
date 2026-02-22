import { Category } from '../backend';

interface CategoryIconProps {
  category: Category;
  className?: string;
}

const categoryIcons = {
  [Category.politics]: '/assets/generated/category-politics.dim_64x64.png',
  [Category.viral]: '/assets/generated/category-viral.dim_64x64.png',
  [Category.trending]: '/assets/generated/category-trending.dim_64x64.png',
  [Category.social]: '/assets/generated/category-social.dim_64x64.png',
};

export default function CategoryIcon({ category, className = 'h-6 w-6' }: CategoryIconProps) {
  return <img src={categoryIcons[category]} alt={category} className={className} />;
}
