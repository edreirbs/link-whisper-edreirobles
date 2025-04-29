import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  aliasExists, 
  generateId, 
  isValidUrl, 
  saveShortenedUrl, 
  generateShortAlias 
} from "@/utils/urlService";
import { ShortenedUrl, UrlFormData } from "@/types/url";

interface UrlShortenerFormProps {
  onUrlCreated: () => void;
}

const UrlShortenerForm = ({ onUrlCreated }: UrlShortenerFormProps) => {
  const [formData, setFormData] = useState<UrlFormData>({ originalUrl: "", alias: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestedAlias, setSuggestedAlias] = useState("");

  // Generate a suggested alias on component mount
  useEffect(() => {
    generateUniqueAlias();
  }, []);

  // Generate a unique alias that doesn't already exist
  const generateUniqueAlias = () => {
    let alias = generateShortAlias();
    
    // Keep generating until we find an unused alias
    while (aliasExists(alias)) {
      alias = generateShortAlias();
    }
    
    setSuggestedAlias(alias);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.originalUrl.trim()) {
      newErrors.originalUrl = "URL is required";
    } else if (!isValidUrl(formData.originalUrl)) {
      newErrors.originalUrl = "Please enter a valid URL (including http:// or https://)";
    }

    // If no alias provided, use the suggested one
    const aliasToUse = formData.alias.trim() || suggestedAlias;
    
    if (!aliasToUse) {
      newErrors.alias = "Alias is required";
    } else if (!/^[a-zA-Z0-9-_]+$/.test(aliasToUse)) {
      newErrors.alias = "Alias can only contain letters, numbers, hyphens, and underscores";
    } else if (aliasExists(aliasToUse)) {
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
      // Use the provided alias or the suggested one if empty
      const aliasToUse = formData.alias.trim() || suggestedAlias;
      
      const newUrl: ShortenedUrl = {
        id: generateId(),
        originalUrl: formData.originalUrl,
        alias: aliasToUse,
        createdAt: Date.now()
      };

      saveShortenedUrl(newUrl);
      toast.success("URL shortened successfully!");
      
      // Reset form
      setFormData({ originalUrl: "", alias: "" });
      // Generate a new suggested alias for the next URL
      generateUniqueAlias();
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
        <div className="flex space-x-2">
          <Input
            id="alias"
            name="alias"
            placeholder={suggestedAlias}
            value={formData.alias}
            onChange={handleChange}
            className={errors.alias ? "border-red-500" : ""}
          />
          <Button 
            type="button" 
            variant="outline"
            onClick={generateUniqueAlias}
            className="shrink-0"
          >
            Refresh
          </Button>
        </div>
        {errors.alias && (
          <p className="text-red-500 text-sm mt-1">{errors.alias}</p>
        )}
        <p className="text-sm text-muted-foreground">
          Leave empty to use the suggested short alias or enter your own custom alias
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
