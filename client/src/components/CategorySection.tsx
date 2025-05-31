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
    <section id={category.slug} className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center">
          <span 
            className="w-1 h-8 mr-3"
            style={{ backgroundColor: category.color }}
          ></span>
          {category.name}
        </h2>
        <Link
          href={`/category/${category.slug}`}
          className="font-semibold flex items-center transition-colors hover:underline"
          style={{ color: category.color }}
        >
          View All <ArrowRight className="ml-2 h-4 w-4" />
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
