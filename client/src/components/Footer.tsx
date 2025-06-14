
import { Link } from "wouter";
import { Facebook, Twitter, Instagram } from "lucide-react";

export function Footer() {
  const categories = [
    { name: "Political", slug: "political" },
    { name: "Movies", slug: "movies" },
    { name: "Lifestyle", slug: "lifestyle" },
    { name: "Sports", slug: "sports" },
    { name: "Technology", slug: "technology" },
    { name: "Facts", slug: "facts" },
    { name: "Biographies", slug: "biographies" },
    { name: "Love Stories", slug: "love-stories" },
  ];

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/attached_assets/Kathapet v2 copy.png" 
                alt="KathaPet Logo" 
                className="h-8 w-auto filter brightness-0 invert"
              />
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted source for breaking news, analysis, and stories that matter.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#efbf04] transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#efbf04] transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#efbf04] transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#efbf04]">Main Categories</h4>
            <ul className="space-y-2">
              {categories.slice(0, 4).map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-gray-400 hover:text-[#efbf04] transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#efbf04]">More Categories</h4>
            <ul className="space-y-2">
              {categories.slice(4).map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-gray-400 hover:text-[#efbf04] transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#efbf04]">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-[#efbf04] transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#efbf04] transition-colors">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#efbf04] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#efbf04] transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">&copy; 2024 KathaPet. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
