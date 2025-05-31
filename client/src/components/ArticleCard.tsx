import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Eye } from "lucide-react";
import type { ArticleWithCategory } from "@shared/schema";

interface ArticleCardProps {
  article: ArticleWithCategory;
  showCategory?: boolean;
}

export function ArticleCard({ article, showCategory = false }: ArticleCardProps) {
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
            className="w-full h-32 sm:h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {article.isBreaking && (
            <Badge className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-red-600 text-xs">
              Breaking
            </Badge>
          )}
        </div>
        <CardContent className="p-2 sm:p-3 md:p-4 lg:p-5">
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">
            {article.excerpt}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 space-y-1 sm:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="truncate">By {article.author}</span>
              <div className="flex items-center space-x-1">
                <Eye className="h-3 w-3 flex-shrink-0" />
                <span>{article.views || 0}</span>
              </div>
            </div>
            <span className="text-xs">{timeAgo(article.publishedAt!)}</span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
