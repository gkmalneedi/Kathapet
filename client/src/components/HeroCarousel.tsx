import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import type { ArticleWithCategory } from "@shared/schema";

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: articles = [] } = useQuery<ArticleWithCategory[]>({
    queryKey: ["/api/breaking?limit=3"],
  });

  useEffect(() => {
    if (articles.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % articles.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [articles.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % articles.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + articles.length) % articles.length);
  };

  if (articles.length === 0) {
    return (
      <section className="relative bg-gray-900 overflow-hidden">
        <div className="h-64 sm:h-80 md:h-96 lg:h-[500px] flex items-center justify-center">
          <div className="text-white text-lg sm:text-xl">Loading breaking news...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-gray-900 overflow-hidden">
      <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px]">
        {articles.map((article, index) => (
          <div
            key={article.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            <Link href={`/article/${article.slug}`} className="absolute inset-0 flex items-center cursor-pointer group">
              <div className="container mx-auto px-2 sm:px-4">
                <div className="max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl">
                  <Badge
                    variant="secondary"
                    className="mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm"
                    style={{ backgroundColor: article.category.color }}
                  >
                    {article.category.name}
                  </Badge>
                  <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-6xl font-bold text-white mb-2 sm:mb-3 md:mb-4 leading-tight group-hover:text-blue-200 transition-colors">
                    {article.title}
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 mb-3 sm:mb-4 md:mb-6 line-clamp-2 sm:line-clamp-3">
                    {article.excerpt}
                  </p>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm md:text-base sm:size-default md:size-lg">
                    Read Full Story
                  </Button>
                </div>
              </div>
            </Link>
          </div>
        ))}

        {/* Carousel Navigation */}
        <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3">
          {articles.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-opacity ${
                index === currentSlide ? "bg-white opacity-100" : "bg-white opacity-50"
              }`}
            />
          ))}
        </div>

        {/* Carousel Arrows */}
        <Button
          variant="ghost"
          size="sm"
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 sm:p-3"
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 sm:p-3"
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
        </Button>
      </div>
    </section>
  );
}
