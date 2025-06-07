
import { Category } from '@/types/app';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CategoryGridProps {
  categories: Category[];
  onCategoryClick: (categoryId: string) => void;
}

const CategoryGrid = ({ categories, onCategoryClick }: CategoryGridProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Browse by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Card
            key={category.id}
            className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
            onClick={() => onCategoryClick(category.id)}
          >
            <div className="flex flex-col items-center space-y-3">
              <div
                className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center text-2xl",
                  category.color
                )}
              >
                {category.icon}
              </div>
              <div className="text-center">
                <h3 className="font-medium text-sm">{category.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {category.app_count.toLocaleString()} apps
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
