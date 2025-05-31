import { db } from "./db";
import { categories, articles } from "@shared/schema";
import { eq } from "drizzle-orm";

const articleTemplates = {
  political: [
    { title: "Senate Passes Landmark Legislation", topic: "legislation" },
    { title: "International Trade Agreement Signed", topic: "trade" },
    { title: "Mayor Announces Urban Development Plan", topic: "local" },
    { title: "Election Results Show Surprising Trends", topic: "elections" },
    { title: "Foreign Policy Summit Concludes", topic: "foreign-policy" },
    { title: "Healthcare Reform Bill Advances", topic: "healthcare" },
    { title: "Tax Policy Changes Take Effect", topic: "taxation" },
    { title: "Supreme Court Issues Major Ruling", topic: "judiciary" },
    { title: "Governor Signs Education Reform", topic: "education" },
    { title: "Congressional Hearing on Climate", topic: "environment" },
    { title: "Defense Budget Allocation Debated", topic: "defense" },
    { title: "Immigration Policy Updates", topic: "immigration" },
    { title: "State Legislature Session Opens", topic: "state-politics" },
    { title: "Diplomatic Mission Success", topic: "diplomacy" },
    { title: "Public Safety Initiative Launched", topic: "public-safety" },
    { title: "Economic Stimulus Package Approved", topic: "economics" },
    { title: "Veterans Affairs Reform Proposed", topic: "veterans" },
    { title: "Energy Independence Plan Unveiled", topic: "energy" },
    { title: "Transportation Infrastructure Update", topic: "transportation" },
    { title: "Federal Budget Proposal Released", topic: "budget" }
  ],
  "movie-news": [
    { title: "Blockbuster Sequel Breaks Records", topic: "box-office" },
    { title: "Award Season Predictions Heat Up", topic: "awards" },
    { title: "New Streaming Series Premieres", topic: "streaming" },
    { title: "Director Announces Next Project", topic: "production" },
    { title: "Celebrity Interview Reveals Secrets", topic: "celebrity" },
    { title: "Film Festival Showcases Indie Gems", topic: "festivals" },
    { title: "Behind the Scenes Documentary", topic: "documentary" },
    { title: "Casting News for Major Production", topic: "casting" },
    { title: "Movie Studio Merger Announced", topic: "business" },
    { title: "International Co-Production Deal", topic: "international" },
    { title: "Horror Film Dominates Weekend", topic: "horror" },
    { title: "Romantic Comedy Revival", topic: "romance" },
    { title: "Action Star's Comeback Film", topic: "action" },
    { title: "Animated Feature Wins Hearts", topic: "animation" },
    { title: "Sci-Fi Epic Visual Effects", topic: "sci-fi" },
    { title: "Biographical Drama Earns Praise", topic: "biography" },
    { title: "Comedy Special Breaks Viewership", topic: "comedy" },
    { title: "Thriller Keeps Audiences Guessing", topic: "thriller" },
    { title: "Family Film Holiday Success", topic: "family" },
    { title: "Independent Film Festival Winner", topic: "independent" }
  ],
  facts: [
    { title: "Ocean Depths Hold New Discoveries", topic: "marine-biology" },
    { title: "Space Exploration Reveals Mysteries", topic: "astronomy" },
    { title: "Ancient Civilization Artifacts Found", topic: "archaeology" },
    { title: "Animal Behavior Study Results", topic: "zoology" },
    { title: "Weather Patterns Show Changes", topic: "meteorology" },
    { title: "Human Brain Research Breakthrough", topic: "neuroscience" },
    { title: "Plant Species Adaptation Study", topic: "botany" },
    { title: "Geological Formation Analysis", topic: "geology" },
    { title: "Mathematical Theorem Proven", topic: "mathematics" },
    { title: "Chemical Compound Discovery", topic: "chemistry" },
    { title: "Physics Law Application Found", topic: "physics" },
    { title: "Environmental Impact Assessment", topic: "environment" },
    { title: "Renewable Energy Breakthrough", topic: "energy" },
    { title: "Medical Research Advancement", topic: "medicine" },
    { title: "Technology Innovation Impact", topic: "technology" },
    { title: "Cultural Heritage Preservation", topic: "culture" },
    { title: "Language Evolution Study", topic: "linguistics" },
    { title: "Psychology Research Findings", topic: "psychology" },
    { title: "Social Behavior Analysis", topic: "sociology" },
    { title: "Economic Theory Application", topic: "economics" }
  ],
  "life-style": [
    { title: "Fashion Week Highlights Trends", topic: "fashion" },
    { title: "Home Design Innovation Ideas", topic: "home-design" },
    { title: "Healthy Living Tips for Busy Lives", topic: "health" },
    { title: "Travel Destination Hidden Gems", topic: "travel" },
    { title: "Cooking Techniques Master Class", topic: "cooking" },
    { title: "Fitness Routine for All Ages", topic: "fitness" },
    { title: "Beauty Products Natural Alternatives", topic: "beauty" },
    { title: "Mindfulness Practice Guide", topic: "wellness" },
    { title: "Sustainable Living Choices", topic: "sustainability" },
    { title: "Relationship Advice for Couples", topic: "relationships" },
    { title: "Career Development Strategies", topic: "career" },
    { title: "Financial Planning for Future", topic: "finance" },
    { title: "Parenting Tips for New Parents", topic: "parenting" },
    { title: "Hobby Ideas for Creative Expression", topic: "hobbies" },
    { title: "Technology Life Balance", topic: "digital-wellness" },
    { title: "Art and Culture Appreciation", topic: "culture" },
    { title: "Music Discovery and Appreciation", topic: "music" },
    { title: "Reading Recommendations List", topic: "books" },
    { title: "Pet Care Essential Guide", topic: "pets" },
    { title: "Gardening for Small Spaces", topic: "gardening" }
  ],
  biographies: [
    { title: "Scientist Who Changed Medicine", topic: "science" },
    { title: "Artist's Journey to Recognition", topic: "art" },
    { title: "Entrepreneur's Rise to Success", topic: "business" },
    { title: "Athlete's Olympic Dream Story", topic: "sports" },
    { title: "Musician's Creative Evolution", topic: "music" },
    { title: "Writer's Literary Legacy", topic: "literature" },
    { title: "Leader's Impact on Society", topic: "leadership" },
    { title: "Inventor's Revolutionary Ideas", topic: "innovation" },
    { title: "Teacher's Educational Influence", topic: "education" },
    { title: "Doctor's Medical Breakthrough", topic: "medicine" },
    { title: "Explorer's Adventure Chronicles", topic: "exploration" },
    { title: "Philanthropist's Charitable Work", topic: "charity" },
    { title: "Actor's Career Transformation", topic: "entertainment" },
    { title: "Engineer's Technical Achievements", topic: "engineering" },
    { title: "Chef's Culinary Innovation", topic: "culinary" },
    { title: "Designer's Creative Vision", topic: "design" },
    { title: "Photographer's Artistic Journey", topic: "photography" },
    { title: "Activist's Social Change Mission", topic: "activism" },
    { title: "Pilot's Aviation Adventures", topic: "aviation" },
    { title: "Farmer's Sustainable Agriculture", topic: "agriculture" }
  ],
  "love-stories": [
    { title: "College Sweethearts Reunion", topic: "reunion" },
    { title: "Long Distance Love Success", topic: "long-distance" },
    { title: "Workplace Romance Blossoms", topic: "workplace" },
    { title: "Second Chance at Love", topic: "second-chance" },
    { title: "Arranged Marriage Love Story", topic: "arranged" },
    { title: "Travel Romance Adventure", topic: "travel" },
    { title: "Childhood Friends to Lovers", topic: "friends-to-lovers" },
    { title: "Online Dating Success Story", topic: "online" },
    { title: "Age Gap Love Triumph", topic: "age-gap" },
    { title: "Intercultural Romance Journey", topic: "intercultural" },
    { title: "Military Deployment Love", topic: "military" },
    { title: "Single Parent Finding Love", topic: "single-parent" },
    { title: "Love After Loss Story", topic: "widowed" },
    { title: "High School Sweethearts Update", topic: "high-school" },
    { title: "Blind Date Success Story", topic: "blind-date" },
    { title: "Neighbors Become Soulmates", topic: "neighbors" },
    { title: "Professional Collaboration Romance", topic: "professional" },
    { title: "Shared Interest Bonds Couple", topic: "shared-interests" },
    { title: "Retirement Romance Beginning", topic: "senior" },
    { title: "Overcoming Obstacles Together", topic: "obstacles" }
  ],
  sports: [
    { title: "Championship Victory Celebration", topic: "championships" },
    { title: "Rookie Player Makes Impact", topic: "rookies" },
    { title: "Trade Deal Shakes League", topic: "trades" },
    { title: "Injury Recovery Inspiration", topic: "recovery" },
    { title: "Record Breaking Performance", topic: "records" },
    { title: "Team Strategy Analysis", topic: "strategy" },
    { title: "Draft Predictions and Analysis", topic: "draft" },
    { title: "Coaching Change Impact", topic: "coaching" },
    { title: "Stadium Renovation Update", topic: "facilities" },
    { title: "International Competition Results", topic: "international" },
    { title: "Youth Sports Development", topic: "youth" },
    { title: "Women's Sports Growth", topic: "womens-sports" },
    { title: "Playoff Race Intensifies", topic: "playoffs" },
    { title: "Retirement Announcement", topic: "retirement" },
    { title: "Training Camp Updates", topic: "training" },
    { title: "Equipment Innovation Review", topic: "equipment" },
    { title: "Sports Medicine Advancement", topic: "medicine" },
    { title: "Fan Experience Enhancement", topic: "fans" },
    { title: "Broadcasting Technology Update", topic: "media" },
    { title: "Athlete Community Service", topic: "community" }
  ],
  technology: [
    { title: "Artificial Intelligence Breakthrough", topic: "ai" },
    { title: "Smartphone Innovation Launch", topic: "mobile" },
    { title: "Cloud Computing Advancement", topic: "cloud" },
    { title: "Cybersecurity Threat Analysis", topic: "security" },
    { title: "Electric Vehicle Technology", topic: "automotive" },
    { title: "Quantum Computing Progress", topic: "quantum" },
    { title: "Social Media Platform Update", topic: "social-media" },
    { title: "Gaming Industry Revolution", topic: "gaming" },
    { title: "Blockchain Application Study", topic: "blockchain" },
    { title: "Internet of Things Expansion", topic: "iot" },
    { title: "Virtual Reality Experience", topic: "vr" },
    { title: "Renewable Energy Tech", topic: "green-tech" },
    { title: "Medical Device Innovation", topic: "medtech" },
    { title: "Space Technology Advancement", topic: "space-tech" },
    { title: "Robotics Development Update", topic: "robotics" },
    { title: "Software Development Trends", topic: "software" },
    { title: "Data Analytics Revolution", topic: "analytics" },
    { title: "Digital Payment Innovation", topic: "fintech" },
    { title: "Educational Technology Growth", topic: "edtech" },
    { title: "Smart Home Technology", topic: "smart-home" }
  ]
};

