import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Articles
  app.get("/api/articles", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      
      const articles = await storage.getArticles(limit, offset, categoryId);
      const totalCount = await storage.getTotalArticlesCount(categoryId);
      
      res.json({
        articles,
        totalCount,
        hasMore: offset + limit < totalCount
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.get("/api/articles/:slug", async (req, res) => {
    try {
      const article = await storage.getArticleBySlug(req.params.slug);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  app.get("/api/categories/:categoryId/articles", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const articles = await storage.getArticlesByCategory(categoryId, limit, offset);
      const totalCount = await storage.getTotalArticlesCount(categoryId);
      
      res.json({
        articles,
        totalCount,
        hasMore: offset + limit < totalCount
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category articles" });
    }
  });

  app.get("/api/featured", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 6;
      const articles = await storage.getFeaturedArticles(limit);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured articles" });
    }
  });

  app.get("/api/breaking", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 3;
      const articles = await storage.getBreakingNews(limit);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch breaking news" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
