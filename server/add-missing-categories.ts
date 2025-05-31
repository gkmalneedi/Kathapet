import { db } from "./db";
import { categories, articles } from "@shared/schema";
import { eq } from "drizzle-orm";

const movieArticles = [
  {
    title: "Blockbuster Sequel Dominates Box Office",
    slug: "blockbuster-sequel-dominates-box-office",
    excerpt: "The highly anticipated sequel breaks opening weekend records with stellar performances.",
    content: "Movie enthusiasts worldwide celebrated as the latest blockbuster sequel shattered box office expectations. The film, featuring spectacular visual effects and compelling storytelling, has garnered critical acclaim and audience praise alike.",
    imageUrl: "https://images.unsplash.com/photo-1489599162748-e075e8d3b7a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    author: "Film Critic",
    views: 2500
  },
  {
    title: "Award Season Predictions Heat Up",
    slug: "award-season-predictions-heat-up",
    excerpt: "Industry experts weigh in on potential nominees for this year's major film awards.",
    content: "As award season approaches, film industry analysts are making their predictions for potential nominees across various categories. This year's competition promises to be fierce with several outstanding performances.",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    author: "Awards Reporter",
    views: 1800
  },
  {
    title: "Independent Film Festival Showcases Talent",
    slug: "independent-film-festival-showcases-talent",
    excerpt: "Emerging filmmakers present innovative storytelling at the annual independent film festival.",
    content: "The independent film festival has become a platform for emerging filmmakers to showcase their creative vision. This year's selection features diverse stories that challenge conventional narratives.",
    imageUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    author: "Festival Reporter",
    views: 1200
  },
  {
    title: "Streaming Platform Announces Original Series",
    slug: "streaming-platform-announces-original-series",
    excerpt: "Major streaming service reveals ambitious plans for new original content production.",
    content: "The streaming wars continue as major platforms invest heavily in original content. The latest announcement includes several high-budget series featuring A-list actors and renowned directors.",
    imageUrl: "https://images.unsplash.com/photo-1489599162748-e075e8d3b7a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    author: "Streaming Analyst",
    views: 3200
  },
  {
    title: "Documentary Wins International Recognition",
    slug: "documentary-wins-international-recognition",
    excerpt: "Groundbreaking documentary receives acclaim at prestigious international film festivals.",
    content: "A powerful documentary exploring social issues has garnered international recognition, winning awards at multiple film festivals and sparking important conversations worldwide.",
    imageUrl: "https://images.unsplash.com/photo-1489599162748-e075e8d3b7a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    author: "Documentary Reviewer",
    views: 1500
  }
];

const lifestyleArticles = [
  {
    title: "Sustainable Fashion Trends Take Center Stage",
    slug: "sustainable-fashion-trends-take-center-stage",
    excerpt: "Eco-conscious designers lead the way in creating environmentally friendly fashion.",
    content: "The fashion industry is embracing sustainability with innovative designs that prioritize environmental responsibility. Designers are using recycled materials and ethical production methods.",
    imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    author: "Fashion Editor",
    views: 2100
  },
  {
    title: "Home Design Innovations for Modern Living",
    slug: "home-design-innovations-for-modern-living",
    excerpt: "Interior designers reveal the latest trends in creating functional and beautiful living spaces.",
    content: "Modern home design focuses on creating spaces that are both functional and aesthetically pleasing. The latest trends emphasize minimalism, sustainability, and smart home technology integration.",
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    author: "Interior Designer",
    views: 1900
  },
  {
    title: "Wellness Routines for Busy Professionals",
    slug: "wellness-routines-for-busy-professionals",
    excerpt: "Health experts share practical wellness tips for maintaining balance in demanding careers.",
    content: "Maintaining wellness while managing a demanding career requires strategic planning and commitment. Health experts recommend simple daily practices that can significantly improve overall well-being.",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    author: "Wellness Coach",
    views: 2800
  },
  {
    title: "Travel Destinations for Digital Nomads",
    slug: "travel-destinations-for-digital-nomads",
    excerpt: "Explore the best locations for remote workers seeking adventure and connectivity.",
    content: "The rise of remote work has created new opportunities for digital nomads to explore the world while maintaining their careers. These destinations offer the perfect balance of connectivity and adventure.",
    imageUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    author: "Travel Writer",
    views: 3500
  },
  {
    title: "Nutrition Trends for Optimal Health",
    slug: "nutrition-trends-for-optimal-health",
    excerpt: "Nutritionists reveal the latest research on foods that promote long-term health.",
    content: "Recent nutritional research has identified key foods and eating patterns that support optimal health and longevity. These evidence-based recommendations can help improve energy and well-being.",
    imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    author: "Nutritionist",
    views: 2400
  }
];

export async function addMissingCategoryContent() {
  try {
    // Get the Movies and Lifestyle categories
    const moviesCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, "movies"));
    
    const lifestyleCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, "lifestyle"));

    if (moviesCategory.length > 0) {
      const existingMovieArticles = await db
        .select()
        .from(articles)
        .where(eq(articles.categoryId, moviesCategory[0].id));

      const moviesNeeded = Math.max(0, 20 - existingMovieArticles.length);
      
      if (moviesNeeded > 0) {
        const newMovieArticles = movieArticles.slice(0, moviesNeeded).map((article, index) => ({
          ...article,
          slug: `${article.slug}-${Date.now()}-${index}`,
          categoryId: moviesCategory[0].id,
          isBreaking: Math.random() < 0.1,
          isFeatured: Math.random() < 0.15
        }));

        await db.insert(articles).values(newMovieArticles);
        console.log(`Added ${newMovieArticles.length} articles for Movies category`);
      }
    }

    if (lifestyleCategory.length > 0) {
      const existingLifestyleArticles = await db
        .select()
        .from(articles)
        .where(eq(articles.categoryId, lifestyleCategory[0].id));

      const lifestyleNeeded = Math.max(0, 20 - existingLifestyleArticles.length);
      
      if (lifestyleNeeded > 0) {
        const newLifestyleArticles = lifestyleArticles.slice(0, lifestyleNeeded).map((article, index) => ({
          ...article,
          slug: `${article.slug}-${Date.now()}-${index}`,
          categoryId: lifestyleCategory[0].id,
          isBreaking: Math.random() < 0.1,
          isFeatured: Math.random() < 0.15
        }));

        await db.insert(articles).values(newLifestyleArticles);
        console.log(`Added ${newLifestyleArticles.length} articles for Lifestyle category`);
      }
    }

    console.log("Missing category content added successfully!");
  } catch (error) {
    console.error("Error adding missing category content:", error);
    throw error;
  }
}