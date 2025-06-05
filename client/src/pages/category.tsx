import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { ArticleCard } from "@/components/ArticleCard";
import { AdSpace } from "@/components/AdSpace";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Category, ArticleWithCategory } from "@shared/schema";

const ARTICLES_PER_PAGE = 10;

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.slug;
  const [currentPage, setCurrentPage] = useState(1);

  const { data: category } = useQuery<Category>({
    queryKey: [`/api/categories/${categorySlug}`],
    enabled: !!categorySlug,
  });

  const { data: articlesData, isLoading } = useQuery<{
    articles: ArticleWithCategory[];
    totalCount: number;
    hasMore: boolean;
  }>({
    queryKey: [`/api/categories/${category?.id}/articles`, currentPage],
    enabled: !!category?.id,
    queryFn: async () => {
      const offset = (currentPage - 1) * ARTICLES_PER_PAGE;
      const response = await fetch(`/api/categories/${category?.id}/articles?limit=${ARTICLES_PER_PAGE}&offset=${offset}`);
      return response.json();
    },
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [categorySlug]);

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Category not found</h1>
          </div>
        </div>
      </div>
    );
  }

  const totalPages = articlesData ? Math.ceil(articlesData.totalCount / ARTICLES_PER_PAGE) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
          <div className="flex items-center mb-2 sm:mb-4">
            <span
              className="w-1 sm:w-2 h-8 sm:h-10 md:h-12 mr-2 sm:mr-3 md:mr-4"
              style={{ backgroundColor: category.color }}
            ></span>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">{category.name}</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">{category.description}</p>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
        {/* Ad Space */}
        <AdSpace className="mb-4 sm:mb-6 md:mb-8" />

        {/* Articles Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
            {[...Array(ARTICLES_PER_PAGE)].map((_, i) => (
              <div key={i} className="space-y-2 sm:space-y-3">
                <Skeleton className="h-32 sm:h-40 md:h-48 w-full" />
                <Skeleton className="h-3 sm:h-4 w-3/4" />
                <Skeleton className="h-3 sm:h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
            {articlesData?.articles.map((article, index) => (
              <div key={article.id}>
                <ArticleCard article={article} showCategory={false} />
                {/* Insert ads between articles */}
                {(index + 1) % 6 === 0 && (
                  <div className="col-span-full mt-3 sm:mt-4 md:mt-6 mb-3 sm:mb-4 md:mb-6">
                    <AdSpace size="rectangle" className="mx-auto max-w-xs sm:max-w-sm" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              size="sm"
              className="w-full sm:w-auto"
            >
              Previous
            </Button>
            
            <div className="flex space-x-1 sm:space-x-2">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    onClick={() => setCurrentPage(pageNum)}
                    size="sm"
                    className="min-w-8 sm:min-w-10"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              size="sm"
              className="w-full sm:w-auto"
            >
              Next
            </Button>
          </div>
        )}

        {/* Bottom Ad Space */}
        <AdSpace className="mt-6 sm:mt-8 md:mt-12" />
      </main>
    </div>
  );
}
