import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Upload, Copy, Eye, Download } from "lucide-react";
import type { Media, InsertMedia } from "@shared/schema";

interface MediaFormData {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  alt: string;
}

export function MediaManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState<MediaFormData>({
    filename: "",
    originalName: "",
    mimeType: "",
    size: 0,
    url: "",
    alt: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: mediaFiles = [], isLoading } = useQuery<Media[]>({
    queryKey: ["/api/admin/media"],
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to upload file');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/media"] });
      setIsUploadDialogOpen(false);
      setSelectedFile(null);
      setUploadProgress(0);
      toast({ title: "Success", description: "File uploaded successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to upload file", variant: "destructive" });
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertMedia) => {
      const response = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to add media');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/media"] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "Success", description: "Media added successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add media", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/media/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error('Failed to delete media');
      return response.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/media"] });
      toast({ title: "Success", description: "Media deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete media", variant: "destructive" });
    }
  });

  const resetForm = () => {
    setFormData({
      filename: "",
      originalName: "",
      mimeType: "",
      size: 0,
      url: "",
      alt: ""
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData as InsertMedia);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this media file?")) {
      deleteMutation.mutate(id);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "Copied", description: "URL copied to clipboard" });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType.startsWith('video/')) return '🎥';
    if (fileType.startsWith('audio/')) return '🎵';
    if (fileType.includes('pdf')) return '📄';
    return '📁';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Media Library</h3>
          <p className="text-sm text-gray-600">Upload and manage images, videos, and other media files</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Media File</DialogTitle>
                <DialogDescription>
                  Select a file to upload to your media library
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="file">Select File</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileSelect}
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                  />
                </div>
                
                {selectedFile && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getFileIcon(selectedFile.type)}</span>
                      <div>
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {uploadProgress > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpload} 
                  disabled={!selectedFile || uploadMutation.isPending}
                >
                  {uploadMutation.isPending ? "Uploading..." : "Upload"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => { resetForm(); }}>
                <Plus className="h-4 w-4 mr-2" />
                Add URL
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Media by URL</DialogTitle>
                <DialogDescription>
                  Add media file by providing a direct URL
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url">Media URL *</Label>
                  <Input
                    id="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="filename">Filename *</Label>
                  <Input
                    id="filename"
                    value={formData.filename}
                    onChange={(e) => setFormData({ ...formData, filename: e.target.value })}
                    placeholder="image.jpg"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alt">Alt Text</Label>
                  <Input
                    id="alt"
                    value={formData.alt}
                    onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                    placeholder="Description of the media"
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Adding..." : "Add Media"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p>Loading media files...</p>
        </div>
      ) : mediaFiles.length === 0 ? (
        <div className="text-center py-12">
          <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">No media files</h3>
          <p className="text-gray-600 mb-4">Upload your first media file to get started</p>
          <Button onClick={() => setIsUploadDialogOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload File
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mediaFiles.map((media) => (
            <Card key={media.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  {media.fileType?.startsWith('image/') ? (
                    <img 
                      src={media.url} 
                      alt={media.altText || media.filename}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-4xl">
                      {getFileIcon(media.fileType || '')}
                    </div>
                  )}
                </div>
                
                <div className="p-3">
                  <p className="font-medium text-sm truncate" title={media.filename}>
                    {media.filename}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {media.fileSize ? formatFileSize(media.fileSize) : 'Unknown size'}
                  </p>
                  
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex space-x-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => copyToClipboard(media.url)}
                        title="Copy URL"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => window.open(media.url, '_blank')}
                        title="View"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDelete(media.id)}
                      className="text-red-600 hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}