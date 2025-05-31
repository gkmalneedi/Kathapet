import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, FileText, Eye, EyeOff } from "lucide-react";
import { RichTextEditor } from "./RichTextEditor";
import { apiRequest } from "@/lib/queryClient";
import type { Page, InsertPage } from "@shared/schema";

interface PageFormData {
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  seoTitle: string;
  seoDescription: string;
}

export function PageManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [formData, setFormData] = useState<PageFormData>({
    title: "",
    slug: "",
    content: "",
    isPublished: true,
    seoTitle: "",
    seoDescription: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pages = [], isLoading } = useQuery<Page[]>({
    queryKey: ["/api/admin/pages"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertPage) => {
      return await apiRequest("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pages"] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "Success", description: "Page created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create page", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertPage> }) => {
      return await apiRequest(`/api/admin/pages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pages"] });
      setIsDialogOpen(false);
      setEditingPage(null);
      resetForm();
      toast({ title: "Success", description: "Page updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update page", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/admin/pages/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pages"] });
      toast({ title: "Success", description: "Page deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete page", variant: "destructive" });
    }
  });

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      content: "",
      isPublished: true,
      seoTitle: "",
      seoDescription: ""
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPage) {
      updateMutation.mutate({ id: editingPage.id, data: formData });
    } else {
      createMutation.mutate(formData as InsertPage);
    }
  };

  const handleEdit = (page: Page) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      isPublished: page.isPublished || false,
      seoTitle: page.seoTitle || "",
      seoDescription: page.seoDescription || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this page?")) {
      deleteMutation.mutate(id);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const pageTemplates = [
    { name: "About Us", slug: "about-us", content: "# About Us\n\nTell your story here..." },
    { name: "Privacy Policy", slug: "privacy-policy", content: "# Privacy Policy\n\nYour privacy policy content..." },
    { name: "Terms & Conditions", slug: "terms-conditions", content: "# Terms & Conditions\n\nYour terms and conditions..." },
    { name: "Contact Us", slug: "contact", content: "# Contact Us\n\nGet in touch with us..." }
  ];

  const useTemplate = (template: typeof pageTemplates[0]) => {
    setFormData({
      ...formData,
      title: template.name,
      slug: template.slug,
      content: template.content,
      seoTitle: template.name,
      seoDescription: `Learn more about ${template.name.toLowerCase()} at our website.`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Static Pages</h3>
          <p className="text-sm text-gray-600">Manage static pages like About Us, Privacy Policy, etc.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingPage(null); }}>
              <Plus className="h-4 w-4 mr-2" />
              New Page
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPage ? "Edit Page" : "Create New Page"}</DialogTitle>
              <DialogDescription>
                {editingPage ? "Update the page details below" : "Fill in the details to create a new static page"}
              </DialogDescription>
            </DialogHeader>
            
            {!editingPage && (
              <div className="mb-4">
                <Label>Quick Templates</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {pageTemplates.map((template) => (
                    <Button
                      key={template.slug}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => useTemplate(template)}
                    >
                      {template.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setFormData({ 
                        ...formData, 
                        title,
                        slug: formData.slug || generateSlug(title),
                        seoTitle: formData.seoTitle || title
                      });
                    }}
                    placeholder="Enter page title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="page-url-slug"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Content *</Label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(content: string) => setFormData({ ...formData, content })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <Input
                    id="seoTitle"
                    value={formData.seoTitle}
                    onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                    placeholder="SEO optimized title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seoDescription">SEO Description</Label>
                  <Textarea
                    id="seoDescription"
                    value={formData.seoDescription}
                    onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                    placeholder="SEO meta description"
                    rows={2}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.isPublished}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
                />
                <Label htmlFor="published">Published</Label>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Page"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading pages...
                  </TableCell>
                </TableRow>
              ) : pages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No pages found. Create your first page to get started.
                  </TableCell>
                </TableRow>
              ) : (
                pages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-gray-400" />
                        <div className="font-medium">{page.title}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-500">/{page.slug}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {page.isPublished ? (
                          <>
                            <Eye className="h-4 w-4 text-green-600 mr-1" />
                            <Badge variant="default" className="bg-green-600">Published</Badge>
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-4 w-4 text-gray-400 mr-1" />
                            <Badge variant="secondary">Draft</Badge>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-500">
                        {page.updatedAt ? new Date(page.updatedAt).toLocaleDateString() : 'Never'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(page)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDelete(page.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}