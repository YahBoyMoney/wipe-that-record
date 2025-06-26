import { getPayload } from 'payload';
import config from '../../payload.config';

export async function initializeSampleData() {
  try {
    const payload = await getPayload({ config });

    console.log('🚀 Initializing WipeThatRecord E-Commerce System...');

    // Sample products for WipeThatRecord
    const sampleProducts = [
      {
        name: 'DIY Expungement Kit',
        slug: 'diy-expungement-kit',
        description: 'Complete do-it-yourself expungement package with all forms and instructions for California record clearing',
        shortDescription: 'Complete DIY expungement package with forms, instructions, and support',
        price: 97,
        category: 'diy',
        serviceType: 'digital',
        status: 'active',
        featured: true,
        stock: 999,
        trackInventory: false,
        convictionTypes: [
          { type: 'misdemeanor' },
          { type: 'felony' },
          { type: 'DUI' }
        ],
        processingTime: 'Immediate download',
        includedServices: 'All required forms, step-by-step instructions, video tutorials, email support',
        requirements: [
          { requirement: 'Copy of conviction record' },
          { requirement: 'Valid California ID' }
        ],
        seo: {
          title: 'DIY Expungement Kit - California Record Clearing',
          description: 'Complete do-it-yourself expungement kit for California. Clear your record with our comprehensive package.',
          keywords: 'california expungement, diy expungement, record clearing, criminal record'
        },
        totalSales: 145,
        totalRevenue: 14065
      },
      {
        name: 'Expert Document Review',
        slug: 'expert-document-review',
        description: 'Professional attorney review of your expungement documents before filing',
        shortDescription: 'Professional attorney review of your expungement documents',
        price: 197,
        category: 'review',
        serviceType: 'service',
        status: 'active',
        featured: true,
        stock: 50,
        trackInventory: true,
        lowStockThreshold: 10,
        convictionTypes: [
          { type: 'misdemeanor' },
          { type: 'felony' },
          { type: 'DUI' },
          { type: 'theft' }
        ],
        processingTime: '2-3 business days',
        includedServices: 'Attorney document review, corrections, filing guidance, email consultation',
        requirements: [
          { requirement: 'Completed expungement forms' },
          { requirement: 'Case documentation' }
        ],
        totalSales: 89,
        totalRevenue: 17533
      },
      {
        name: 'Full Service Expungement',
        slug: 'full-service-expungement',
        description: 'Complete expungement service handled by our legal team from start to finish',
        shortDescription: 'Complete expungement service handled by our legal team',
        price: 1497,
        category: 'full-service',
        serviceType: 'service',
        status: 'active',
        featured: true,
        stock: 20,
        trackInventory: true,
        lowStockThreshold: 5,
        convictionTypes: [
          { type: 'misdemeanor' },
          { type: 'felony' },
          { type: 'DUI' },
          { type: 'theft' },
          { type: 'domestic-violence' }
        ],
        processingTime: '30-45 days',
        includedServices: 'Complete case handling, court filings, attorney representation, success guarantee',
        requirements: [
          { requirement: 'Copy of conviction record' },
          { requirement: 'Valid identification' },
          { requirement: 'Case details and documentation' }
        ],
        totalSales: 34,
        totalRevenue: 50898
      },
      {
        name: 'Legal Consultation (30 min)',
        slug: 'legal-consultation',
        description: '30-minute consultation with expungement attorney to discuss your case',
        shortDescription: '30-minute consultation with expungement attorney',
        price: 147,
        category: 'consultation',
        serviceType: 'consultation',
        status: 'active',
        stock: 25,
        trackInventory: true,
        lowStockThreshold: 5,
        processingTime: 'Scheduled within 48 hours',
        includedServices: 'Phone/video consultation, case assessment, personalized advice',
        requirements: [
          { requirement: 'Case summary prepared' },
          { requirement: 'Available for scheduled call' }
        ],
        totalSales: 67,
        totalRevenue: 9849
      },
      {
        name: 'Rush Processing (7 days)',
        slug: 'rush-processing',
        description: 'Expedited expungement processing completed in 7 business days',
        shortDescription: 'Expedited expungement processing in 7 business days',
        price: 297,
        category: 'rush',
        serviceType: 'addon',
        status: 'active',
        stock: 3,
        trackInventory: true,
        lowStockThreshold: 3,
        processingTime: '7 business days',
        includedServices: 'Priority processing, dedicated case manager, expedited court filings',
        requirements: [
          { requirement: 'Existing service order' },
          { requirement: 'All documentation ready' }
        ],
        totalSales: 23,
        totalRevenue: 6831
      }
    ];

    // Create products and store their IDs
    const createdProducts: any = {};
    for (const productData of sampleProducts) {
      try {
        const product =       await payload.create({
        collection: 'products' as any,
          data: productData
        });
        createdProducts[productData.slug] = product.id;
        console.log(`✅ Created product: ${productData.name} (ID: ${product.id})`);
      } catch (error) {
        console.log(`⚠️ Product ${productData.name} might already exist, skipping...`);
        
        // Try to find existing product
        try {
          const existing = await payload.find({
            collection: 'products',
            where: { slug: { equals: productData.slug } },
            limit: 1
          });
          if (existing.docs.length > 0) {
            createdProducts[productData.slug] = existing.docs[0].id;
          }
        } catch (findError) {
          console.log(`Could not find existing product: ${productData.slug}`);
        }
      }
    }

    // Create sample orders (only if we have product IDs)
    if (Object.keys(createdProducts).length > 0) {
      const sampleOrders = [
        {
          orderNumber: `WTR-${Date.now() - 86400000}`, // Yesterday
          status: 'completed',
          customer: {
            firstName: 'John',
            lastName: 'Smith',
            email: 'john.smith@example.com',
            phone: '(555) 123-4567',
            address: {
              street: '123 Main St',
              city: 'Los Angeles',
              state: 'CA',
              zipCode: '90210'
            }
          },
          items: [
            {
              product: createdProducts['diy-expungement-kit'],
              quantity: 1,
              price: 97,
              total: 97
            }
          ],
          totals: {
            subtotal: 97,
            tax: 7.76,
            discount: 0,
            total: 104.76
          },
          payment: {
            method: 'credit_card',
            status: 'completed',
            transactionId: 'txn_' + Date.now(),
            paidAt: new Date(Date.now() - 86400000).toISOString()
          },
          caseDetails: {
            county: 'los_angeles',
            convictionType: ['misdemeanor'],
            convictionDate: new Date('2018-06-15').toISOString(),
            charges: [
              {
                charge: 'DUI',
                code: 'VC 23152(a)',
                disposition: 'Guilty Plea'
              }
            ]
          },
          timeline: [
            {
              date: new Date(Date.now() - 86400000).toISOString(),
              status: 'Order Placed',
              description: 'Customer placed order for DIY Expungement Kit',
              internal: false,
              updatedBy: 'System'
            },
            {
              date: new Date(Date.now() - 86400000 + 3600000).toISOString(),
              status: 'Payment Confirmed',
              description: 'Payment processed successfully',
              internal: false,
              updatedBy: 'System'
            }
          ],
          priority: 'normal',
          expectedCompletion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          orderNumber: `WTR-${Date.now() - 3600000}`, // Today, 1 hour ago
          status: 'processing',
          customer: {
            firstName: 'Sarah',
            lastName: 'Johnson',
            email: 'sarah.johnson@example.com',
            phone: '(555) 987-6543',
            address: {
              street: '456 Oak Blvd',
              city: 'Orange',
              state: 'CA',
              zipCode: '92868'
            }
          },
          items: [
            {
              product: createdProducts['full-service-expungement'],
              quantity: 1,
              price: 1497,
              total: 1497
            }
          ],
          totals: {
            subtotal: 1497,
            tax: 119.76,
            discount: 50, // Promo code
            total: 1566.76
          },
          payment: {
            method: 'credit_card',
            status: 'completed',
            transactionId: 'txn_' + (Date.now() - 3600000),
            paidAt: new Date(Date.now() - 3600000).toISOString()
          },
          caseDetails: {
            county: 'orange',
            convictionType: ['felony'],
            convictionDate: new Date('2015-03-22').toISOString(),
            charges: [
              {
                charge: 'Grand Theft',
                code: 'PC 487(a)',
                disposition: 'Guilty Plea'
              },
              {
                charge: 'Burglary',
                code: 'PC 459',
                disposition: 'Guilty Plea'
              }
            ]
          },
          timeline: [
            {
              date: new Date(Date.now() - 3600000).toISOString(),
              status: 'Order Placed',
              description: 'Customer ordered Full Service Expungement',
              internal: false,
              updatedBy: 'System'
            },
            {
              date: new Date(Date.now() - 1800000).toISOString(),
              status: 'Case Review Started',
              description: 'Attorney assigned and initial case review begun',
              internal: false,
              updatedBy: 'Legal Team'
            }
          ],
          assignedTo: {
            attorney: 'Jennifer Martinez',
            paralegal: 'Michael Chen',
            caseManager: 'Lisa Roberts'
          },
          priority: 'normal',
          expectedCompletion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          orderNumber: `WTR-${Date.now()}`, // Now
          status: 'pending',
          customer: {
            firstName: 'Mike',
            lastName: 'Rodriguez',
            email: 'mike.rodriguez@example.com',
            phone: '(555) 456-7890',
            address: {
              street: '789 Pine Ave',
              city: 'San Diego',
              state: 'CA',
              zipCode: '92101'
            }
          },
          items: [
            {
              product: createdProducts['expert-document-review'],
              quantity: 1,
              price: 197,
              total: 197
            }
          ],
          totals: {
            subtotal: 197,
            tax: 15.76,
            discount: 0,
            total: 212.76
          },
          payment: {
            method: 'credit_card',
            status: 'processing'
          },
          caseDetails: {
            county: 'san_diego',
            convictionType: ['dui'],
            convictionDate: new Date('2019-11-08').toISOString(),
            charges: [
              {
                charge: 'DUI',
                code: 'VC 23152(b)',
                disposition: 'Guilty Plea'
              }
            ]
          },
          timeline: [
            {
              date: new Date().toISOString(),
              status: 'Order Placed',
              description: 'Customer requested document review service',
              internal: false,
              updatedBy: 'System'
            }
          ],
          priority: 'normal',
          expectedCompletion: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      for (const orderData of sampleOrders) {
        try {
          await payload.create({
            collection: 'orders',
            data: orderData
          });
          console.log(`✅ Created order: ${orderData.orderNumber} - $${orderData.totals.total}`);
        } catch (error) {
          console.log(`⚠️ Order ${orderData.orderNumber} might already exist, skipping...`);
        }
      }
    }

    // Create sample analytics events
    const sampleAnalytics = [
      {
        eventType: 'sale_completed',
        source: 'website',
        category: 'revenue',
        value: 107.75,
        revenue: 107.75,
        details: {
          product: 'DIY Expungement Kit',
          customer: 'John Smith'
        }
      },
      {
        eventType: 'lead_created',
        source: 'google_ads',
        category: 'customer',
        value: 1,
        details: {
          utm_source: 'google',
          utm_campaign: 'expungement-california',
          landing_page: '/california-expungement-diy'
        }
      },
      {
        eventType: 'product_viewed',
        source: 'website',
        category: 'engagement',
        value: 1,
        details: {
          product: 'Full Service Expungement',
          session_duration: 245
        }
      },
      {
        eventType: 'email_opened',
        source: 'email',
        category: 'marketing',
        value: 1,
        details: {
          campaign: 'welcome-series-day-3',
          customer: 'sarah.johnson@example.com'
        }
      },
      {
        eventType: 'low_stock_alert',
        source: 'system',
        category: 'system',
        value: 3,
        priority: 'warning',
        details: {
          product: 'Rush Processing',
          current_stock: 3,
          threshold: 3
        }
      }
    ];

    for (const analyticsData of sampleAnalytics) {
      try {
        await payload.create({
          collection: 'analytics',
          data: analyticsData
        });
        console.log(`✅ Created analytics event: ${analyticsData.eventType}`);
      } catch (error) {
        console.log(`⚠️ Analytics event might already exist, skipping...`);
      }
    }

    console.log('🎉 Sample data initialization completed successfully!');
    console.log('📊 Your WipeThatRecord E-Commerce System is ready with:');
    console.log(`   • ${sampleProducts.length} products`);
    console.log(`   • ${Object.keys(createdProducts).length > 0 ? '3' : '0'} sample orders`);
    console.log(`   • ${sampleAnalytics.length} analytics events`);
    console.log('');
    console.log('🔗 Access your admin dashboard at: http://localhost:3000/admin');
    console.log('🤖 Your Telegram bot now has access to real business data!');

  } catch (error) {
    console.error('❌ Error initializing sample data:', error);
    throw error;
  }
}

// Helper function to clear existing data (use with caution!)
export async function clearSampleData() {
  try {
    const payload = await getPayload({ config });
    
    console.log('🗑️ Clearing existing sample data...');
    
    // Clear in reverse dependency order
    await payload.delete({
      collection: 'analytics',
      where: {}
    });
    
    await payload.delete({
      collection: 'orders',
      where: {}
    });
    
    await payload.delete({
      collection: 'products',
      where: {}
    });
    
    console.log('✅ Sample data cleared successfully');
    
  } catch (error) {
    console.error('❌ Error clearing sample data:', error);
    throw error;
  }
} 