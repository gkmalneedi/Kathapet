import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { ArticleCard } from "@/components/ArticleCard";
import { AdSpace } from "@/components/AdSpace";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Category, ArticleWithCategory } from "@shared/schema";

const ARTICLES_PER_PAGE = 12;

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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Category not found</h1>
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
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-4">
            <span
              className="w-2 h-12 mr-4"
              style={{ backgroundColor: category.color }}
            ></span>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{category.name}</h1>
              <p className="text-gray-600 mt-2">{category.description}</p>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Ad Space */}
        <AdSpace className="mb-8" />

        {/* Articles Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {[...Array(ARTICLES_PER_PAGE)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {articlesData?.articles.map((article, index) => (
              <div key={article.id}>
                <ArticleCard article={article} showCategory={false} />
                {/* Insert ads between articles */}
                {(index + 1) % 6 === 0 && (
                  <div className="col-span-full mt-6 mb-6">
                    <AdSpace size="rectangle" className="mx-auto max-w-sm" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            <div className="flex space-x-2">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    onClick={() => setCurrentPage(pageNum)}
                    size="sm"
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
            >
              Next
            </Button>
          </div>
        )}

        {/* Bottom Ad Space */}
        <AdSpace className="mt-12" />
      </main>
    </div>
  );
}
