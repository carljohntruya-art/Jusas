export const sanitizeImageUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  return url.trim().replace(/[\n\r]/g, '');
};
