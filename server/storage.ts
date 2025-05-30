import { categories, articles, type Category, type Article, type InsertCategory, type InsertArticle, type ArticleWithCategory } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: InsertCategory): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;

  // Articles
  getArticles(limit?: number, offset?: number, categoryId?: number): Promise<ArticleWithCategory[]>;
  getArticleBySlug(slug: string): Promise<ArticleWithCategory | undefined>;
  getArticlesByCategory(categoryId: number, limit?: number, offset?: number): Promise<ArticleWithCategory[]>;
  getFeaturedArticles(limit?: number): Promise<ArticleWithCategory[]>;
  getBreakingNews(limit?: number): Promise<ArticleWithCategory[]>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, article: InsertArticle): Promise<Article | undefined>;
  deleteArticle(id: number): Promise<boolean>;
  getTotalArticlesCount(categoryId?: number): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category || undefined;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db
      .insert(categories)
      .values(insertCategory)
      .returning();
    return category;
  }

  async getArticles(limit = 50, offset = 0, categoryId?: number): Promise<ArticleWithCategory[]> {
    let query = db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        excerpt: articles.excerpt,
        content: articles.content,
        imageUrl: articles.imageUrl,
        categoryId: articles.categoryId,
        author: articles.author,
        isBreaking: articles.isBreaking,
        isFeatured: articles.isFeatured,
        publishedAt: articles.publishedAt,
        createdAt: articles.createdAt,
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          color: categories.color,
          description: categories.description,
        },
      })
      .from(articles)
      .innerJoin(categories, eq(articles.categoryId, categories.id))
      .orderBy(desc(articles.publishedAt))
      .limit(limit)
      .offset(offset);

    if (categoryId) {
      query = query.where(eq(articles.categoryId, categoryId));
    }

    return await query;
  }

  async getArticleBySlug(slug: string): Promise<ArticleWithCategory | undefined> {
    const [result] = await db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        excerpt: articles.excerpt,
        content: articles.content,
        imageUrl: articles.imageUrl,
        categoryId: articles.categoryId,
        author: articles.author,
        isBreaking: articles.isBreaking,
        isFeatured: articles.isFeatured,
        publishedAt: articles.publishedAt,
        createdAt: articles.createdAt,
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          color: categories.color,
          description: categories.description,
        },
      })
      .from(articles)
      .innerJoin(categories, eq(articles.categoryId, categories.id))
      .where(eq(articles.slug, slug));

    return result || undefined;
  }

  async getArticlesByCategory(categoryId: number, limit = 50, offset = 0): Promise<ArticleWithCategory[]> {
    return this.getArticles(limit, offset, categoryId);
  }

  async getFeaturedArticles(limit = 6): Promise<ArticleWithCategory[]> {
    return await db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        excerpt: articles.excerpt,
        content: articles.content,
        imageUrl: articles.imageUrl,
        categoryId: articles.categoryId,
        author: articles.author,
        isBreaking: articles.isBreaking,
        isFeatured: articles.isFeatured,
        publishedAt: articles.publishedAt,
        createdAt: articles.createdAt,
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          color: categories.color,
          description: categories.description,
        },
      })
      .from(articles)
      .innerJoin(categories, eq(articles.categoryId, categories.id))
      .where(eq(articles.isFeatured, true))
      .orderBy(desc(articles.publishedAt))
      .limit(limit);
  }

  async getBreakingNews(limit = 3): Promise<ArticleWithCategory[]> {
    return await db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        excerpt: articles.excerpt,
        content: articles.content,
        imageUrl: articles.imageUrl,
        categoryId: articles.categoryId,
        author: articles.author,
        isBreaking: articles.isBreaking,
        isFeatured: articles.isFeatured,
        publishedAt: articles.publishedAt,
        createdAt: articles.createdAt,
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          color: categories.color,
          description: categories.description,
        },
      })
      .from(articles)
      .innerJoin(categories, eq(articles.categoryId, categories.id))
      .where(eq(articles.isBreaking, true))
      .orderBy(desc(articles.publishedAt))
      .limit(limit);
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const [article] = await db
      .insert(articles)
      .values(insertArticle)
      .returning();
    return article;
  }

  async getTotalArticlesCount(categoryId?: number): Promise<number> {
    let query = db.select().from(articles);
    
    if (categoryId) {
      query = query.where(eq(articles.categoryId, categoryId));
    }
    
    const result = await query;
    return result.length;
  }

  async updateCategory(id: number, insertCategory: InsertCategory): Promise<Category | undefined> {
    const [category] = await db
      .update(categories)
      .set(insertCategory)
      .where(eq(categories.id, id))
      .returning();
    return category || undefined;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async updateArticle(id: number, insertArticle: InsertArticle): Promise<Article | undefined> {
    const [article] = await db
      .update(articles)
      .set(insertArticle)
      .where(eq(articles.id, id))
      .returning();
    return article || undefined;
  }

  async deleteArticle(id: number): Promise<boolean> {
    const result = await db.delete(articles).where(eq(articles.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
}

export class MemStorage implements IStorage {
  private categories: Map<number, Category>;
  private articles: Map<number, Article>;
  private currentCategoryId: number;
  private currentArticleId: number;

  constructor() {
    this.categories = new Map();
    this.articles = new Map();
    this.currentCategoryId = 1;
    this.currentArticleId = 1;
    this.initializeData();
  }

  private initializeData() {
    // Initialize categories
    const categoryData = [
      { name: "Political", slug: "political", color: "#DC2626", description: "Latest political news and analysis" },
      { name: "Movies", slug: "movies", color: "#7C3AED", description: "Entertainment and movie industry news" },
      { name: "Facts", slug: "facts", color: "#059669", description: "Interesting facts and knowledge" },
      { name: "Lifestyle", slug: "lifestyle", color: "#EC4899", description: "Lifestyle and fashion trends" },
      { name: "Biographies", slug: "biographies", color: "#F59E0B", description: "Life stories of remarkable people" },
      { name: "Love Stories", slug: "love-stories", color: "#EF4444", description: "Heartwarming love and relationship stories" },
      { name: "Sports", slug: "sports", color: "#3B82F6", description: "Sports news and updates" },
      { name: "Technology", slug: "technology", color: "#10B981", description: "Latest tech news and innovations" }
    ];

    categoryData.forEach(cat => {
      const category: Category = { 
        id: this.currentCategoryId++,
        name: cat.name,
        slug: cat.slug,
        color: cat.color,
        description: cat.description
      };
      this.categories.set(category.id, category);
    });

    // Initialize sample articles
    this.initializeSampleArticles();
  }

  private initializeSampleArticles() {
    const sampleArticles = [
      // Political articles
      {
        title: "Global Summit Addresses Climate Change Policies",
        slug: "global-summit-climate-change-policies",
        excerpt: "World leaders gather to discuss comprehensive climate action plans and international cooperation strategies.",
        content: "In a landmark gathering, world leaders from over 100 countries convened to address the pressing issue of climate change. The summit focused on developing comprehensive policies that would ensure sustainable development while maintaining economic growth. Key discussions revolved around carbon emission targets, renewable energy investments, and international cooperation frameworks. The conference highlighted the urgent need for immediate action and long-term planning to combat the effects of global warming.",
        imageUrl: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        categoryId: 1,
        author: "Sarah Johnson",
        isBreaking: true,
        isFeatured: true,
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        title: "Presidential Campaign Reaches Final Stage",
        slug: "presidential-campaign-final-stage",
        excerpt: "Candidates make final push in key swing states as polls show tight race.",
        content: "As the presidential campaign enters its final stretch, both major candidates are making intensive efforts to secure votes in crucial swing states. Recent polling data indicates an extremely close race, with margins within the statistical error in several key battleground states.",
        imageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        categoryId: 1,
        author: "Michael Chen",
        isBreaking: true,
        isFeatured: false,
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },
      {
        title: "Congress Debates Infrastructure Bill",
        slug: "congress-debates-infrastructure-bill",
        excerpt: "Heated discussions continue over the trillion-dollar infrastructure package.",
        content: "Congressional sessions have intensified as lawmakers debate the details of a comprehensive infrastructure bill worth over one trillion dollars. The proposed legislation includes funding for roads, bridges, broadband expansion, and clean energy projects.",
        imageUrl: "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        categoryId: 1,
        author: "Emma Rodriguez",
        isBreaking: false,
        isFeatured: true,
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
      },

      // Movie articles
      {
        title: "Hollywood's Biggest Blockbuster Breaks Records",
        slug: "hollywood-blockbuster-breaks-records",
        excerpt: "The highly anticipated superhero sequel surpasses all opening weekend expectations worldwide.",
        content: "The latest installment in the beloved superhero franchise has shattered box office records, earning over $300 million globally in its opening weekend. The film combines spectacular visual effects with compelling storytelling, delivering an experience that has thrilled audiences worldwide.",
        imageUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        categoryId: 2,
        author: "Jessica Martinez",
        isBreaking: true,
        isFeatured: true,
        publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
      },
      {
        title: "Star-Studded Premiere Dazzles Hollywood",
        slug: "star-studded-premiere-hollywood",
        excerpt: "A-list celebrities gather for the highly anticipated blockbuster premiere.",
        content: "The red carpet was ablaze with glamour as Hollywood's biggest stars gathered for the premiere of this year's most anticipated film. The event showcased stunning fashion, memorable moments, and exclusive interviews with the cast and crew.",
        imageUrl: "https://images.unsplash.com/photo-1489599162748-e075e8d3b7a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        categoryId: 2,
        author: "Alex Turner",
        isBreaking: false,
        isFeatured: false,
        publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
      },

      // Technology articles
      {
        title: "AI Revolution Transforms Healthcare Industry",
        slug: "ai-revolution-healthcare-industry",
        excerpt: "Revolutionary artificial intelligence applications are improving patient outcomes and medical research.",
        content: "Artificial intelligence is revolutionizing healthcare with applications ranging from diagnostic imaging to drug discovery. Machine learning algorithms are now capable of detecting diseases earlier and more accurately than traditional methods.",
        imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        categoryId: 8,
        author: "Tech Innovators",
        isBreaking: true,
        isFeatured: true,
        publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
      },
      {
        title: "New Smartphone Features Unveiled",
        slug: "new-smartphone-features-unveiled",
        excerpt: "Latest flagship device introduces groundbreaking camera technology and battery life.",
        content: "The tech giant has unveiled its latest flagship smartphone, featuring revolutionary camera technology that can capture professional-quality photos in any lighting condition. The device also boasts extended battery life and enhanced security features.",
        imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        categoryId: 8,
        author: "David Tech",
        isBreaking: false,
        isFeatured: false,
        publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
      },

      // Sports articles
      {
        title: "Championship Finals Reach Overtime",
        slug: "championship-finals-overtime",
        excerpt: "Thrilling match goes into extra time as both teams fight for victory.",
        content: "In an electrifying championship final, both teams displayed exceptional skill and determination, leading to an overtime period that had fans on the edge of their seats. The match showcased the highest level of athletic performance and sportsmanship.",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        categoryId: 7,
        author: "Sports Desk",
        isBreaking: true,
        isFeatured: false,
        publishedAt: new Date(Date.now() - 30 * 60 * 1000)
      },
      {
        title: "Olympic Preparations Underway",
        slug: "olympic-preparations-underway",
        excerpt: "Athletes from around the world prepare for the upcoming Olympic Games.",
        content: "With just months to go before the Olympic Games, athletes are making final preparations and training adjustments. The anticipation builds as competitors fine-tune their skills and strategies for what promises to be an unforgettable sporting event.",
        imageUrl: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        categoryId: 7,
        author: "Olympic Reporter",
        isBreaking: false,
        isFeatured: true,
        publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000)
      },

      // Lifestyle articles
      {
        title: "Spring Fashion Trends Unveiled",
        slug: "spring-fashion-trends-unveiled",
        excerpt: "Latest runway shows reveal bold colors and sustainable fashion choices.",
        content: "This season's fashion weeks have showcased an exciting array of trends, from vibrant color palettes to innovative sustainable materials. Designers are embracing both bold artistic expression and environmental responsibility.",
        imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        categoryId: 4,
        author: "Sophie Chen",
        isBreaking: false,
        isFeatured: true,
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        title: "Wellness Trends for the New Year",
        slug: "wellness-trends-new-year",
        excerpt: "Health experts share insights on the most effective wellness practices.",
        content: "As we embrace a new year, health and wellness experts are highlighting the most effective practices for maintaining physical and mental well-being. From mindfulness meditation to innovative fitness routines, these trends focus on holistic health approaches.",
        imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        categoryId: 4,
        author: "Wellness Expert",
        isBreaking: false,
        isFeatured: false,
        publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000)
      },

      // Facts articles
      {
        title: "Amazing Ocean Discoveries Revealed",
        slug: "amazing-ocean-discoveries-revealed",
        excerpt: "Scientists uncover fascinating new species in the deepest parts of our oceans.",
        content: "Marine biologists have made remarkable discoveries in the ocean's deepest trenches, finding new species that challenge our understanding of life in extreme conditions. These findings provide valuable insights into evolution and adaptation.",
        imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        categoryId: 3,
        author: "Science Team",
        isBreaking: false,
        isFeatured: true,
        publishedAt: new Date(Date.now() - 9 * 60 * 60 * 1000)
      },

      // Biographies articles
      {
        title: "The Inspiring Journey of a Tech Pioneer",
        slug: "inspiring-journey-tech-pioneer",
        excerpt: "From humble beginnings to revolutionary innovations that changed the world.",
        content: "This remarkable individual overcame significant challenges to become one of the most influential figures in technology. Their story demonstrates the power of perseverance, creativity, and the pursuit of knowledge.",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        categoryId: 5,
        author: "Biography Writer",
        isBreaking: false,
        isFeatured: false,
        publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000)
      },

      // Love Stories articles
      {
        title: "A Love Story That Crossed Continents",
        slug: "love-story-crossed-continents",
        excerpt: "How two people found each other across thousands of miles and different cultures.",
        content: "In a world connected by technology but divided by distance, this couple's love story proves that true connection knows no boundaries. Their journey from online friendship to lasting love inspires hope in the power of human connection.",
        imageUrl: "https://images.unsplash.com/photo-1518621012460-5a9d32f6a53c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        categoryId: 6,
        author: "Romance Writer",
        isBreaking: false,
        isFeatured: false,
        publishedAt: new Date(Date.now() - 11 * 60 * 60 * 1000)
      }
    ];

    // Add all sample articles to storage
    sampleArticles.forEach(articleData => {
      const id = this.currentArticleId++;
      const now = new Date();
      const article: Article = {
        id,
        title: articleData.title,
        slug: articleData.slug,
        excerpt: articleData.excerpt,
        content: articleData.content,
        imageUrl: articleData.imageUrl,
        categoryId: articleData.categoryId,
        author: articleData.author,
        isBreaking: articleData.isBreaking || false,
        isFeatured: articleData.isFeatured || false,
        publishedAt: articleData.publishedAt,
        createdAt: now
      };
      this.articles.set(id, article);
    });
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(cat => cat.slug === slug);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  async getArticles(limit = 50, offset = 0, categoryId?: number): Promise<ArticleWithCategory[]> {
    let articleList = Array.from(this.articles.values());
    
    if (categoryId) {
      articleList = articleList.filter(article => article.categoryId === categoryId);
    }
    
    articleList.sort((a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime());
    
    const paginatedArticles = articleList.slice(offset, offset + limit);
    
    return paginatedArticles.map(article => ({
      ...article,
      category: this.categories.get(article.categoryId)!
    }));
  }

  async getArticleBySlug(slug: string): Promise<ArticleWithCategory | undefined> {
    const article = Array.from(this.articles.values()).find(a => a.slug === slug);
    if (!article) return undefined;
    
    return {
      ...article,
      category: this.categories.get(article.categoryId)!
    };
  }

  async getArticlesByCategory(categoryId: number, limit = 50, offset = 0): Promise<ArticleWithCategory[]> {
    return this.getArticles(limit, offset, categoryId);
  }

  async getFeaturedArticles(limit = 6): Promise<ArticleWithCategory[]> {
    const featuredArticles = Array.from(this.articles.values())
      .filter(article => article.isFeatured)
      .sort((a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime())
      .slice(0, limit);
    
    return featuredArticles.map(article => ({
      ...article,
      category: this.categories.get(article.categoryId)!
    }));
  }

  async getBreakingNews(limit = 3): Promise<ArticleWithCategory[]> {
    const breakingArticles = Array.from(this.articles.values())
      .filter(article => article.isBreaking)
      .sort((a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime())
      .slice(0, limit);
    
    return breakingArticles.map(article => ({
      ...article,
      category: this.categories.get(article.categoryId)!
    }));
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = this.currentArticleId++;
    const now = new Date();
    const article: Article = { 
      id,
      title: insertArticle.title,
      slug: insertArticle.slug,
      excerpt: insertArticle.excerpt,
      content: insertArticle.content,
      imageUrl: insertArticle.imageUrl,
      categoryId: insertArticle.categoryId,
      author: insertArticle.author,
      isBreaking: insertArticle.isBreaking || false,
      isFeatured: insertArticle.isFeatured || false,
      publishedAt: now,
      createdAt: now
    };
    this.articles.set(id, article);
    return article;
  }

  async getTotalArticlesCount(categoryId?: number): Promise<number> {
    if (categoryId) {
      return Array.from(this.articles.values()).filter(article => article.categoryId === categoryId).length;
    }
    return this.articles.size;
  }
}

export const storage = new DatabaseStorage();
