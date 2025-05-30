import { storage } from "../../../server/storage";

// This function populates the storage with mock data
export async function initializeMockData() {
  const categories = await storage.getCategories();
  
  // Mock articles for each category
  const mockArticles = [
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
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    },
    {
      title: "Presidential Campaign Reaches Final Stage",
      slug: "presidential-campaign-final-stage",
      excerpt: "Candidates make final push in key swing states as polls show tight race.",
      content: "As the presidential campaign enters its final stretch, both major candidates are making intensive efforts to secure votes in crucial swing states. Recent polling data indicates an extremely close race, with margins within the statistical error in several key battleground states. Campaign rallies have drawn record crowds, and both candidates are focusing on their core policy messages while attempting to appeal to undecided voters.",
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
      content: "Congressional sessions have intensified as lawmakers debate the details of a comprehensive infrastructure bill worth over one trillion dollars. The proposed legislation includes funding for roads, bridges, broadband expansion, and clean energy projects. While there is bipartisan support for infrastructure improvements, disagreements persist over funding mechanisms and project priorities.",
      imageUrl: "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      categoryId: 1,
      author: "Emma Rodriguez",
      isBreaking: false,
      isFeatured: true,
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
    },
    {
      title: "New Trade Agreement Signed",
      slug: "new-trade-agreement-signed",
      excerpt: "Historic trade deal promises to boost economic cooperation between nations.",
      content: "A groundbreaking trade agreement has been signed between multiple nations, establishing new frameworks for international commerce and economic cooperation. The deal is expected to reduce tariffs, streamline customs procedures, and promote fair trade practices across participating countries.",
      imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      categoryId: 1,
      author: "David Thompson",
      isBreaking: false,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000)
    },
    {
      title: "Supreme Court Delivers Key Ruling",
      slug: "supreme-court-key-ruling",
      excerpt: "Landmark decision impacts federal regulations and state rights.",
      content: "In a significant legal development, the Supreme Court has issued a landmark ruling that will have far-reaching implications for the balance between federal and state authority. The decision addresses constitutional questions that have been debated for decades.",
      imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      categoryId: 1,
      author: "Lisa Parker",
      isBreaking: false,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000)
    },
    {
      title: "City Council Approves Housing Initiative",
      slug: "city-council-housing-initiative",
      excerpt: "New affordable housing program aims to address growing housing crisis.",
      content: "Local government has approved a comprehensive housing initiative designed to tackle the increasing housing affordability crisis. The program includes subsidies for first-time homebuyers, development of affordable housing units, and rent control measures.",
      imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      categoryId: 1,
      author: "Robert Wilson",
      isBreaking: false,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
    },

    // Movie articles
    {
      title: "Hollywood's Biggest Blockbuster Breaks Records",
      slug: "hollywood-blockbuster-breaks-records",
      excerpt: "The highly anticipated superhero sequel surpasses all opening weekend expectations worldwide.",
      content: "The latest installment in the beloved superhero franchise has shattered box office records, earning over $300 million globally in its opening weekend. The film combines spectacular visual effects with compelling storytelling, delivering an experience that has thrilled audiences worldwide. Industry experts predict it will become one of the highest-grossing films of all time.",
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
      imageUrl: "https://pixabay.com/get/gb6a03e49a8418f5519b8b0e5f299112648389546229146659b06b8eb05ffb7d4e2d0dcb660d497dedc07b8f8b3d56278bbd826af5758c876da10bf8310d33c6d_1280.jpg",
      categoryId: 2,
      author: "Alex Turner",
      isBreaking: false,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
    },
    {
      title: "Indie Film Wins Major Festival Award",
      slug: "indie-film-wins-festival-award",
      excerpt: "Breakthrough independent film captures hearts and critical acclaim.",
      content: "An independent film with a modest budget has taken the film festival circuit by storm, winning multiple awards and receiving universal critical acclaim. The film's unique storytelling approach and outstanding performances have made it a standout success.",
      imageUrl: "https://pixabay.com/get/g194fed3ab13c52dff8f10a0b948e2f12ae9b39c7abe8587d896bd16f96fca22a3735d1f2a6d27af7a2a6701ae2944e756280eff1ffc49ae81c8548fe56355cdf_1280.jpg",
      categoryId: 2,
      author: "Kevin Brown",
      isBreaking: false,
      isFeatured: true,
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
    },
    {
      title: "Behind the Scenes of Epic Sequel",
      slug: "behind-scenes-epic-sequel",
      excerpt: "Exclusive look at the making of the year's most anticipated sequel.",
      content: "Go behind the cameras to discover the incredible effort and creativity that went into producing this year's most talked-about sequel. From innovative special effects to challenging stunt sequences, this production pushed the boundaries of filmmaking.",
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      categoryId: 2,
      author: "Rachel Green",
      isBreaking: false,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000)
    },
    {
      title: "Streaming Giants Battle for Subscribers",
      slug: "streaming-giants-battle-subscribers",
      excerpt: "New original series launches amid fierce competition in streaming market.",
      content: "The streaming wars intensify as major platforms invest billions in original content to attract and retain subscribers. New series and exclusive content deals are reshaping the entertainment landscape.",
      imageUrl: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      categoryId: 2,
      author: "Tom Anderson",
      isBreaking: false,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 9 * 60 * 60 * 1000)
    },
    {
      title: "Exclusive Interview with Rising Star",
      slug: "exclusive-interview-rising-star",
      excerpt: "Young actor discusses breakthrough role and future projects.",
      content: "In an exclusive interview, we sit down with Hollywood's newest sensation to discuss their meteoric rise to fame, upcoming projects, and the challenges of navigating the entertainment industry.",
      imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      categoryId: 2,
      author: "Maria Lopez",
      isBreaking: false,
      isFeatured: false,
      publishedAt: new Date(Date.now() - 11 * 60 * 60 * 1000)
    }

    // Continue with other categories...
  ];

  // Add more articles for remaining categories
  const additionalArticles = [
    // Technology articles
    {
      title: "AI Revolution Transforms Healthcare Industry",
      slug: "ai-revolution-healthcare-industry",
      excerpt: "Revolutionary artificial intelligence applications are improving patient outcomes and medical research.",
      content: "Artificial intelligence is revolutionizing healthcare with applications ranging from diagnostic imaging to drug discovery. Machine learning algorithms are now capable of detecting diseases earlier and more accurately than traditional methods, while AI-powered systems are streamlining hospital operations and improving patient care workflows.",
      imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      categoryId: 8,
      author: "Tech Innovators",
      isBreaking: true,
      isFeatured: true,
      publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
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
    // Lifestyle articles
    {
      title: "Spring Fashion Trends Unveiled",
      slug: "spring-fashion-trends-unveiled",
      excerpt: "Latest runway shows reveal bold colors and sustainable fashion choices.",
      content: "This season's fashion weeks have showcased an exciting array of trends, from vibrant color palettes to innovative sustainable materials. Designers are embracing both bold artistic expression and environmental responsibility, creating collections that are both beautiful and conscious.",
      imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      categoryId: 4,
      author: "Sophie Chen",
      isBreaking: false,
      isFeatured: true,
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    }
  ];

  // Initialize storage with all mock articles
  const allArticles = [...mockArticles, ...additionalArticles];
  
  for (const articleData of allArticles) {
    await storage.createArticle(articleData);
  }
}
