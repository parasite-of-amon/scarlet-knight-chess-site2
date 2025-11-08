import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImagePlus, X, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { compressMultipleImages } from "@/lib/imageService";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  insertUnifiedEventFormSchema,
  type InsertUnifiedEvent,
  type UnifiedEvent,
  type WinnerInput,
} from "@shared/schema";
import { parse, isBefore, startOfDay } from "date-fns";

interface UnifiedEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: UnifiedEvent;
}

export const UnifiedEventModal = ({ open, onOpenChange, event }: UnifiedEventModalProps) => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [originalImages, setOriginalImages] = useState<string[]>([]);
  const isEditMode = !!event;

  const form = useForm<z.infer<typeof insertUnifiedEventFormSchema>>({
    resolver: zodResolver(insertUnifiedEventFormSchema),
    defaultValues: {
      title: "",
      date: "",
      location: "",
      time: "",
      description: "",
      imagePaths: undefined,
      isRecurring: false,
      recurrencePattern: undefined,
      participants: "",
      rounds: "",
      rating: "",
      winners: [],
      registrationLink: "",
      registrationLinkLabel: "",
      infoLink: "",
      infoLinkLabel: "",
      externalLink: "",
      externalLinkLabel: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "winners",
  });

  useEffect(() => {
    if (open && event) {
      if (event.imagePaths) {
        try {
          const paths = JSON.parse(event.imagePaths);
          setImagePreviews(paths);
          setOriginalImages(paths);
        } catch (e) {
          setImagePreviews([]);
          setOriginalImages([]);
        }
      } else {
        setImagePreviews([]);
        setOriginalImages([]);
      }

      let parsedWinners: WinnerInput[] = [];
      if (event.winners) {
        try {
          parsedWinners = JSON.parse(event.winners);
        } catch (e) {
          parsedWinners = [];
        }
      }

      form.reset({
        title: event.title,
        date: event.date,
        location: event.location,
        time: event.time || "",
        description: event.description || "",
        imagePaths: event.imagePaths || undefined,
        isRecurring: event.isRecurring || false,
        recurrencePattern: event.recurrencePattern || undefined,
        participants: event.participants || "",
        rounds: event.rounds || "",
        rating: event.rating || "",
        winners: parsedWinners,
        registrationLink: event.registrationLink || "",
        registrationLinkLabel: event.registrationLinkLabel || "",
        infoLink: event.infoLink || "",
        infoLinkLabel: event.infoLinkLabel || "",
        externalLink: event.externalLink || "",
        externalLinkLabel: event.externalLinkLabel || "",
      });
    } else if (open && !event) {
      resetForm();
    }
  }, [open, event, form]);

  const createMutation = useMutation({
    mutationFn: async (data: InsertUnifiedEvent) => {
      return apiRequest('/api/events/unified', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events/unified'] });
      queryClient.invalidateQueries({ queryKey: ['/api/events/upcoming'] });
      queryClient.invalidateQueries({ queryKey: ['/api/events/past'] });
      queryClient.invalidateQueries({ queryKey: ['/api/events/calendar'] });
      toast.success("Event created successfully!");
      resetForm();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create event. Please try again.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertUnifiedEvent> }) => {
      return apiRequest(`/api/events/unified/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events/unified'] });
      queryClient.invalidateQueries({ queryKey: ['/api/events/upcoming'] });
      queryClient.invalidateQueries({ queryKey: ['/api/events/past'] });
      queryClient.invalidateQueries({ queryKey: ['/api/events/calendar'] });
      toast.success("Event updated successfully!");
      resetForm();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update event. Please try again.");
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages(prev => [...prev, ...files]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setSelectedImages([]);
    setImagePreviews([]);
    setOriginalImages([]);
    form.reset({
      title: "",
      date: "",
      location: "",
      time: "",
      description: "",
      imagePaths: undefined,
      isRecurring: false,
      recurrencePattern: undefined,
      participants: "",
      rounds: "",
      rating: "",
      winners: [],
      registrationLink: "",
      registrationLinkLabel: "",
      infoLink: "",
      infoLinkLabel: "",
      externalLink: "",
      externalLinkLabel: "",
    });
  };

  const processImages = async (): Promise<string | undefined> => {
    if (selectedImages.length === 0) {
      return imagePreviews.length > 0 ? JSON.stringify(imagePreviews) : undefined;
    }

    try {
      const compressedImages = await compressMultipleImages(
        selectedImages,
        "upcoming",
        { maxWidth: 1920, maxHeight: 1080, quality: 0.8 }
      );
      const remainingOriginalImages = originalImages.filter(originalPath => 
        imagePreviews.includes(originalPath)
      );
      const newPaths = compressedImages.map(img => img.dataUrl);
      return JSON.stringify([...remainingOriginalImages, ...newPaths]);
    } catch (error) {
      console.error("Error compressing images:", error);
      toast.error(error instanceof Error ? error.message : "Failed to process images");
      throw error;
    }
  };

  const parseEventDate = (dateString: string): Date | null => {
    const formats = ['MMMM d, yyyy', 'MM/dd/yyyy', 'yyyy-MM-dd'];
    
    for (const formatString of formats) {
      try {
        const parsed = parse(dateString, formatString, new Date());
        if (!isNaN(parsed.getTime())) {
          return parsed;
        }
      } catch {
        continue;
      }
    }
    
    return null;
  };

  const handleSubmit = async (data: z.infer<typeof insertUnifiedEventFormSchema>) => {
    try {
      const imagePaths = await processImages();
      
      const winnersData = (data.winners || []).filter(w => w.place && w.name);
      const winnersJson = winnersData.length > 0 ? JSON.stringify(winnersData) : undefined;

      const payload: InsertUnifiedEvent = {
        title: data.title,
        date: data.date,
        location: data.location,
        time: data.time || undefined,
        description: data.description || undefined,
        imagePaths,
        isRecurring: data.isRecurring || false,
        recurrencePattern: data.isRecurring ? data.recurrencePattern : undefined,
        participants: data.participants || undefined,
        rounds: data.rounds || undefined,
        rating: data.rating || undefined,
        winners: winnersJson,
        registrationLink: data.registrationLink || undefined,
        registrationLinkLabel: data.registrationLinkLabel || undefined,
        infoLink: data.infoLink || undefined,
        infoLinkLabel: data.infoLinkLabel || undefined,
        externalLink: data.externalLink || undefined,
        externalLinkLabel: data.externalLinkLabel || undefined,
      };

      if (isEditMode && event?.id) {
        updateMutation.mutate({ id: event.id, data: payload });
      } else {
        createMutation.mutate(payload);
      }
    } catch (error) {
      console.error("Error submitting event:", error);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            {isEditMode ? "Edit Event" : "Create Event"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event title" {...field} data-testid="input-title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., March 15, 2024" {...field} data-testid="input-date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 7:00 PM - 9:00 PM" {...field} value={field.value || ""} data-testid="input-time" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter location" {...field} data-testid="input-location" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter event description"
                      rows={4}
                      {...field}
                      value={field.value || ""}
                      data-testid="textarea-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Event Images (Optional)</FormLabel>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="event-images"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  data-testid="input-images"
                />
                <label
                  htmlFor="event-images"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <ImagePlus className="w-12 h-12 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload images or drag and drop
                  </span>
                  <span className="text-xs text-muted-foreground">
                    PNG, JPG, GIF up to 5MB each
                  </span>
                </label>
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        data-testid={`button-remove-image-${index}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="isRecurring"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      data-testid="checkbox-recurring"
                    />
                  </FormControl>
                  <FormLabel className="cursor-pointer">
                    Recurring Event
                  </FormLabel>
                </FormItem>
              )}
            />

            {form.watch("isRecurring") && (
              <FormField
                control={form.control}
                name="recurrencePattern"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recurrence Pattern</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger data-testid="select-pattern">
                          <SelectValue placeholder="Select pattern" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="weekly_monday">Every Monday</SelectItem>
                        <SelectItem value="weekly_tuesday">Every Tuesday</SelectItem>
                        <SelectItem value="weekly_wednesday">Every Wednesday</SelectItem>
                        <SelectItem value="weekly_thursday">Every Thursday</SelectItem>
                        <SelectItem value="weekly_friday">Every Friday</SelectItem>
                        <SelectItem value="weekly_saturday">Every Saturday</SelectItem>
                        <SelectItem value="weekly_sunday">Every Sunday</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="participants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Participants</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 18" {...field} value={field.value || ""} data-testid="input-participants" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rounds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rounds</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 5" {...field} value={field.value || ""} data-testid="input-rounds" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., USCF" {...field} value={field.value || ""} data-testid="input-rating" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>Winners (Optional)</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ place: "", name: "", score: "" })}
                  data-testid="button-add-winner"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Winner
                </Button>
              </div>

              {fields.length > 0 && (
                <div className="space-y-3 border rounded-lg p-4 bg-secondary/20">
                  {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-[1fr_2fr_1fr_auto] gap-2">
                      <FormField
                        control={form.control}
                        name={`winners.${index}.place`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Place</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="1st"
                                {...field}
                                data-testid={`input-winner-${index}-place`}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`winners.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Winner name"
                                {...field}
                                data-testid={`input-winner-${index}-name`}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`winners.${index}.score`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Score</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="5.0"
                                {...field}
                                value={field.value || ""}
                                data-testid={`input-winner-${index}-score`}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormItem>
                        <FormLabel className="text-xs opacity-0">Remove</FormLabel>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                          className="h-10"
                          data-testid={`button-remove-winner-${index}`}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </FormItem>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4 border-t pt-4">
              <FormLabel className="text-lg font-semibold">Custom Links (Optional)</FormLabel>
              <p className="text-sm text-muted-foreground">Add clickable links to your event</p>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="registrationLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/register"
                            {...field}
                            value={field.value || ""}
                            data-testid="input-registration-link"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="registrationLinkLabel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Label</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Register Here"
                            {...field}
                            value={field.value || ""}
                            data-testid="input-registration-label"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="infoLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Information URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/info"
                            {...field}
                            value={field.value || ""}
                            data-testid="input-info-link"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="infoLinkLabel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Label</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="More Info"
                            {...field}
                            value={field.value || ""}
                            data-testid="input-info-label"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="externalLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>External Resource URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/resource"
                            {...field}
                            value={field.value || ""}
                            data-testid="input-external-link"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="externalLinkLabel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Label</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="View Resource"
                            {...field}
                            value={field.value || ""}
                            data-testid="input-external-label"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isPending} data-testid="button-submit">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Event" : "Create Event")}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
