import { Mail, Phone, Plus, Pencil, Trash2, Upload, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Sponsor, SponsorFlyer } from "@shared/schema";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { compressImage, validateImageFile } from "@/lib/imageService";

const Sponsors = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  
  const [addSponsorOpen, setAddSponsorOpen] = useState(false);
  const [editSponsorOpen, setEditSponsorOpen] = useState(false);
  const [deleteSponsorOpen, setDeleteSponsorOpen] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);
  
  const [sponsorName, setSponsorName] = useState("");
  const [sponsorLogo, setSponsorLogo] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  
  const [uploadFlyerOpen, setUploadFlyerOpen] = useState(false);
  const [flyerFile, setFlyerFile] = useState<File | null>(null);
  const [uploadingFlyer, setUploadingFlyer] = useState(false);

  const { data: sponsors = [], isLoading: loadingSponsors } = useQuery<Sponsor[]>({
    queryKey: ['/api/sponsors'],
  });

  const { data: sponsorFlyer } = useQuery<SponsorFlyer | null>({
    queryKey: ['/api/sponsor-flyer'],
  });

  const addSponsorMutation = useMutation({
    mutationFn: async (data: { name: string; logoPath: string | null; website?: string; tier?: string; order?: number }) => {
      return await apiRequest('/api/sponsors', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sponsors'] });
      setAddSponsorOpen(false);
      resetSponsorForm();
      toast({
        title: "Success",
        description: "Sponsor added successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add sponsor",
        variant: "destructive",
      });
    },
  });

  const updateSponsorMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string | number; data: Partial<{ name: string; logoPath: string | null; website?: string; tier?: string; order?: number }> }) => {
      return await apiRequest(`/api/sponsors/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sponsors'] });
      setEditSponsorOpen(false);
      resetSponsorForm();
      toast({
        title: "Success",
        description: "Sponsor updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update sponsor",
        variant: "destructive",
      });
    },
  });

  const deleteSponsorMutation = useMutation({
    mutationFn: async (id: string | number) => {
      return await apiRequest(`/api/sponsors/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sponsors'] });
      setDeleteSponsorOpen(false);
      setSelectedSponsor(null);
      toast({
        title: "Success",
        description: "Sponsor deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete sponsor",
        variant: "destructive",
      });
    },
  });

  const uploadFlyerMutation = useMutation({
    mutationFn: async (pdfUrl: string) => {
      return await apiRequest('/api/sponsor-flyer', {
        method: 'POST',
        body: JSON.stringify({
          pdfUrl,
          uploadedAt: new Date().toISOString(),
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sponsor-flyer'] });
      setUploadFlyerOpen(false);
      setFlyerFile(null);
      toast({
        title: "Success",
        description: "Sponsor flyer uploaded successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to upload sponsor flyer",
        variant: "destructive",
      });
    },
  });

  const resetSponsorForm = () => {
    setSponsorName("");
    setSponsorLogo(null);
    setLogoFile(null);
    setSelectedSponsor(null);
  };

  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast({
        title: "Invalid file",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setUploadingLogo(true);
    try {
      const compressed = await compressImage(file, {
        maxWidth: 800,
        maxHeight: 400,
        quality: 0.9,
      });
      setSponsorLogo(compressed.dataUrl);
      setLogoFile(file);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process image",
        variant: "destructive",
      });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleAddSponsor = async () => {
    if (!sponsorName.trim()) {
      toast({
        title: "Validation Error",
        description: "Sponsor name is required",
        variant: "destructive",
      });
      return;
    }

    await addSponsorMutation.mutateAsync({
      name: sponsorName,
      logoPath: sponsorLogo,
    });
  };

  const handleEditSponsor = async () => {
    if (!selectedSponsor) return;
    
    if (!sponsorName.trim()) {
      toast({
        title: "Validation Error",
        description: "Sponsor name is required",
        variant: "destructive",
      });
      return;
    }

    await updateSponsorMutation.mutateAsync({
      id: selectedSponsor.id,
      data: {
        name: sponsorName,
        logoPath: sponsorLogo,
      },
    });
  };

  const handleDeleteSponsor = async () => {
    if (!selectedSponsor) return;
    await deleteSponsorMutation.mutateAsync(selectedSponsor.id);
  };

  const openEditDialog = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor);
    setSponsorName(sponsor.name);
    setSponsorLogo(sponsor.logoPath);
    setEditSponsorOpen(true);
  };

  const openDeleteDialog = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor);
    setDeleteSponsorOpen(true);
  };

  const handleFlyerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file",
        description: "Only PDF files are allowed",
        variant: "destructive",
      });
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB",
        variant: "destructive",
      });
      return;
    }

    setFlyerFile(file);
  };

  const handleUploadFlyer = async () => {
    if (!flyerFile) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file to upload",
        variant: "destructive",
      });
      return;
    }

    setUploadingFlyer(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        await uploadFlyerMutation.mutateAsync(dataUrl);
        setUploadingFlyer(false);
      };
      reader.onerror = () => {
        toast({
          title: "Error",
          description: "Failed to read PDF file",
          variant: "destructive",
        });
        setUploadingFlyer(false);
      };
      reader.readAsDataURL(flyerFile);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload flyer",
        variant: "destructive",
      });
      setUploadingFlyer(false);
    }
  };

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              Our Sponsors
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              We're grateful for the support of our sponsors who help make our chess club activities possible.
              Their contributions enable us to host tournaments, provide equipment, and create a welcoming
              environment for all chess enthusiasts.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-serif text-3xl font-bold">
              Current Sponsors
            </h2>
            {isAdmin && (
              <Button
                onClick={() => setAddSponsorOpen(true)}
                className="gap-2"
                data-testid="button-add-sponsor"
              >
                <Plus size={20} />
                Add Sponsor
              </Button>
            )}
          </div>

          {loadingSponsors ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading sponsors...</p>
            </div>
          ) : sponsors.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No sponsors yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {sponsors.map((sponsor) => (
                <Card key={sponsor.id} className="hover:shadow-lg transition-shadow" data-testid={`card-sponsor-${sponsor.id}`}>
                  <CardContent className="p-8">
                    <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                      {sponsor.logoPath ? (
                        <img
                          src={sponsor.logoPath}
                          alt={sponsor.name}
                          className="w-full h-full object-contain p-4"
                          data-testid={`img-sponsor-logo-${sponsor.id}`}
                        />
                      ) : (
                        <span className="text-muted-foreground text-sm" data-testid={`text-no-logo-${sponsor.id}`}>
                          No Logo
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-center mb-4" data-testid={`text-sponsor-name-${sponsor.id}`}>
                      {sponsor.name}
                    </h3>
                    {isAdmin && (
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(sponsor)}
                          className="gap-2"
                          data-testid={`button-edit-sponsor-${sponsor.id}`}
                        >
                          <Pencil size={16} />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDeleteDialog(sponsor)}
                          className="gap-2 text-destructive hover:text-destructive"
                          data-testid={`button-delete-sponsor-${sponsor.id}`}
                        >
                          <Trash2 size={16} />
                          Delete
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-dark-bg text-dark-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
              Sponsor Flyer
            </h2>
            
            {isAdmin ? (
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground mb-8">
                  Upload a PDF flyer with sponsorship information and benefits.
                </p>
                
                {sponsorFlyer ? (
                  <div className="bg-background rounded-lg p-6 space-y-4">
                    <div className="flex items-center justify-center gap-3 text-primary">
                      <FileText size={32} />
                      <span className="text-lg font-semibold">Current Flyer Uploaded</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Uploaded on: {new Date(sponsorFlyer.uploadedAt).toLocaleDateString()}
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button
                        variant="outline"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = sponsorFlyer.pdfUrl;
                          link.download = 'sponsor-flyer.pdf';
                          link.click();
                        }}
                        className="gap-2"
                        data-testid="button-download-flyer"
                      >
                        <Download size={20} />
                        Download
                      </Button>
                      <Button
                        onClick={() => setUploadFlyerOpen(true)}
                        className="gap-2"
                        data-testid="button-replace-flyer"
                      >
                        <Upload size={20} />
                        Replace Flyer
                      </Button>
                    </div>
                    <div className="mt-6 border rounded-lg overflow-hidden" style={{ height: '500px' }}>
                      <iframe
                        src={sponsorFlyer.pdfUrl}
                        className="w-full h-full"
                        title="Sponsor Flyer PDF"
                        data-testid="iframe-flyer-preview"
                      />
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => setUploadFlyerOpen(true)}
                    className="gap-2"
                    size="lg"
                    data-testid="button-upload-flyer"
                  >
                    <Upload size={20} />
                    Upload Sponsor Flyer
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {sponsorFlyer ? (
                  <div className="bg-background rounded-lg p-6 space-y-4">
                    <p className="text-lg text-muted-foreground mb-4">
                      Download our sponsorship flyer to learn about partnership opportunities.
                    </p>
                    <Button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = sponsorFlyer.pdfUrl;
                        link.download = 'sponsor-flyer.pdf';
                        link.click();
                      }}
                      className="gap-2"
                      size="lg"
                      data-testid="button-download-flyer-public"
                    >
                      <Download size={20} />
                      Download Sponsorship Information
                    </Button>
                    <div className="mt-6 border rounded-lg overflow-hidden" style={{ height: '500px' }}>
                      <iframe
                        src={sponsorFlyer.pdfUrl}
                        className="w-full h-full"
                        title="Sponsor Flyer PDF"
                        data-testid="iframe-flyer-preview-public"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-lg text-muted-foreground" data-testid="text-no-flyer">
                    Sponsorship information coming soon
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl font-bold mb-6">
              Get in Touch
            </h2>
            <p className="text-muted-foreground mb-8">
              Interested in sponsoring the Rutgers University Chess Club? 
              We'd love to hear from you and discuss partnership opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <a href="mailto:sponsors@rutgerschess.com" className="flex items-center gap-2 text-primary hover:underline" data-testid="link-email">
                <Mail size={20} />
                sponsors@rutgerschess.com
              </a>
              <a href="tel:+1234567890" className="flex items-center gap-2 text-primary hover:underline" data-testid="link-phone">
                <Phone size={20} />
                (123) 456-7890
              </a>
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6" data-testid="button-contact">
              Contact Us About Sponsorship
            </Button>
          </div>
        </div>
      </section>

      <Dialog open={addSponsorOpen} onOpenChange={setAddSponsorOpen}>
        <DialogContent data-testid="dialog-add-sponsor">
          <DialogHeader>
            <DialogTitle>Add New Sponsor</DialogTitle>
            <DialogDescription>
              Add a new sponsor to the sponsors section
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="sponsor-name">Sponsor Name *</Label>
              <Input
                id="sponsor-name"
                value={sponsorName}
                onChange={(e) => setSponsorName(e.target.value)}
                placeholder="Enter sponsor name"
                data-testid="input-sponsor-name"
              />
            </div>
            <div>
              <Label htmlFor="sponsor-logo">Sponsor Logo</Label>
              <Input
                id="sponsor-logo"
                type="file"
                accept="image/*"
                onChange={handleLogoFileChange}
                disabled={uploadingLogo}
                data-testid="input-sponsor-logo"
              />
              {uploadingLogo && (
                <p className="text-sm text-muted-foreground mt-2">Processing image...</p>
              )}
              {sponsorLogo && (
                <div className="mt-4 border rounded-lg p-4">
                  <img src={sponsorLogo} alt="Preview" className="max-h-40 mx-auto" data-testid="img-logo-preview" />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setAddSponsorOpen(false); resetSponsorForm(); }} data-testid="button-cancel-add">
              Cancel
            </Button>
            <Button onClick={handleAddSponsor} disabled={addSponsorMutation.isPending || uploadingLogo} data-testid="button-submit-add">
              {addSponsorMutation.isPending ? "Adding..." : "Add Sponsor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editSponsorOpen} onOpenChange={setEditSponsorOpen}>
        <DialogContent data-testid="dialog-edit-sponsor">
          <DialogHeader>
            <DialogTitle>Edit Sponsor</DialogTitle>
            <DialogDescription>
              Update sponsor information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-sponsor-name">Sponsor Name *</Label>
              <Input
                id="edit-sponsor-name"
                value={sponsorName}
                onChange={(e) => setSponsorName(e.target.value)}
                placeholder="Enter sponsor name"
                data-testid="input-edit-sponsor-name"
              />
            </div>
            <div>
              <Label htmlFor="edit-sponsor-logo">Sponsor Logo</Label>
              <Input
                id="edit-sponsor-logo"
                type="file"
                accept="image/*"
                onChange={handleLogoFileChange}
                disabled={uploadingLogo}
                data-testid="input-edit-sponsor-logo"
              />
              {uploadingLogo && (
                <p className="text-sm text-muted-foreground mt-2">Processing image...</p>
              )}
              {sponsorLogo && (
                <div className="mt-4 border rounded-lg p-4">
                  <img src={sponsorLogo} alt="Preview" className="max-h-40 mx-auto" data-testid="img-edit-logo-preview" />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditSponsorOpen(false); resetSponsorForm(); }} data-testid="button-cancel-edit">
              Cancel
            </Button>
            <Button onClick={handleEditSponsor} disabled={updateSponsorMutation.isPending || uploadingLogo} data-testid="button-submit-edit">
              {updateSponsorMutation.isPending ? "Updating..." : "Update Sponsor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteSponsorOpen} onOpenChange={setDeleteSponsorOpen}>
        <AlertDialogContent data-testid="dialog-delete-sponsor">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Sponsor</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedSponsor?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSponsor}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteSponsorMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteSponsorMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={uploadFlyerOpen} onOpenChange={setUploadFlyerOpen}>
        <DialogContent data-testid="dialog-upload-flyer">
          <DialogHeader>
            <DialogTitle>Upload Sponsor Flyer</DialogTitle>
            <DialogDescription>
              Upload a PDF file with sponsorship information (max 10MB)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="flyer-file">PDF File *</Label>
              <Input
                id="flyer-file"
                type="file"
                accept="application/pdf"
                onChange={handleFlyerFileChange}
                data-testid="input-flyer-file"
              />
              {flyerFile && (
                <p className="text-sm text-muted-foreground mt-2" data-testid="text-flyer-filename">
                  Selected: {flyerFile.name} ({(flyerFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setUploadFlyerOpen(false); setFlyerFile(null); }} data-testid="button-cancel-upload">
              Cancel
            </Button>
            <Button onClick={handleUploadFlyer} disabled={uploadingFlyer || !flyerFile} data-testid="button-submit-upload">
              {uploadingFlyer ? "Uploading..." : "Upload Flyer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sponsors;
