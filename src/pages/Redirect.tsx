
import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { getShortenedUrls } from "@/utils/urlService";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const Redirect = () => {
  const { alias } = useParams<{ alias: string }>();
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!alias) {
      setError("Alias inválido");
      return;
    }

    console.log("Buscando alias:", alias);
    const urls = getShortenedUrls();
    const urlData = urls.find((url) => url.alias === alias);

    if (urlData) {
      // Found the URL, set it for redirection
      setRedirectUrl(urlData.originalUrl);
      console.log("URL encontrada para redirección:", urlData.originalUrl);
    } else {
      console.log("No se encontró URL para el alias:", alias);
      setError("URL no encontrada");
    }
  }, [alias]);

  useEffect(() => {
    if (redirectUrl) {
      // Give a small delay to show the loading state
      const timer = setTimeout(() => {
        // Ensure the URL has the proper protocol
        let finalUrl = redirectUrl;
        if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
          finalUrl = 'https://' + finalUrl;
        }
        
        console.log("Redireccionando a:", finalUrl);
        window.location.href = finalUrl;
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [redirectUrl]);

  if (error) {
    toast.error("URL no encontrada");
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-linkWhisper-blue" />
      <p className="mt-4 text-lg">Redireccionando...</p>
    </div>
  );
};

export default Redirect;
