import { 
  categories, articles, pages, socialSettings, siteSettings, media,
  type Category, type Article, type Page, type SocialSetting, type SiteSetting, type Media,
  type InsertCategory, type InsertArticle, type InsertPage, type InsertSocialSetting, 
  type InsertSiteSetting, type InsertMedia, type ArticleWithCategory 
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, asc } from "drizzle-orm";

export class AdminStorage {
  // Categories
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(asc(categories.sortOrder));
  }

  async getMenuCategories(): Promise<Category[]> {
    return await db.select().from(categories)
      .where(eq(categories.showInMenu, true))
      .orderBy(asc(categories.sortOrder));
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db
      .insert(categories)
      .values(insertCategory)
      .returning();
    return category;
  }

  async updateCategory(id: number, insertCategory: Partial<InsertCategory>): Promise<Category | undefined> {
    const [category] = await db
      .update(categories)
      .set({ ...insertCategory, updatedAt: new Date() } as any)
      .where(eq(categories.id, id))
      .returning();
    return category || undefined;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Articles
  async getArticles(limit = 50, offset = 0): Promise<ArticleWithCategory[]> {
    const result = await db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        excerpt: articles.excerpt,
        content: articles.content,
        imageUrl: articles.imageUrl,
        categoryId: articles.categoryId,
        author: articles.author,
        views: articles.views,
        isBreaking: articles.isBreaking,
        isFeatured: articles.isFeatured,
        language: articles.language,
        seoTitle: articles.seoTitle,
        seoDescription: articles.seoDescription,
        publishedAt: articles.publishedAt,
        createdAt: articles.createdAt,
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          color: categories.color,
          description: categories.description,
          showInMenu: categories.showInMenu,
          sortOrder: categories.sortOrder,
        },
      })
      .from(articles)
      .innerJoin(categories, eq(articles.categoryId, categories.id))
      .orderBy(desc(articles.createdAt))
      .limit(limit)
      .offset(offset);

    return result as ArticleWithCategory[];
  }

  async getArticleById(id: number): Promise<ArticleWithCategory | undefined> {
    const result = await db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        excerpt: articles.excerpt,
        content: articles.content,
        imageUrl: articles.imageUrl,
        categoryId: articles.categoryId,
        author: articles.author,
        views: articles.views,
        isBreaking: articles.isBreaking,
        isFeatured: articles.isFeatured,
        language: articles.language,
        seoTitle: articles.seoTitle,
        seoDescription: articles.seoDescription,
        publishedAt: articles.publishedAt,
        createdAt: articles.createdAt,
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          color: categories.color,
          description: categories.description,
          showInMenu: categories.showInMenu,
          sortOrder: categories.sortOrder,
        },
      })
      .from(articles)
      .innerJoin(categories, eq(articles.categoryId, categories.id))
      .where(eq(articles.id, id));

    return result[0] as ArticleWithCategory || undefined;
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const [article] = await db
      .insert(articles)
      .values(insertArticle)
      .returning();
    return article;
  }

  async updateArticle(id: number, insertArticle: Partial<InsertArticle>): Promise<Article | undefined> {
    const [article] = await db
      .update(articles)
      .set(insertArticle)
      .where(eq(articles.id, id))
      .returning();
    return article || undefined;
  }

  async deleteArticle(id: number): Promise<boolean> {
    const result = await db.delete(articles).where(eq(articles.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Pages
  async getPages(): Promise<Page[]> {
    return await db.select().from(pages).orderBy(desc(pages.createdAt));
  }

  async getPageById(id: number): Promise<Page | undefined> {
    const [page] = await db.select().from(pages).where(eq(pages.id, id));
    return page || undefined;
  }

  async getPageBySlug(slug: string): Promise<Page | undefined> {
    const [page] = await db.select().from(pages).where(eq(pages.slug, slug));
    return page || undefined;
  }

  async createPage(insertPage: InsertPage): Promise<Page> {
    const [page] = await db
      .insert(pages)
      .values(insertPage)
      .returning();
    return page;
  }

  async updatePage(id: number, insertPage: Partial<InsertPage>): Promise<Page | undefined> {
    const [page] = await db
      .update(pages)
      .set({ ...insertPage, updatedAt: new Date() })
      .where(eq(pages.id, id))
      .returning();
    return page || undefined;
  }

  async deletePage(id: number): Promise<boolean> {
    const result = await db.delete(pages).where(eq(pages.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Social Settings
  async getSocialSettings(): Promise<SocialSetting[]> {
    return await db.select().from(socialSettings).orderBy(asc(socialSettings.sortOrder));
  }

  async createSocialSetting(setting: InsertSocialSetting): Promise<SocialSetting> {
    const [socialSetting] = await db
      .insert(socialSettings)
      .values(setting)
      .returning();
    return socialSetting;
  }

  async updateSocialSetting(id: number, setting: Partial<InsertSocialSetting>): Promise<SocialSetting | undefined> {
    const [socialSetting] = await db
      .update(socialSettings)
      .set(setting)
      .where(eq(socialSettings.id, id))
      .returning();
    return socialSetting || undefined;
  }

  async deleteSocialSetting(id: number): Promise<boolean> {
    const result = await db.delete(socialSettings).where(eq(socialSettings.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Site Settings
  async getSiteSettings(): Promise<SiteSetting[]> {
    return await db.select().from(siteSettings);
  }

  async getSiteSetting(key: string): Promise<SiteSetting | undefined> {
    const [setting] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
    return setting || undefined;
  }

  async createOrUpdateSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting> {
    const existing = await this.getSiteSetting(setting.key);
    
    if (existing) {
      const [updated] = await db
        .update(siteSettings)
        .set({ value: setting.value, type: setting.type, description: setting.description })
        .where(eq(siteSettings.key, setting.key))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(siteSettings)
        .values(setting)
        .returning();
      return created;
    }
  }

  // Media
  async getMedia(): Promise<Media[]> {
    return await db.select().from(media).orderBy(desc(media.uploadedAt));
  }

  async getMediaById(id: number): Promise<Media | undefined> {
    const [mediaItem] = await db.select().from(media).where(eq(media.id, id));
    return mediaItem || undefined;
  }

  async createMedia(mediaData: InsertMedia): Promise<Media> {
    const [mediaItem] = await db
      .insert(media)
      .values(mediaData)
      .returning();
    return mediaItem;
  }

  async deleteMedia(id: number): Promise<boolean> {
    const result = await db.delete(media).where(eq(media.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}

export const adminStorage = new AdminStorage();
