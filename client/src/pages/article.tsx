
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { ArrowLeft, Calendar, User, Eye, Facebook, Twitter, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AdSpace } from "@/components/AdSpace";
import type { ArticleWithCategory } from "@shared/schema";

// Mock article data
const mockArticle = {
  id: 1,
  title: "Breaking News: Major Development in Current Affairs That Will Impact Everyone",
  excerpt: "This comprehensive article covers the latest developments in current affairs, providing detailed analysis and expert insights on the situation.",
  content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.`,
  slug: "breaking-news-major-development",
  author: "John Doe",
  publishedAt: new Date(),
  imageUrl: "https://picsum.photos/800/400?random=1",
  isBreaking: true,
  views: 15420,
  categoryId: 1,
  category: {
    id: 1,
    name: "Political",
    slug: "political",
    description: "Political news and analysis",
    color: "#efbf04"
  }
};

const relatedArticles = Array.from({ length: 3 }, (_, index) => ({
  id: index + 2,
  title: `Related Article ${index + 1}: More Important News Coverage`,
  slug: `related-article-${index + 1}`,
  imageUrl: `https://picsum.photos/200/150?random=${index + 2}`,
  publishedAt: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000),
  categoryId: 1
}));

export default function ArticlePage() {
  const params = useParams();
  const articleSlug = params.slug;

  const article = mockArticle;

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

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = article.title;
  const shareDescription = article.excerpt;
  const shareImage = article.imageUrl;

  // Generate Open Graph meta tags
  const generateOGTags = () => {
    if (typeof document !== 'undefined') {
      // Remove existing OG tags
      const existingOGTags = document.querySelectorAll('meta[property^="og:"], meta[name="twitter:"]');
      existingOGTags.forEach(tag => tag.remove());

      // Add new OG tags
      const ogTags = [
        { property: 'og:title', content: shareTitle },
        { property: 'og:description', content: shareDescription },
        { property: 'og:image', content: shareImage },
        { property: 'og:url', content: shareUrl },
        { property: 'og:type', content: 'article' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: shareTitle },
        { name: 'twitter:description', content: shareDescription },
        { name: 'twitter:image', content: shareImage },
      ];

      ogTags.forEach(tag => {
        const meta = document.createElement('meta');
        if (tag.property) meta.setAttribute('property', tag.property);
        if (tag.name) meta.setAttribute('name', tag.name);
        meta.setAttribute('content', tag.content);
        document.head.appendChild(meta);
      });
    }
  };

  // Generate OG tags when component mounts
  React.useEffect(() => {
    generateOGTags();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link href="/" className="flex items-center space-x-2">
              <img 
                src="/attached_assets/Kathapet v2 copy.png" 
                alt="KathaPet Logo" 
                className="h-8 sm:h-10 w-auto"
              />
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              {['Political', 'Movies', 'Facts', 'Lifestyle', 'Biographies', 'Love Stories', 'Sports', 'Technology'].map((item) => (
                <Link
                  key={item}
                  href={`/category/${item.toLowerCase().replace(' ', '-')}`}
                  className="text-gray-700 hover:text-[#efbf04] font-medium transition-colors"
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

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
                className="text-white text-xs"
                style={{ backgroundColor: article.category.color }}
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
                        onClick={() => {
                          generateOGTags();
                          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
                        }}
                      >
                        <Facebook className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        Facebook
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full sm:w-auto justify-start text-xs sm:text-sm"
                        onClick={() => {
                          generateOGTags();
                          window.open(`https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`, '_blank');
                        }}
                      >
                        <Twitter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        X.com
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full sm:w-auto justify-start text-xs sm:text-sm"
                        onClick={() => {
                          generateOGTags();
                          window.open(`https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`, '_blank');
                        }}
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
                  <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 text-[#efbf04]">Related Articles</h3>
                  <div className="space-y-3 sm:space-y-4">
                    {relatedArticles.map((relatedArticle) => (
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
