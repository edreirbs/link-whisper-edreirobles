
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { aliasExists, generateId, isValidUrl, saveShortenedUrl } from "@/utils/urlService";
import { ShortenedUrl, UrlFormData } from "@/types/url";

interface UrlShortenerFormProps {
  onUrlCreated: () => void;
}

const UrlShortenerForm = ({ onUrlCreated }: UrlShortenerFormProps) => {
  const [formData, setFormData] = useState<UrlFormData>({ originalUrl: "", alias: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.originalUrl.trim()) {
      newErrors.originalUrl = "URL is required";
    } else if (!isValidUrl(formData.originalUrl)) {
      newErrors.originalUrl = "Please enter a valid URL (including http:// or https://)";
    }

    if (!formData.alias.trim()) {
      newErrors.alias = "Alias is required";
    } else if (!/^[a-zA-Z0-9-_]+$/.test(formData.alias)) {
      newErrors.alias = "Alias can only contain letters, numbers, hyphens, and underscores";
    } else if (aliasExists(formData.alias)) {
      newErrors.alias = "This alias is already in use";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear the error for this field when the user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const newUrl: ShortenedUrl = {
        id: generateId(),
        originalUrl: formData.originalUrl,
        alias: formData.alias,
        createdAt: Date.now()
      };

      saveShortenedUrl(newUrl);
      toast.success("URL shortened successfully!");
      
      // Reset form
      setFormData({ originalUrl: "", alias: "" });
      onUrlCreated();
    } catch (error) {
      toast.error("An error occurred while shortening the URL");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="originalUrl">Original URL</Label>
        <Input
          id="originalUrl"
          name="originalUrl"
          placeholder="https://example.com/very/long/url/that/needs/shortening"
          value={formData.originalUrl}
          onChange={handleChange}
          className={errors.originalUrl ? "border-red-500" : ""}
        />
        {errors.originalUrl && (
          <p className="text-red-500 text-sm mt-1">{errors.originalUrl}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="alias">Custom Alias</Label>
        <Input
          id="alias"
          name="alias"
          placeholder="my-custom-link"
          value={formData.alias}
          onChange={handleChange}
          className={errors.alias ? "border-red-500" : ""}
        />
        {errors.alias && (
          <p className="text-red-500 text-sm mt-1">{errors.alias}</p>
        )}
        <p className="text-sm text-muted-foreground">
          Choose a memorable name for your shortened URL
        </p>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-linkWhisper-blue hover:bg-linkWhisper-darkBlue"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating..." : "Create Short URL"}
      </Button>
    </form>
  );
};

export default UrlShortenerForm;
