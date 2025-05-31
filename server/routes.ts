import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { adminStorage } from "./admin-storage";
import { insertArticleSchema, insertCategorySchema, insertPageSchema, insertSocialSettingSchema, insertSiteSettingSchema } from "@shared/schema";

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

  // Create new article
  app.post("/api/articles", async (req, res) => {
    try {
      const validatedData = insertArticleSchema.parse(req.body);
      const article = await storage.createArticle(validatedData);
      res.status(201).json(article);
    } catch (error) {
      res.status(400).json({ message: "Invalid article data" });
    }
  });

  // Update article
  app.put("/api/articles/:id", async (req, res) => {
    try {
      const validatedData = insertArticleSchema.parse(req.body);
      const article = await storage.updateArticle(parseInt(req.params.id), validatedData);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(400).json({ message: "Invalid article data" });
    }
  });

  // Delete article
  app.delete("/api/articles/:id", async (req, res) => {
    try {
      const success = await storage.deleteArticle(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete article" });
    }
  });

  // Create new category
  app.post("/api/categories", async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: "Invalid category data" });
    }
  });

  // Update category
  app.put("/api/categories/:id", async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.updateCategory(parseInt(req.params.id), validatedData);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(400).json({ message: "Invalid category data" });
    }
  });

  // Delete category
  app.delete("/api/categories/:id", async (req, res) => {
    try {
      const success = await storage.deleteCategory(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // ADMIN ROUTES - CMS Management Panel
  
  // Admin Categories Management
  app.get("/api/admin/categories", async (req, res) => {
    try {
      const categories = await adminStorage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post("/api/admin/categories", async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await adminStorage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: "Invalid category data" });
    }
  });

  app.put("/api/admin/categories/:id", async (req, res) => {
    try {
      const validatedData = insertCategorySchema.partial().parse(req.body);
      const category = await adminStorage.updateCategory(parseInt(req.params.id), validatedData);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(400).json({ message: "Invalid category data" });
    }
  });

  app.delete("/api/admin/categories/:id", async (req, res) => {
    try {
      const success = await adminStorage.deleteCategory(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Admin Articles Management
  app.get("/api/admin/articles", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const articles = await adminStorage.getArticles(limit, offset);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.get("/api/admin/articles/:id", async (req, res) => {
    try {
      const article = await adminStorage.getArticleById(parseInt(req.params.id));
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  app.post("/api/admin/articles", async (req, res) => {
    try {
      const validatedData = insertArticleSchema.parse(req.body);
      const article = await adminStorage.createArticle(validatedData);
      res.status(201).json(article);
    } catch (error) {
      res.status(400).json({ message: "Invalid article data" });
    }
  });

  app.put("/api/admin/articles/:id", async (req, res) => {
    try {
      const validatedData = insertArticleSchema.partial().parse(req.body);
      const article = await adminStorage.updateArticle(parseInt(req.params.id), validatedData);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(400).json({ message: "Invalid article data" });
    }
  });

  app.delete("/api/admin/articles/:id", async (req, res) => {
    try {
      const success = await adminStorage.deleteArticle(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete article" });
    }
  });

  // Admin Pages Management (About Us, Privacy Policy, etc.)
  app.get("/api/admin/pages", async (req, res) => {
    try {
      const pages = await adminStorage.getPages();
      res.json(pages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pages" });
    }
  });

  app.get("/api/admin/pages/:id", async (req, res) => {
    try {
      const page = await adminStorage.getPageById(parseInt(req.params.id));
      if (!page) {
        return res.status(404).json({ message: "Page not found" });
      }
      res.json(page);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch page" });
    }
  });

  app.post("/api/admin/pages", async (req, res) => {
    try {
      const validatedData = insertPageSchema.parse(req.body);
      const page = await adminStorage.createPage(validatedData);
      res.status(201).json(page);
    } catch (error) {
      res.status(400).json({ message: "Invalid page data" });
    }
  });

  app.put("/api/admin/pages/:id", async (req, res) => {
    try {
      const validatedData = insertPageSchema.partial().parse(req.body);
      const page = await adminStorage.updatePage(parseInt(req.params.id), validatedData);
      if (!page) {
        return res.status(404).json({ message: "Page not found" });
      }
      res.json(page);
    } catch (error) {
      res.status(400).json({ message: "Invalid page data" });
    }
  });

  app.delete("/api/admin/pages/:id", async (req, res) => {
    try {
      const success = await adminStorage.deletePage(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Page not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete page" });
    }
  });

  // Admin Social Settings Management
  app.get("/api/admin/social-settings", async (req, res) => {
    try {
      const settings = await adminStorage.getSocialSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch social settings" });
    }
  });

  app.post("/api/admin/social-settings", async (req, res) => {
    try {
      const validatedData = insertSocialSettingSchema.parse(req.body);
      const setting = await adminStorage.createSocialSetting(validatedData);
      res.status(201).json(setting);
    } catch (error) {
      res.status(400).json({ message: "Invalid social setting data" });
    }
  });

  app.put("/api/admin/social-settings/:id", async (req, res) => {
    try {
      const validatedData = insertSocialSettingSchema.partial().parse(req.body);
      const setting = await adminStorage.updateSocialSetting(parseInt(req.params.id), validatedData);
      if (!setting) {
        return res.status(404).json({ message: "Social setting not found" });
      }
      res.json(setting);
    } catch (error) {
      res.status(400).json({ message: "Invalid social setting data" });
    }
  });

  app.delete("/api/admin/social-settings/:id", async (req, res) => {
    try {
      const success = await adminStorage.deleteSocialSetting(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Social setting not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete social setting" });
    }
  });

  // Admin Site Settings Management
  app.get("/api/admin/site-settings", async (req, res) => {
    try {
      const settings = await adminStorage.getSiteSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch site settings" });
    }
  });

  app.post("/api/admin/site-settings", async (req, res) => {
    try {
      const validatedData = insertSiteSettingSchema.parse(req.body);
      const setting = await adminStorage.createOrUpdateSiteSetting(validatedData);
      res.json(setting);
    } catch (error) {
      res.status(400).json({ message: "Invalid site setting data" });
    }
  });

  // Public route for menu categories
  app.get("/api/menu-categories", async (req, res) => {
    try {
      const categories = await adminStorage.getMenuCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu categories" });
    }
  });

  // Public route for static pages
  app.get("/api/pages/:slug", async (req, res) => {
    try {
      const page = await adminStorage.getPageBySlug(req.params.slug);
      if (!page || !page.isPublished) {
        return res.status(404).json({ message: "Page not found" });
      }
      res.json(page);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch page" });
    }
  });

  // Public route for social settings
  app.get("/api/social-settings", async (req, res) => {
    try {
      const settings = await adminStorage.getSocialSettings();
      const enabledSettings = settings.filter(setting => setting.isEnabled);
      res.json(enabledSettings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch social settings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
