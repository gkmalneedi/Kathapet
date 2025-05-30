import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { ArticleWithCategory } from "@shared/schema";

interface ArticleCardProps {
  article: ArticleWithCategory;
  showCategory?: boolean;
}

export function ArticleCard({ article, showCategory = true }: ArticleCardProps) {
  const timeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <Link href={`/article/${article.slug}`}>
        <div className="relative">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {article.isBreaking && (
            <Badge className="absolute top-2 left-2 bg-red-600">
              Breaking
            </Badge>
          )}
        </div>
        <CardContent className="p-5">
          {showCategory && (
            <Badge
              variant="secondary"
              className="mb-2"
              style={{ backgroundColor: article.category.color, color: 'white' }}
            >
              {article.category.name}
            </Badge>
          )}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>By {article.author}</span>
            <span>{timeAgo(article.publishedAt!)}</span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
