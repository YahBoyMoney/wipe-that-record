import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '../../../../payload.config';

export async function POST() {
  try {
    const payload = await getPayload({ config });

    // Your 3 main products
    const products = [
      {
        name: 'DIY Self Expunge Kit',
        slug: 'diy-self-expunge-kit',
        description: 'Complete do-it-yourself expungement kit with all necessary forms, step-by-step instructions, and legal guidance. Perfect for those who want to handle their own expungement process.',
        shortDescription: 'DIY expungement kit with forms and instructions',
        price: 99,
        originalPrice: 149,
        category: 'DIY Services',
        serviceType: 'digital',
        status: 'active',
        featured: true,
        popular: false,
        bestValue: false,
        inventory: {
          trackInventory: false,
          quantity: 999,
          lowStockThreshold: 10,
          allowBackorders: true,
        },
        analytics: {
          views: 1247,
          totalSales: 284,
          revenue: 28116,
          conversionRate: 22.8,
          averageRating: 4.6,
          totalReviews: 142,
        },
      },
      {
        name: 'Professionally Filled & Filed Service',
        slug: 'professionally-filled-filed-service',
        description: 'Our legal experts professionally fill out all your expungement paperwork and you file it yourself. Includes form completion, document review, and filing instructions.',
        shortDescription: 'Professional form completion and filing guidance',
        price: 299,
        originalPrice: 399,
        category: 'Professional Services',
        serviceType: 'service',
        status: 'active',
        featured: true,
        popular: true,
        bestValue: false,
        inventory: {
          trackInventory: false,
          quantity: 999,
          lowStockThreshold: 5,
          allowBackorders: true,
        },
        analytics: {
          views: 892,
          totalSales: 156,
          revenue: 46644,
          conversionRate: 17.5,
          averageRating: 4.8,
          totalReviews: 89,
        },
      },
      {
        name: 'Full Attorney Service',
        slug: 'full-attorney-service',
        description: 'Complete attorney-managed expungement service. Our experienced lawyers handle everything from start to finish including court representation and legal advocacy.',
        shortDescription: 'Complete attorney-managed expungement service',
        price: 1500,
        originalPrice: 2000,
        category: 'Legal Services',
        serviceType: 'legal',
        status: 'active',
        featured: true,
        popular: false,
        bestValue: true,
        inventory: {
          trackInventory: false,
          quantity: 999,
          lowStockThreshold: 2,
          allowBackorders: false,
        },
        analytics: {
          views: 543,
          totalSales: 67,
          revenue: 100500,
          conversionRate: 12.3,
          averageRating: 4.9,
          totalReviews: 34,
        },
      },
    ];

    const createdProducts = [];

    for (const productData of products) {
      try {
        // Check if product already exists
        const existing = await payload.find({
          collection: 'products',
          where: {
            slug: {
              equals: productData.slug,
            },
          },
        });

        if (existing.docs.length === 0) {
          // Create new product
          const newProduct = await payload.create({
            collection: 'products',
            data: productData,
          });
          createdProducts.push(newProduct);
          console.log(`Created product: ${productData.name}`);
        } else {
          // Update existing product
          const updatedProduct = await payload.update({
            collection: 'products',
            id: existing.docs[0].id,
            data: productData,
          });
          createdProducts.push(updatedProduct);
          console.log(`Updated product: ${productData.name}`);
        }
      } catch (error) {
        console.error(`Error creating/updating product ${productData.name}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully initialized ${createdProducts.length} products`,
      data: createdProducts,
    });

  } catch (error) {
    console.error('Products initialization error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to initialize products',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}