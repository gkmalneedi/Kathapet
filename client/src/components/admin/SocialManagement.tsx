import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { SocialSetting, InsertSocialSetting } from "@shared/schema";

interface SocialFormData {
  platform: string;
  url: string;
  iconClass: string;
  isEnabled: boolean;
  sortOrder: number;
}

export function SocialManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState<SocialSetting | null>(null);
  const [formData, setFormData] = useState<SocialFormData>({
    platform: "",
    url: "",
    iconClass: "",
    isEnabled: true,
    sortOrder: 0
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: socialSettings = [], isLoading } = useQuery<SocialSetting[]>({
    queryKey: ["/api/admin/social-settings"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertSocialSetting) => {
      return await apiRequest("/api/admin/social-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social-settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/social-settings"] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "Success", description: "Social setting created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create social setting", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertSocialSetting> }) => {
      return await apiRequest(`/api/admin/social-settings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social-settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/social-settings"] });
      setIsDialogOpen(false);
      setEditingSocial(null);
      resetForm();
      toast({ title: "Success", description: "Social setting updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update social setting", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/admin/social-settings/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social-settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/social-settings"] });
      toast({ title: "Success", description: "Social setting deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete social setting", variant: "destructive" });
    }
  });

  const resetForm = () => {
    setFormData({
      platform: "",
      url: "",
      iconClass: "",
      isEnabled: true,
      sortOrder: 0
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSocial) {
      updateMutation.mutate({ id: editingSocial.id, data: formData });
    } else {
      createMutation.mutate(formData as InsertSocialSetting);
    }
  };

  const handleEdit = (social: SocialSetting) => {
    setEditingSocial(social);
    setFormData({
      platform: social.platform,
      url: social.url,
      iconClass: social.iconClass,
      isEnabled: social.isEnabled || false,
      sortOrder: social.sortOrder || 0
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this social media setting?")) {
      deleteMutation.mutate(id);
    }
  };

  const socialPlatforms = [
    { name: "Facebook", icon: "fab fa-facebook-f", baseUrl: "https://facebook.com/" },
    { name: "Twitter", icon: "fab fa-twitter", baseUrl: "https://twitter.com/" },
    { name: "Instagram", icon: "fab fa-instagram", baseUrl: "https://instagram.com/" },
    { name: "LinkedIn", icon: "fab fa-linkedin-in", baseUrl: "https://linkedin.com/in/" },
    { name: "YouTube", icon: "fab fa-youtube", baseUrl: "https://youtube.com/@" },
    { name: "TikTok", icon: "fab fa-tiktok", baseUrl: "https://tiktok.com/@" },
    { name: "Pinterest", icon: "fab fa-pinterest", baseUrl: "https://pinterest.com/" },
    { name: "WhatsApp", icon: "fab fa-whatsapp", baseUrl: "https://wa.me/" },
    { name: "Telegram", icon: "fab fa-telegram", baseUrl: "https://t.me/" },
    { name: "GitHub", icon: "fab fa-github", baseUrl: "https://github.com/" }
  ];

  const handlePlatformChange = (platform: string) => {
    const selectedPlatform = socialPlatforms.find(p => p.name === platform);
    if (selectedPlatform) {
      setFormData({
        ...formData,
        platform,
        iconClass: selectedPlatform.icon,
        url: formData.url || selectedPlatform.baseUrl
      });
    } else {
      setFormData({ ...formData, platform });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Social Media Settings</h3>
          <p className="text-sm text-gray-600">Manage social media icons and links for your website</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingSocial(null); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Social Link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSocial ? "Edit Social Setting" : "Add Social Link"}</DialogTitle>
              <DialogDescription>
                {editingSocial ? "Update the social media setting below" : "Add a new social media link to your website"}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platform">Platform *</Label>
                <Select value={formData.platform} onValueChange={handlePlatformChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select social platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {socialPlatforms.map((platform) => (
                      <SelectItem key={platform.name} value={platform.name}>
                        <div className="flex items-center">
                          <i className={`${platform.icon} mr-2`}></i>
                          {platform.name}
                        </div>
                      </SelectItem>
                    ))}
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">URL *</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://example.com/your-profile"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="iconClass">Icon Class *</Label>
                <Input
                  id="iconClass"
                  value={formData.iconClass}
                  onChange={(e) => setFormData({ ...formData, iconClass: e.target.value })}
                  placeholder="fab fa-facebook-f (FontAwesome class)"
                  required
                />
                <p className="text-xs text-gray-500">
                  Use FontAwesome icon classes. Example: fab fa-facebook-f
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="enabled"
                  checked={formData.isEnabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, isEnabled: checked })}
                />
                <Label htmlFor="enabled">Enabled</Label>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Setting"}
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
                <TableHead>Platform</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Icon</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sort Order</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading social settings...
                  </TableCell>
                </TableRow>
              ) : socialSettings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No social media links found. Add your first social link to get started.
                  </TableCell>
                </TableRow>
              ) : (
                socialSettings.map((social) => (
                  <TableRow key={social.id}>
                    <TableCell>
                      <div className="font-medium">{social.platform}</div>
                    </TableCell>
                    <TableCell>
                      <a 
                        href={social.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm truncate max-w-xs block"
                      >
                        {social.url}
                      </a>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <i className={`${social.iconClass} mr-2`}></i>
                        <span className="text-sm text-gray-500">{social.iconClass}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {social.isEnabled ? (
                          <>
                            <Eye className="h-4 w-4 text-green-600 mr-1" />
                            <Badge variant="default" className="bg-green-600">Enabled</Badge>
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-4 w-4 text-gray-400 mr-1" />
                            <Badge variant="secondary">Disabled</Badge>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{social.sortOrder || 0}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(social)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDelete(social.id)}
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

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium mb-2">FontAwesome Setup</h4>
        <p className="text-sm text-gray-600 mb-2">
          To display social media icons, add FontAwesome to your website's header:
        </p>
        <code className="text-xs bg-white p-2 rounded block">
          &lt;link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"&gt;
        </code>
      </div>
    </div>
  );
}