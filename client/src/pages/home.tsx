import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { HeroCarousel } from "@/components/HeroCarousel";
import { CategorySection } from "@/components/CategorySection";
import { AdSpace } from "@/components/AdSpace";
import { initializeMockData } from "@/lib/mockData";
import type { Category, ArticleWithCategory } from "@shared/schema";

export default function Home() {
  useEffect(() => {
    // Initialize mock data when the app loads
    initializeMockData();
  }, []);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: allArticles = [] } = useQuery<{ articles: ArticleWithCategory[] }>({
    queryKey: ["/api/articles?limit=100"],
  });

  // Group articles by category (6 articles per category for homepage)
  const articlesByCategory = categories.reduce((acc, category) => {
    acc[category.id] = (allArticles.articles || [])
      .filter(article => article.categoryId === category.id)
      .slice(0, 6);
    return acc;
  }, {} as Record<number, ArticleWithCategory[]>);

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroCarousel />
      
      <main className="container mx-auto px-4 py-8">
        {categories.map((category, index) => (
          <div key={category.id}>
            <CategorySection
              category={category}
              articles={articlesByCategory[category.id] || []}
            />
            
            {/* Add ad space after every 2 categories */}
            {(index + 1) % 2 === 0 && (
              <AdSpace className="mb-12" />
            )}
          </div>
        ))}
        
        {/* Additional Ad Spaces */}
        <AdSpace className="mb-8" />
        <AdSpace size="rectangle" className="mb-8" />
      </main>
    </div>
  );
}
