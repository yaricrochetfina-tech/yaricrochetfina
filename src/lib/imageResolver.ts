// Helper to resolve image paths from database to actual asset URLs
// Images in src/assets/ need to be imported as ES6 modules in Vite

// Import all product images using Vite's glob import with multiple patterns
const productImagesAbsolute = import.meta.glob('/src/assets/*.{jpg,jpeg,png,webp}', { eager: true, as: 'url' });
const productImagesRelative = import.meta.glob('../assets/*.{jpg,jpeg,png,webp}', { eager: true, as: 'url' });

// Merge both sets of imports and normalize keys
const productImages: Record<string, string> = {};

// Add absolute paths
for (const [key, value] of Object.entries(productImagesAbsolute)) {
  productImages[key] = value;
}

// Add relative paths with normalized key
for (const [key, value] of Object.entries(productImagesRelative)) {
  // Convert ../assets/filename.ext to /src/assets/filename.ext
  const normalizedKey = key.replace('../assets/', '/src/assets/');
  productImages[normalizedKey] = value;
}

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
  
  // If it starts with data: (base64), return as-is
  if (dbPath.startsWith('data:')) {
    return dbPath;
  }
  
  // If it's a /images/products/ path (public folder), return as-is
  if (dbPath.startsWith('/images/')) {
    return dbPath;
  }
  
  // Normalize the path
  let normalizedPath = dbPath;
  if (!normalizedPath.startsWith('/')) {
    normalizedPath = '/' + normalizedPath;
  }
  if (!normalizedPath.startsWith('/src/assets/') && normalizedPath.includes('assets/')) {
    normalizedPath = '/src/assets/' + normalizedPath.split('assets/').pop();
  }
  
  // Handle /src/assets/ paths - look up in imported modules
  if (productImages[normalizedPath]) {
    return productImages[normalizedPath];
  }
  
  // Try extracting just the filename and rebuilding path
  const filename = normalizedPath.split('/').pop();
  if (filename) {
    const tryPath = `/src/assets/${filename}`;
    if (productImages[tryPath]) {
      return productImages[tryPath];
    }
  }
  
  // Debug: log available keys for troubleshooting
  console.warn(`Image not found: ${dbPath}. Available images:`, Object.keys(productImages).slice(0, 5));
  
  // Fallback - return placeholder
  return '/placeholder.svg';
}
