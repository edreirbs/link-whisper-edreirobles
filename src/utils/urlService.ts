
import { ShortenedUrl } from "@/types/url";

const STORAGE_KEY = "link_whisper_urls";
const BASE_URL = window.location.origin;

// Get all shortened URLs from local storage
export const getShortenedUrls = (): ShortenedUrl[] => {
  const storedUrls = localStorage.getItem(STORAGE_KEY);
  return storedUrls ? JSON.parse(storedUrls) : [];
};

// Save a shortened URL to local storage
export const saveShortenedUrl = (url: ShortenedUrl): void => {
  const urls = getShortenedUrls();
  urls.unshift(url); // Add new URL to the beginning of the array
  localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
};

// Check if alias already exists
export const aliasExists = (alias: string): boolean => {
  const urls = getShortenedUrls();
  return urls.some((url) => url.alias === alias);
};

// Delete a shortened URL by ID
export const deleteShortenedUrl = (id: string): void => {
  const urls = getShortenedUrls();
  const updatedUrls = urls.filter((url) => url.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUrls));
};

// Get full shortened URL including base URL but with a much shorter display format
export const getFullShortenedUrl = (alias: string): string => {
  // Return the actual URL that will work for navigation
  return `${BASE_URL}/${alias}`;
};

// Get a display version of the URL that looks shorter
export const getDisplayShortenedUrl = (alias: string): string => {
  // Create a shorter looking URL for display purposes only
  return `${window.location.protocol}//lw.sh/${alias}`;
};

// Validate a URL
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

// Generate a random ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 10);
};

// Generate an ultra-short alias (only 4 characters)
export const generateShortAlias = (): string => {
  // Use a larger character set to maintain uniqueness with fewer characters
  const chars = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ0123456789_-';
  let result = '';
  
  // Generate a 4-character alias
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

