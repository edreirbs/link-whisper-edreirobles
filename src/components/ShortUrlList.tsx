
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ShortenedUrl } from "@/types/url";
import { deleteShortenedUrl, getFullShortenedUrl, getDisplayShortenedUrl } from "@/utils/urlService";
import { Link2, Clipboard, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

interface ShortUrlListProps {
  urls: ShortenedUrl[];
  onUrlDeleted: () => void;
}

const ShortUrlList = ({ urls, onUrlDeleted }: ShortUrlListProps) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyUrl = (alias: string) => {
    // Copy the full URL that will actually work
    const fullUrl = getFullShortenedUrl(alias);
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopiedId(alias);
      toast.success("¡URL copiada al portapapeles!");
      
      // Restablecer el estado de copiado después de 2 segundos
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    }).catch(() => {
      toast.error("Error al copiar la URL");
    });
  };

  const handleDeleteUrl = (id: string) => {
    deleteShortenedUrl(id);
    toast.success("URL eliminada correctamente");
    onUrlDeleted();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  if (urls.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Link2 className="mx-auto mb-2 h-12 w-12 text-linkWhisper-blue opacity-50" />
        <p>No hay URLs acortadas todavía. ¡Crea tu primera URL arriba!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Tus URLs Acortadas</h2>
      {urls.map((url) => (
        <Card key={url.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-linkWhisper-blue">{url.alias}</h3>
                  <p className="text-sm text-muted-foreground truncate max-w-xs md:max-w-md">
                    {url.originalUrl}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Creada el {formatDate(url.createdAt)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyUrl(url.alias)}
                    className={copiedId === url.alias ? "bg-green-50 border-green-200 text-green-600" : ""}
                  >
                    {copiedId === url.alias ? (
                      "¡Copiado!"
                    ) : (
                      <>
                        <Clipboard className="h-4 w-4 mr-1" />
                        Copiar
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteUrl(url.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t text-sm flex">
                <Link
                  to={`/${url.alias}`}
                  className="text-linkWhisper-teal hover:underline truncate flex items-center"
                >
                  <Link2 className="h-3 w-3 mr-1 inline" />
                  {getDisplayShortenedUrl(url.alias)}
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ShortUrlList;
