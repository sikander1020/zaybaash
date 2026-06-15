/**
 * imageUrl.ts — Cloudinary URL transformer
 *
 * Transforms raw Cloudinary upload URLs to add auto-compression.
 * Example: a 2.5MB PNG becomes ~120KB WebP served by Cloudinary's CDN.
 *
 * Raw:       https://res.cloudinary.com/xxx/image/upload/v1/zaybaash/admin-uploads/abc.png
 * Optimised: https://res.cloudinary.com/xxx/image/upload/f_webp,q_auto:good,w_1200,c_limit/v1/zaybaash/admin-uploads/abc.png
 */

const CLOUDINARY_TRANSFORM_CARD = 'f_webp,q_auto:good,w_800,c_limit';
const CLOUDINARY_TRANSFORM_HERO = 'f_webp,q_auto:good,w_1200,c_limit';
const CLOUDINARY_TRANSFORM_THUMB = 'f_webp,q_auto:eco,w_400,c_limit';

/**
 * Inject Cloudinary transform params into an existing upload URL.
 * Works for res.cloudinary.com URLs only. Returns the original URL untouched
 * for Unsplash and other CDNs (they handle their own optimisation).
 */
export function optimiseCloudinaryUrl(
  url: string,
  size: 'thumb' | 'card' | 'hero' = 'card',
): string {
  if (!url) return url;

  // Only transform Cloudinary URLs
  if (!url.includes('res.cloudinary.com') && !url.includes('.cloudinary.com')) {
    return url;
  }

  // Already has a transform segment — don't double-transform
  if (url.includes('/f_') || url.includes('/q_') || url.includes('/w_')) {
    return url;
  }

  const transform =
    size === 'hero'  ? CLOUDINARY_TRANSFORM_HERO  :
    size === 'thumb' ? CLOUDINARY_TRANSFORM_THUMB :
                       CLOUDINARY_TRANSFORM_CARD;

  // Insert after /upload/ (with or without a version segment like /v123456789/)
  return url.replace(
    /\/upload\//,
    `/upload/${transform}/`,
  );
}

/**
 * Optimise all images in a product's images array.
 * Returns a new array — never mutates the original.
 */
export function optimiseProductImages(
  images: string[],
  size: 'thumb' | 'card' | 'hero' = 'card',
): string[] {
  return images.map((url) => optimiseCloudinaryUrl(url, size));
}
