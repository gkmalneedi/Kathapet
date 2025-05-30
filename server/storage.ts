import { categories, articles, type Category, type Article, type InsertCategory, type InsertArticle, type ArticleWithCategory } from "@shared/schema";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Articles
  getArticles(limit?: number, offset?: number, categoryId?: number): Promise<ArticleWithCategory[]>;
  getArticleBySlug(slug: string): Promise<ArticleWithCategory | undefined>;
  getArticlesByCategory(categoryId: number, limit?: number, offset?: number): Promise<ArticleWithCategory[]>;
  getFeaturedArticles(limit?: number): Promise<ArticleWithCategory[]>;
  getBreakingNews(limit?: number): Promise<ArticleWithCategory[]>;
  createArticle(article: InsertArticle): Promise<Article>;
  getTotalArticlesCount(categoryId?: number): Promise<number>;
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
      const category: Category = { ...cat, id: this.currentCategoryId++ };
      this.categories.set(category.id, category);
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
      ...insertArticle, 
      id,
      createdAt: now,
      publishedAt: insertArticle.publishedAt || now
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

export const storage = new MemStorage();
