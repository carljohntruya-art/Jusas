export const sanitizeImageUrl = (url: string | null | undefined): string => {
  if (!url) return '/placeholder-smoothie.jpg';
  
  // Remove any common corruption characters like newline, carriage return, 
  // or invisible characters that often sneak in during copy-paste or DB migrations
  let sanitized = url.trim().replace(/[\n\r]/g, '');
  
  // Ensure it's a valid URL or a local path
  try {
    if (sanitized.startsWith('http')) {
      new URL(sanitized);
      return sanitized;
    }
    return sanitized;
  } catch (e) {
    console.warn('Invalid image URL detected:', sanitized);
    return '/placeholder-smoothie.jpg';
  }
};

export const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1546173159-315724a93c90?q=80&w=800&auto=format&fit=crop';
