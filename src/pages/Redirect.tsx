
import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { getShortenedUrls } from "@/utils/urlService";
import { Loader2 } from "lucide-react";

const Redirect = () => {
  const { alias } = useParams<{ alias: string }>();
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!alias) {
      setError("Alias inválido");
      return;
    }

    const urls = getShortenedUrls();
    const urlData = urls.find((url) => url.alias === alias);

    if (urlData) {
      setRedirectUrl(urlData.originalUrl);
    } else {
      setError("URL no encontrada");
    }
  }, [alias]);

  useEffect(() => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  }, [redirectUrl]);

  if (error) {
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
