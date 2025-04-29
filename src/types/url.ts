
export interface ShortenedUrl {
  id: string;
  originalUrl: string;
  alias: string;
  createdAt: number;
}

export interface UrlFormData {
  originalUrl: string;
  alias: string;
}
