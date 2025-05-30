import { db } from "./db";
import { categories, articles } from "@shared/schema";

export async function seedDatabase() {
  try {
    // First, check if data already exists
    const existingCategories = await db.select().from(categories);
    if (existingCategories.length > 0) {
      console.log("Database already seeded");
      return;
    }

    console.log("Seeding database...");

    // Insert categories
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

    const insertedCategories = await db.insert(categories).values(categoryData).returning();
    console.log(`Inserted ${insertedCategories.length} categories`);

    // Insert sample articles
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
        isFeatured: true
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
        isFeatured: false
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
        isFeatured: true
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
        isFeatured: true
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
        isFeatured: false
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
        isFeatured: true
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
        isFeatured: false
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
        isFeatured: false
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
        isFeatured: true
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
        isFeatured: true
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
        isFeatured: false
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
        isFeatured: true
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
        isFeatured: false
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
        isFeatured: false
      }
    ];

    const insertedArticles = await db.insert(articles).values(sampleArticles).returning();
    console.log(`Inserted ${insertedArticles.length} articles`);
    
    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}