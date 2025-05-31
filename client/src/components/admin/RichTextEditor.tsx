import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Bold, Italic, Underline, List, ListOrdered, Link, Image, Table, 
  Type, AlignLeft, AlignCenter, AlignRight, Code, Quote, Video, 
  FileText, Hash, Minus, Maximize2 
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [showEmbedDialog, setShowEmbedDialog] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [embedCode, setEmbedCode] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (before: string, after: string = "", placeholder: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const textToInsert = selectedText || placeholder;
    
    const newValue = value.substring(0, start) + before + textToInsert + after + value.substring(end);
    onChange(newValue);
    
    // Set cursor position
    setTimeout(() => {
      const newCursorPos = start + before.length + textToInsert.length + after.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  const formatButtons = [
    { icon: Bold, action: () => insertText("**", "**", "bold text"), tooltip: "Bold" },
    { icon: Italic, action: () => insertText("*", "*", "italic text"), tooltip: "Italic" },
    { icon: Underline, action: () => insertText("<u>", "</u>", "underlined text"), tooltip: "Underline" },
    { icon: Code, action: () => insertText("`", "`", "code"), tooltip: "Inline Code" },
    { icon: Quote, action: () => insertText("> ", "", "quote"), tooltip: "Quote" },
  ];

  const structureButtons = [
    { icon: Type, action: () => insertText("# ", "", "Heading"), tooltip: "Heading" },
    { icon: List, action: () => insertText("- ", "", "List item"), tooltip: "Bullet List" },
    { icon: ListOrdered, action: () => insertText("1. ", "", "List item"), tooltip: "Numbered List" },
    { icon: Minus, action: () => insertText("\n---\n"), tooltip: "Horizontal Rule" },
  ];

  const mediaButtons = [
    { icon: Link, action: () => setShowLinkDialog(true), tooltip: "Insert Link" },
    { icon: Image, action: () => setShowImageDialog(true), tooltip: "Insert Image" },
    { icon: Video, action: () => setShowVideoDialog(true), tooltip: "Insert Video" },
    { icon: Table, action: () => setShowTableDialog(true), tooltip: "Insert Table" },
    { icon: FileText, action: () => setShowEmbedDialog(true), tooltip: "Embed Content" },
    { icon: Hash, action: () => insertText(`<blockquote class="twitter-tweet"><a href="${twitterUrl}"></a></blockquote><script async src="https://platform.twitter.com/widgets.js"></script>`), tooltip: "Embed Tweet" },
  ];

  const insertLink = () => {
    insertText(`[${linkText}](${linkUrl})`);
    setShowLinkDialog(false);
    setLinkText("");
    setLinkUrl("");
  };

  const insertImage = () => {
    insertText(`![${imageAlt}](${imageUrl})`);
    setShowImageDialog(false);
    setImageUrl("");
    setImageAlt("");
  };

  const insertVideo = () => {
    const embedCode = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') 
      ? `<iframe width="560" height="315" src="${videoUrl}" frameborder="0" allowfullscreen></iframe>`
      : `<video controls width="560"><source src="${videoUrl}" type="video/mp4"></video>`;
    
    insertText(embedCode);
    setShowVideoDialog(false);
    setVideoUrl("");
  };

  const insertTable = () => {
    let table = "\n";
    // Header row
    for (let i = 0; i < tableCols; i++) {
      table += "| Header " + (i + 1) + " ";
    }
    table += "|\n";
    
    // Separator row
    for (let i = 0; i < tableCols; i++) {
      table += "| --- ";
    }
    table += "|\n";
    
    // Data rows
    for (let row = 0; row < tableRows; row++) {
      for (let col = 0; col < tableCols; col++) {
        table += "| Cell " + (row + 1) + "," + (col + 1) + " ";
      }
      table += "|\n";
    }
    table += "\n";
    
    insertText(table);
    setShowTableDialog(false);
    setTableRows(3);
    setTableCols(3);
  };

  const insertEmbed = () => {
    insertText(embedCode);
    setShowEmbedDialog(false);
    setEmbedCode("");
  };

  return (
    <div className={`border rounded-lg ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      {/* Toolbar */}
      <div className="border-b p-2 flex flex-wrap gap-1">
        {/* Text Formatting */}
        <div className="flex gap-1 border-r pr-2 mr-2">
          {formatButtons.map((btn, idx) => (
            <Button
              key={idx}
              variant="ghost"
              size="sm"
              onClick={btn.action}
              title={btn.tooltip}
              className="h-8 w-8 p-0"
            >
              <btn.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>

        {/* Structure */}
        <div className="flex gap-1 border-r pr-2 mr-2">
          {structureButtons.map((btn, idx) => (
            <Button
              key={idx}
              variant="ghost"
              size="sm"
              onClick={btn.action}
              title={btn.tooltip}
              className="h-8 w-8 p-0"
            >
              <btn.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>

        {/* Media & Links */}
        <div className="flex gap-1 border-r pr-2 mr-2">
          {mediaButtons.map((btn, idx) => (
            <Button
              key={idx}
              variant="ghost"
              size="sm"
              onClick={btn.action}
              title={btn.tooltip}
              className="h-8 w-8 p-0"
            >
              <btn.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>

        {/* Fullscreen */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsFullscreen(!isFullscreen)}
          title="Toggle Fullscreen"
          className="h-8 w-8 p-0"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Start writing your article content... You can use the toolbar above for formatting."
        className={`border-0 resize-none focus:ring-0 ${
          isFullscreen ? 'h-[calc(100vh-60px)]' : 'min-h-[400px]'
        }`}
      />

      {/* Link Dialog */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="linkText">Link Text</Label>
              <Input
                id="linkText"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Enter link text"
              />
            </div>
            <div>
              <Label htmlFor="linkUrl">URL</Label>
              <Input
                id="linkUrl"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
              Cancel
            </Button>
            <Button onClick={insertLink}>Insert Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="imageAlt">Alt Text</Label>
              <Input
                id="imageAlt"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Description of the image"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImageDialog(false)}>
              Cancel
            </Button>
            <Button onClick={insertImage}>Insert Image</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Video Dialog */}
      <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Video</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="videoUrl">Video URL</Label>
              <Input
                id="videoUrl"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="YouTube URL or direct video file URL"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVideoDialog(false)}>
              Cancel
            </Button>
            <Button onClick={insertVideo}>Insert Video</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Table Dialog */}
      <Dialog open={showTableDialog} onOpenChange={setShowTableDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Table</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="tableRows">Rows</Label>
              <Input
                id="tableRows"
                type="number"
                value={tableRows}
                onChange={(e) => setTableRows(parseInt(e.target.value) || 3)}
                min="1"
                max="20"
              />
            </div>
            <div>
              <Label htmlFor="tableCols">Columns</Label>
              <Input
                id="tableCols"
                type="number"
                value={tableCols}
                onChange={(e) => setTableCols(parseInt(e.target.value) || 3)}
                min="1"
                max="10"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTableDialog(false)}>
              Cancel
            </Button>
            <Button onClick={insertTable}>Insert Table</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Embed Dialog */}
      <Dialog open={showEmbedDialog} onOpenChange={setShowEmbedDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Embed Content</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="embedCode">Embed Code (iframe, script, etc.)</Label>
              <Textarea
                id="embedCode"
                value={embedCode}
                onChange={(e) => setEmbedCode(e.target.value)}
                placeholder="Paste your embed code here..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmbedDialog(false)}>
              Cancel
            </Button>
            <Button onClick={insertEmbed}>Insert Embed</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}