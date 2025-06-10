
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Trash2, Edit, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { SocialSetting, InsertSocialSetting } from "@shared/schema";

interface SocialFormData {
  platform: string;
  url: string;
  iconClass: string;
  isEnabled: boolean;
  sortOrder: number;
}

export function SocialManagement() {
  const [editingSocial, setEditingSocial] = useState<SocialSetting | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<SocialFormData>({
    platform: "",
    url: "",
    iconClass: "",
    isEnabled: true,
    sortOrder: 0,
  });

  const queryClient = useQueryClient();

  const { data: socialSettings = [], isLoading } = useQuery({
    queryKey: ["/api/admin/social-settings"],
    queryFn: async () => {
      const response = await fetch("/api/admin/social-settings");
      if (!response.ok) throw new Error("Failed to fetch social settings");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertSocialSetting) => {
      const response = await fetch("/api/admin/social-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create social setting");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social-settings"] });
      toast({ title: "Social setting created successfully" });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertSocialSetting }) => {
      const response = await fetch(`/api/admin/social-settings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update social setting");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social-settings"] });
      toast({ title: "Social setting updated successfully" });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/social-settings/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete social setting");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social-settings"] });
      toast({ title: "Social setting deleted successfully" });
    },
  });

  const resetForm = () => {
    setFormData({
      platform: "",
      url: "",
      iconClass: "",
      isEnabled: true,
      sortOrder: 0,
    });
    setEditingSocial(null);
    setIsCreating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData: InsertSocialSetting = {
      platform: formData.platform,
      url: formData.url,
      iconClass: formData.iconClass,
      isEnabled: formData.isEnabled,
      sortOrder: formData.sortOrder,
    };

    if (editingSocial) {
      updateMutation.mutate({ id: editingSocial.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const startEdit = (social: SocialSetting) => {
    setEditingSocial(social);
    setIsCreating(true);
    setFormData({
      platform: social.platform,
      url: social.url,
      iconClass: social.iconClass,
      isEnabled: social.isEnabled || true,
      sortOrder: social.sortOrder || 0,
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Social Media Management</h2>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Social Link
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>{editingSocial ? "Edit Social Link" : "Create Social Link"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="platform">Platform</Label>
                <Input
                  id="platform"
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  placeholder="e.g., facebook, twitter, instagram"
                  required
                />
              </div>
              <div>
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                  required
                />
              </div>
              <div>
                <Label htmlFor="iconClass">Icon Class</Label>
                <Input
                  id="iconClass"
                  value={formData.iconClass}
                  onChange={(e) => setFormData({ ...formData, iconClass: e.target.value })}
                  placeholder="e.g., fab fa-facebook, lucide-twitter"
                  required
                />
              </div>
              <div>
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.isEnabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, isEnabled: checked })}
                />
                <Label>Enabled</Label>
              </div>
              <div className="flex space-x-2">
                <Button type="submit">
                  {editingSocial ? "Update" : "Create"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {socialSettings.map((social: SocialSetting) => (
          <Card key={social.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="font-semibold capitalize">{social.platform}</h3>
                  <p className="text-sm text-gray-600">{social.url}</p>
                  <p className="text-xs text-gray-500">Icon: {social.iconClass}</p>
                </div>
                <Badge variant={social.isEnabled ? "default" : "secondary"}>
                  {social.isEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => startEdit(social)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteMutation.mutate(social.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
