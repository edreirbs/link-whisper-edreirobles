
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

  // Generar un alias sugerido al montar el componente
  useEffect(() => {
    generateUniqueAlias();
  }, []);

  // Generar un alias único que no exista aún
  const generateUniqueAlias = () => {
    let alias = generateShortAlias();
    
    // Seguir generando hasta encontrar un alias no utilizado
    while (aliasExists(alias)) {
      alias = generateShortAlias();
    }
    
    setSuggestedAlias(alias);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.originalUrl.trim()) {
      newErrors.originalUrl = "La URL es obligatoria";
    } else if (!isValidUrl(formData.originalUrl)) {
      newErrors.originalUrl = "Por favor, ingresa una URL válida (incluyendo http:// o https://)";
    }

    // Si no se proporciona un alias, usar el sugerido
    const aliasToUse = formData.alias.trim() || suggestedAlias;
    
    if (!aliasToUse) {
      newErrors.alias = "El alias es obligatorio";
    } else if (!/^[a-zA-Z0-9-_]+$/.test(aliasToUse)) {
      newErrors.alias = "El alias solo puede contener letras, números, guiones y guiones bajos";
    } else if (aliasExists(aliasToUse)) {
      newErrors.alias = "Este alias ya está en uso";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Limpiar el error para este campo cuando el usuario comienza a escribir
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
      // Usar el alias proporcionado o el sugerido si está vacío
      const aliasToUse = formData.alias.trim() || suggestedAlias;
      
      const newUrl: ShortenedUrl = {
        id: generateId(),
        originalUrl: formData.originalUrl,
        alias: aliasToUse,
        createdAt: Date.now()
      };

      saveShortenedUrl(newUrl);
      toast.success("¡URL acortada correctamente!");
      
      // Restablecer formulario
      setFormData({ originalUrl: "", alias: "" });
      // Generar un nuevo alias sugerido para la próxima URL
      generateUniqueAlias();
      onUrlCreated();
    } catch (error) {
      toast.error("Ocurrió un error al acortar la URL");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="originalUrl">URL Original</Label>
        <Input
          id="originalUrl"
          name="originalUrl"
          placeholder="https://ejemplo.com/url/muy/larga/que/necesita/acortarse"
          value={formData.originalUrl}
          onChange={handleChange}
          className={errors.originalUrl ? "border-red-500" : ""}
        />
        {errors.originalUrl && (
          <p className="text-red-500 text-sm mt-1">{errors.originalUrl}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="alias">Alias Personalizado</Label>
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
            Actualizar
          </Button>
        </div>
        {errors.alias && (
          <p className="text-red-500 text-sm mt-1">{errors.alias}</p>
        )}
        <p className="text-sm text-muted-foreground">
          Deja vacío para usar el alias corto sugerido o ingresa tu propio alias personalizado
        </p>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-linkWhisper-blue hover:bg-linkWhisper-darkBlue"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creando..." : "Crear URL Corta"}
      </Button>
    </form>
  );
};

export default UrlShortenerForm;
