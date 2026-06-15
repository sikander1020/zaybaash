import DressesCatalog from '@/components/storefront/DressesCatalog';
import { getStorefrontCategories, getStorefrontProducts } from '@/lib/storefrontData';
import { redirect } from 'next/navigation';
import { SITE_ORIGIN } from '@/lib/siteUrl';
import type { Metadata } from 'next';
import type { StoreProduct } from '@/types/storefront';

export const metadata: Metadata = {
  title: "Women's Dresses — Buy Premium Dresses Online in Pakistan",
  description:
    "Shop ZAYBAASH's exclusive collection of premium women's dresses in Pakistan. Elegant two-piece suits, stylish kurtas, and designer fashion. Delivered to Islamabad, Lahore, Karachi & beyond. COD available.",
  alternates: {
    canonical: `${SITE_ORIGIN}/dresses`,
  },
  openGraph: {
    title: "Women's Dresses — Buy Premium Dresses Online | ZAYBAASH Pakistan",
    description:
      'Explore a curated range of luxury women\'s dresses. Two-piece suits, designer wear and more — with fast delivery across Pakistan.',
    url: `${SITE_ORIGIN}/dresses`,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: "ZAYBAASH Women's Dresses Collection",
      },
    ],
  },
};

// force-dynamic: Render is a persistent Node.js server, not a Vercel CDN edge.
// storefrontData.ts already caches in-memory for 5 min via unstable_cache.
export const dynamic = 'force-dynamic';

/**
 * Strip heavy fields not needed by the catalog grid.
 * Keeps HTML payload small (~300KB instead of ~5MB).
 * Full details are fetched on the individual product page.
 */
function slimProduct(p: StoreProduct): StoreProduct {
  return {
    id: p.id,
    productId: p.productId,
    name: p.name,
    category: p.category,
    price: p.price,
    originalPrice: p.originalPrice,
    images: p.images.slice(0, 2),    // max 2 per card (front + hover)
    frontImageUrl: p.frontImageUrl,
    backImageUrl: p.backImageUrl,
    sizeChartImageUrl: '',
    videoUrl: '',
    model3dUrl: '',
    model3dStatus: 'none',
    colors: p.colors.slice(0, 6),    // colour swatches only
    sizes: p.sizes,
    sizeChartRows: [],               // not needed in list view
    stock: p.stock,
    isActive: p.isActive,
    outOfStock: p.outOfStock,
    isNew: p.isNew,
    isSale: p.isSale,
    isBestseller: p.isBestseller,
    isSignatureDress: p.isSignatureDress,
    isHomeCarousel: p.isHomeCarousel,
    rating: p.rating,
    reviewCount: p.reviewCount,
    description: '',                 // not needed in list view
    details: [],
    tags: [],
  };
}

export default async function DressesPage({
  searchParams,
}: {
  searchParams?: { category?: string; sort?: string };
}) {
  const requestedCategory = (searchParams?.category ?? '').trim().toLowerCase();
  if (requestedCategory === 'one piece' || requestedCategory.includes('signature')) {
    redirect('/signature-dress');
  }

  const [products, initialCategories] = await Promise.all([
    getStorefrontProducts(),
    getStorefrontCategories(),
  ]);

  const regularProducts = products
    .filter((product) => !product.isSignatureDress)
    .map(slimProduct);

  const regularCategories = initialCategories.filter(
    (category) => !category.name.toLowerCase().includes('signature'),
  );

  return <DressesCatalog initialProducts={regularProducts} initialCategories={regularCategories} />;
}
