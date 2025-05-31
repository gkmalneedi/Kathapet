import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Settings, FileText, Menu, Share2, Image } from "lucide-react";

// Admin Components
import { ArticleManagement } from "@/components/admin/ArticleManagement";
import { CategoryManagement } from "@/components/admin/CategoryManagement";
import { PageManagement } from "@/components/admin/PageManagement";
import { SocialManagement } from "@/components/admin/SocialManagement";
import { MediaManagement } from "@/components/admin/MediaManagement";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("articles");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">CMS Admin Panel</h1>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="articles" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Articles
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Menu className="h-4 w-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="pages" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Pages
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Social
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Media
            </TabsTrigger>
          </TabsList>

          <TabsContent value="articles">
            <Card>
              <CardHeader>
                <CardTitle>Article Management</CardTitle>
                <CardDescription>
                  Create, edit, and manage news articles with rich content editing capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ArticleManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Category Management</CardTitle>
                <CardDescription>
                  Manage news categories and control which categories appear in the main navigation menu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CategoryManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pages">
            <Card>
              <CardHeader>
                <CardTitle>Page Management</CardTitle>
                <CardDescription>
                  Create and manage static pages like About Us, Privacy Policy, Terms & Conditions, and Contact Us
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PageManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Settings</CardTitle>
                <CardDescription>
                  Configure social media icons and links that appear on your website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SocialManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media">
            <Card>
              <CardHeader>
                <CardTitle>Media Library</CardTitle>
                <CardDescription>
                  Upload and manage images, videos, and other media files for your articles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MediaManagement />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}