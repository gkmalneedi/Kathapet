import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { ArrowLeft, Calendar, User, Eye, Facebook, Twitter, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AdSpace } from "@/components/AdSpace";
import type { ArticleWithCategory } from "@shared/schema";

export default function ArticlePage() {
  const params = useParams();
  const articleSlug = params.slug;

  const { data: article, isLoading } = useQuery<ArticleWithCategory>({
    queryKey: [`/api/articles/${articleSlug}`],
    enabled: !!articleSlug,
  });

  const { data: relatedArticles = [] } = useQuery<{ articles: ArticleWithCategory[] }>({
    queryKey: [`/api/articles?categoryId=${article?.categoryId}&limit=3`],
    enabled: !!article?.categoryId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-6 sm:h-8 bg-gray-300 rounded w-3/4"></div>
              <div className="h-48 sm:h-64 bg-gray-300 rounded"></div>
              <div className="space-y-2">
                <div className="h-3 sm:h-4 bg-gray-300 rounded"></div>
                <div className="h-3 sm:h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Article not found</h1>
            <Link href="/">
              <Button className="mt-4" size="sm">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href={`/category/${article.category.slug}`}>
            <Button variant="ghost" className="mb-4 sm:mb-6" size="sm">
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Back to {article.category.name}
            </Button>
          </Link>

          {/* Article Header */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <div className="flex flex-wrap items-center gap-2 sm:space-x-4 mb-3 sm:mb-4">
              <Badge
                style={{ backgroundColor: article.category.color }}
                className="text-white text-xs"
              >
                {article.category.name}
              </Badge>
              {article.isBreaking && (
                <Badge className="bg-red-600 text-xs">Breaking News</Badge>
              )}
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
              {article.title}
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4 sm:mb-6">{article.excerpt}</p>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:space-x-6 text-xs sm:text-sm text-gray-500">
              <div className="flex items-center">
                <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="truncate">{article.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                {timeAgo(article.publishedAt!)}
              </div>
              <div className="flex items-center">
                <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                {article.views || 0} views
              </div>
            </div>
          </div>

          {/* Article Image */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {/* Article Content */}
            <div className="lg:col-span-3">
              <Card>
                <CardContent className="p-3 sm:p-4 md:p-6 lg:p-8">
                  <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none">
                    {article.content.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-3 sm:mb-4 text-gray-800 leading-relaxed text-sm sm:text-base">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  
                  <Separator className="my-4 sm:my-6 md:my-8" />
                  
                  {/* Social Sharing */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <h3 className="text-base sm:text-lg font-semibold">Share this article</h3>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full sm:w-auto justify-start text-xs sm:text-sm"
                        onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                      >
                        <Facebook className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        Facebook
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full sm:w-auto justify-start text-xs sm:text-sm"
                        onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`, '_blank')}
                      >
                        <Twitter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        Twitter
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full sm:w-auto justify-start text-xs sm:text-sm"
                        onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(article.title + ' ' + window.location.href)}`, '_blank')}
                      >
                        <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        WhatsApp
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Ad Space */}
              <AdSpace className="mt-4 sm:mt-6 md:mt-8" />
            </div>

            {/* Sidebar */}
            <div className="space-y-4 sm:space-y-6">
              {/* Ad Space */}
              <AdSpace size="square" />
              
              {/* Related Articles */}
              <Card>
                <CardContent className="p-3 sm:p-4 md:p-6">
                  <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Related Articles</h3>
                  <div className="space-y-3 sm:space-y-4">
                    {(Array.isArray(relatedArticles) ? relatedArticles : relatedArticles?.articles || [])
                      .filter((related: any) => related.id !== article.id)
                      .slice(0, 3)
                      .map((relatedArticle: any) => (
                        <Link key={relatedArticle.id} href={`/article/${relatedArticle.slug}`}>
                          <div className="flex space-x-2 sm:space-x-3 p-2 rounded hover:bg-gray-50 transition-colors">
                            <img
                              src={relatedArticle.imageUrl}
                              alt={relatedArticle.title}
                              className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs sm:text-sm font-medium line-clamp-2 mb-1">
                                {relatedArticle.title}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {timeAgo(relatedArticle.publishedAt!)}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Another Ad Space */}
              <AdSpace size="rectangle" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
