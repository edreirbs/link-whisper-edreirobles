
import { useState, useEffect } from "react";
import { getShortenedUrls } from "@/utils/urlService";
import UrlShortenerForm from "@/components/UrlShortenerForm";
import ShortUrlList from "@/components/ShortUrlList";
import { ShortenedUrl } from "@/types/url";
import { Link2 } from "lucide-react";

const Index = () => {
  const [urls, setUrls] = useState<ShortenedUrl[]>([]);

  const loadUrls = () => {
    const storedUrls = getShortenedUrls();
    setUrls(storedUrls);
  };

  useEffect(() => {
    loadUrls();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto py-6 px-4">
          <div className="flex items-center justify-center">
            <Link2 className="h-8 w-8 text-linkWhisper-blue mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Link<span className="text-linkWhisper-blue">Whisper</span></h1>
          </div>
          <p className="text-center text-gray-500 mt-2">Create personalized short links in seconds</p>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
            <h2 className="text-xl font-semibold mb-4">Shorten a URL</h2>
            <UrlShortenerForm onUrlCreated={loadUrls} />
          </div>
          
          <ShortUrlList urls={urls} onUrlDeleted={loadUrls} />
        </div>
      </main>
      
      <footer className="bg-white border-t mt-auto">
        <div className="container mx-auto py-6 px-4">
          <p className="text-center text-gray-500 text-sm">
            LinkWhisper - Create and manage your shortened URLs with ease
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
