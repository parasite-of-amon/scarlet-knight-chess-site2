import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Target, Eye, Edit2 } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { compressImage, validateImageFile } from "@/lib/imageService";
import type { AboutContent } from "@shared/schema";

interface EditSectionData {
  section: string;
  content: string;
  imagePath: string | null;
}

const About = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editImage, setEditImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch all about content
  const { data: aboutContents = [], isLoading } = useQuery<AboutContent[]>({
    queryKey: ['/api/about-content'],
  });

  // Mutation to save content
  const saveMutation = useMutation({
    mutationFn: async (data: EditSectionData) => {
      return await apiRequest('/api/about-content', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/about-content'] });
      toast({
        title: "Success",
        description: "Content saved successfully",
      });
      setEditingSection(null);
      setEditContent("");
      setEditImage(null);
      setImageFile(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save content: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Get content for a specific section
  const getContentForSection = (section: string) => {
    return aboutContents.find(c => c.section === section);
  };

  // Handle opening edit dialog
  const handleEdit = (section: string) => {
    const content = getContentForSection(section);
    setEditingSection(section);
    setEditContent(content?.content || "");
    setEditImage(content?.imagePath || null);
    setImageFile(null);
  };

  // Handle image file selection
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast({
        title: "Invalid Image",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const compressed = await compressImage(file, {
        maxWidth: 1200,
        maxHeight: 800,
        quality: 0.85,
      });
      setEditImage(compressed.dataUrl);
      setImageFile(file);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Handle save
  const handleSave = () => {
    if (!editingSection) return;

    saveMutation.mutate({
      section: editingSection,
      content: editContent,
      imagePath: editImage,
    });
  };

  // Handle cancel
  const handleCancel = () => {
    setEditingSection(null);
    setEditContent("");
    setEditImage(null);
    setImageFile(null);
  };

  // Render editable section
  const renderEditableSection = (
    section: string,
    title: string,
    className: string = ""
  ) => {
    const content = getContentForSection(section);
    const hasContent = content && content.content;

    return (
      <div className={`relative ${className}`}>
        {isAdmin && (
          <Button
            data-testid={`button-edit-${section}`}
            onClick={() => handleEdit(section)}
            variant="outline"
            size="sm"
            className="absolute top-2 right-2 z-10"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
        )}
        
        <h2 className="font-serif text-3xl font-bold mb-6">{title}</h2>
        
        {hasContent ? (
          <div className="space-y-4">
            {content.imagePath && (
              <img
                src={content.imagePath}
                alt={title}
                className="w-full rounded-lg shadow-lg mb-4"
                data-testid={`img-${section}`}
              />
            )}
            <div
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: content.content.replace(/\n/g, '<br />') }}
              data-testid={`text-content-${section}`}
            />
          </div>
        ) : (
          <div className="min-h-[200px] border-2 border-dashed border-muted rounded-lg flex items-center justify-center p-8">
            <p className="text-muted-foreground text-center" data-testid={`text-placeholder-${section}`}>
              This section can be edited by admins.
              <br />
              Sign in as admin to add content here.
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Page Header */}
      <section className="relative py-32 bg-dark-bg text-dark-foreground overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-dark-bg/40 to-dark-bg/20 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1560174038-da43ac74f01b?w=1200')",
          }}
        />
        <div className="container mx-auto px-4 text-center relative z-20">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">About Us</h1>
          <div className="flex items-center justify-center gap-2 text-sm text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            <Link href="/" className="hover:text-primary" data-testid="link-home">Home</Link>
            <span>/</span>
            <span className="text-primary">About</span>
          </div>
        </div>
      </section>

      {/* Main About Content - Editable by Admin */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          {/* Introduction Section */}
          <div className="mb-20">
            {renderEditableSection("intro", "Our Story")}
          </div>

          {/* History Section */}
          <div className="mb-20">
            {renderEditableSection("history", "Our History")}
          </div>

          {/* Vision & Mission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <Card className="bg-dark-bg text-dark-foreground border-none">
              <CardContent className="p-10">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To create an inclusive environment where chess enthusiasts of all skill levels
                  can come together to learn, compete, and grow. We strive to be the premier
                  chess organization at Rutgers University.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary">
              <CardContent className="p-10">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Eye className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our mission is to foster skill development through regular meetings, tournaments,
                  and training sessions. We aim to build a strong community of chess players while
                  maintaining an active campus presence.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Team Section */}
          <div className="mb-20">
            {renderEditableSection("team", "Meet the Team")}
          </div>
        </div>
      </section>

      {/* Edit Dialog */}
      <Dialog open={!!editingSection} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="dialog-edit-content">
          <DialogHeader>
            <DialogTitle>Edit {editingSection === "intro" ? "Introduction" : editingSection === "history" ? "History" : editingSection === "team" ? "Team" : "Content"}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                data-testid="textarea-content"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Enter content here..."
                className="min-h-[200px]"
              />
              <p className="text-sm text-muted-foreground">
                Tip: Use line breaks to format your text
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image (Optional)</Label>
              <Input
                id="image"
                data-testid="input-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isUploading}
              />
              {isUploading && (
                <p className="text-sm text-muted-foreground">Processing image...</p>
              )}
              {editImage && (
                <div className="mt-4">
                  <img
                    src={editImage}
                    alt="Preview"
                    className="w-full max-h-[300px] object-cover rounded-lg"
                    data-testid="img-preview"
                  />
                  <Button
                    data-testid="button-remove-image"
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditImage(null);
                      setImageFile(null);
                    }}
                    className="mt-2"
                  >
                    Remove Image
                  </Button>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              data-testid="button-cancel"
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={saveMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              data-testid="button-save"
              type="button"
              onClick={handleSave}
              disabled={saveMutation.isPending || isUploading}
            >
              {saveMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default About;
