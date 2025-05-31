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
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {article.isBreaking && (
            <Badge className="absolute top-2 left-2 bg-red-600">
              Breaking
            </Badge>
          )}
        </div>
        <CardContent className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span>By {article.author}</span>
              <div className="flex items-center space-x-1">
                <Eye className="h-3 w-3" />
                <span>{article.views || 0} views</span>
              </div>
            </div>
            <span>{timeAgo(article.publishedAt!)}</span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
