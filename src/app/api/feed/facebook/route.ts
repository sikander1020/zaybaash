import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { optimiseCloudinaryUrl } from '@/lib/imageUrl';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.zaybaash.com';

function escapeCsv(field: string | number | undefined | null): string {
  if (field === null || field === undefined) return '';
  const str = String(field).replace(/"/g, '""'); // Escape quotes
  // If it has commas, quotes, or newlines, wrap in quotes
  if (str.search(/("|,|\n|\r)/g) >= 0) {
    return `"${str}"`;
  }
  return str;
}

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({ isActive: { $ne: false } }).lean();

    const headers = [
      'id',
      'title',
      'description',
      'availability',
      'condition',
      'price',
      'link',
      'image_link',
      'brand',
      'inventory',
      'google_product_category',
      'item_group_id',
    ];

    const rows = [headers.join(',')];

    for (const p of products) {
      const resolvedId = typeof p.productId === 'string' && p.productId.trim().length > 0
        ? p.productId.trim()
        : String(p._id ?? '').trim();

      const rawImages = Array.isArray(p.images) && p.images.length > 0 ? p.images.filter((u: string) => Boolean(u) && !u.startsWith('data:image')) : [];
      let primaryImage = rawImages[0] || 'https://images.unsplash.com/photo-1594938298603-c8148c4b69c8?w=800&q=80';
      if (typeof p.frontImageUrl === 'string' && p.frontImageUrl && !p.frontImageUrl.startsWith('data:image')) {
        primaryImage = p.frontImageUrl;
      }
      const imageLink = optimiseCloudinaryUrl(primaryImage, 'hero');

      const title = p.name || 'ZAYBAASH Dress';
      const description = p.description || title;
      const availability = p.outOfStock ? 'out of stock' : 'in stock';
      const price = `${p.price} PKR`;
      const link = `${SITE_URL}/product/${resolvedId}`;
      const brand = 'ZAYBAASH';
      const inventory = p.stock || 0;
      const googleProductCategory = 'Apparel & Accessories > Clothing > Dresses'; // Standard taxonomy
      const itemGroupId = String(p.category || 'dresses').trim();

      const row = [
        escapeCsv(resolvedId),
        escapeCsv(title),
        escapeCsv(description),
        escapeCsv(availability),
        escapeCsv('new'), // Condition is always new
        escapeCsv(price),
        escapeCsv(link),
        escapeCsv(imageLink),
        escapeCsv(brand),
        escapeCsv(inventory),
        escapeCsv(googleProductCategory),
        escapeCsv(itemGroupId),
      ];

      rows.push(row.join(','));
    }

    const csvData = rows.join('\n');

    return new NextResponse(csvData, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="zaybaash-facebook-catalog.csv"',
        // Cache the feed for 1 hour at the edge
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('Error generating Facebook catalog feed:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