export async function generateMoreArticles() {
  try {
    // Get all categories
    const allCategories = await db.select().from(categories);
    
    for (const category of allCategories) {
      const templates = articleTemplates[category.slug as keyof typeof articleTemplates];
      if (!templates) continue;

      // Check existing articles for this category
      const existingArticles = await db
        .select()
        .from(articles)
        .where(eq(articles.categoryId, category.id));

      const articlesNeeded = Math.max(0, 25 - existingArticles.length);
      
      if (articlesNeeded > 0) {
        const newArticles = templates.slice(0, articlesNeeded).map((template, index) => ({
          title: template.title,
          slug: `${template.topic}-${Date.now()}-${index}`,
          excerpt: `Comprehensive coverage of ${template.topic} with detailed analysis and expert insights.`,
          content: `This article provides in-depth coverage of ${template.topic} in the ${category.name} sector. Our team of expert journalists has compiled comprehensive information to keep you informed about the latest developments.\n\nThe story covers multiple aspects of this important topic, including background information, current developments, and future implications. We've gathered insights from industry experts and stakeholders to provide you with a complete picture.\n\nStay tuned for more updates as this story continues to develop. Our newsroom is committed to bringing you accurate, timely, and relevant information about the topics that matter most to you.`,
          imageUrl: `https://images.unsplash.com/photo-${1500000000 + Math.floor(Math.random() * 100000000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600`,
          categoryId: category.id,
          author: ["Sarah Johnson", "Michael Chen", "Emma Rodriguez", "Alex Turner", "Jessica Martinez", "David Kim", "Lisa Wang", "James Brown", "Maria Garcia", "Robert Lee"][Math.floor(Math.random() * 10)],
          views: Math.floor(Math.random() * 5000) + 100,
          isBreaking: Math.random() < 0.1,
          isFeatured: Math.random() < 0.15
        }));

        await db.insert(articles).values(newArticles);
        console.log(`Added ${newArticles.length} articles for ${category.name}`);
      }
    }
    
    console.log("Article generation completed!");
  } catch (error) {
    console.error("Error generating articles:", error);
    throw error;
  }
}