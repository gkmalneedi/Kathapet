import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { ArticleCard } from "./ArticleCard";
import type { Category, ArticleWithCategory } from "@shared/schema";

interface CategorySectionProps {
  category: Category;
  articles: ArticleWithCategory[];
}

export function CategorySection({ category, articles }: CategorySectionProps) {
  return (
    <section id={category.slug} className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-5 md:mb-6 space-y-2 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
          <span 
            className="w-1 h-6 sm:h-7 md:h-8 mr-2 sm:mr-3"
            style={{ backgroundColor: category.color }}
          ></span>
          {category.name}
        </h2>
        <Link
          href={`/category/${category.slug}`}
          className="text-sm sm:text-base font-semibold flex items-center transition-colors hover:underline self-start sm:self-center"
          style={{ color: category.color }}
        >
          View All <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            showCategory={false}
          />
        ))}
      </div>
    </section>
  );
}
