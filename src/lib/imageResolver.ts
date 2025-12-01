// Helper to resolve image paths from database to actual asset URLs
// Images in src/assets/ need to be imported as ES6 modules in Vite

// Import all product images using Vite's glob import
const productImages = import.meta.glob('/src/assets/*.{jpg,jpeg,png,webp}', { eager: true, as: 'url' });

/**
 * Resolves a database image path to an actual URL that works in the browser
 * Database stores paths like: /src/assets/blusa-boho-multicolor.png
 * This function returns the correct bundled asset URL
 */
export function resolveProductImage(dbPath: string): string {
  if (!dbPath) return '/placeholder.svg';
  
  // If it's already a full URL (http/https), return as-is
  if (dbPath.startsWith('http://') || dbPath.startsWith('https://')) {
    return dbPath;
  }
  
  // If it's a /images/products/ path (public folder), return as-is
  if (dbPath.startsWith('/images/')) {
    return dbPath;
  }
  
  // Handle /src/assets/ paths - look up in imported modules
  if (dbPath.startsWith('/src/assets/')) {
    const resolved = productImages[dbPath];
    if (resolved) {
      return resolved;
    }
  }
  
  // Try without leading slash
  const pathWithSlash = dbPath.startsWith('/') ? dbPath : `/${dbPath}`;
  const resolved = productImages[pathWithSlash];
  if (resolved) {
    return resolved;
  }
  
  // Fallback - return as-is and let browser handle it
  return dbPath;
}
