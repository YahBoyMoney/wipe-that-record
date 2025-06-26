import { getPayload } from 'payload';
import config from '../../payload.config';

export class PayloadAdapter {
  private payload: any;

  constructor() {
    this.initPayload();
  }

  private async initPayload() {
    try {
      this.payload = await getPayload({ config });
    } catch (error) {
      console.error('PayloadAdapter initialization error:', error);
    }
  }

  async ensurePayload() {
    if (!this.payload) {
      await this.initPayload();
    }
    return this.payload;
  }

  // Sales Analytics
  async getTodaySales() {
    try {
      const payload = await this.ensurePayload();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const orders = await payload.find({
        collection: 'orders',
        where: {
          and: [
            { createdAt: { greater_than_equal: today.toISOString() } },
            { status: { in: ['paid', 'completed'] } }
          ]
        },
        limit: 1000
      });

      const gross = orders.docs.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
      const count = orders.docs.length;

      return { gross, count };
    } catch (error) {
      console.error('getTodaySales error:', error);
      return { gross: 0, count: 0 };
    }
  }

  async getYesterdaySales() {
    try {
      const payload = await this.ensurePayload();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const orders = await payload.find({
        collection: 'orders',
        where: {
          and: [
            { createdAt: { greater_than_equal: yesterday.toISOString() } },
            { createdAt: { less_than: today.toISOString() } },
            { status: { in: ['paid', 'completed'] } }
          ]
        },
        limit: 1000
      });

      const gross = orders.docs.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
      const count = orders.docs.length;

      return { gross, count };
    } catch (error) {
      console.error('getYesterdaySales error:', error);
      return { gross: 0, count: 0 };
    }
  }

  // Inventory Management
  async getLowStock(threshold: number = 5) {
    try {
      const payload = await this.ensurePayload();
      
      const products = await payload.find({
        collection: 'products',
        where: {
          and: [
            { status: { equals: 'active' } },
            { trackInventory: { equals: true } },
            { stock: { less_than_equal: threshold } }
          ]
        },
        limit: 100
      });

      return products.docs.map((product: any) => ({
        id: product.id,
        name: product.name,
        stock: product.stock || 0,
        category: product.category,
        price: product.price
      }));

    } catch (error) {
      console.error('getLowStock error:', error);
      return [];
    }
  }

  // Customer Analytics
  async getNewLeadsToday() {
    try {
      const payload = await this.ensurePayload();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const leads = await payload.find({
        collection: 'leads',
        where: {
          createdAt: { greater_than_equal: today.toISOString() }
        },
        limit: 1000
      });

      return leads.docs.length;
    } catch (error) {
      console.error('getNewLeadsToday error:', error);
      return 0;
    }
  }

  // Business Metrics
  async getBusinessMetrics() {
    try {
      const [todaySales, yesterdaySales, lowStock, newLeads] = await Promise.all([
        this.getTodaySales(),
        this.getYesterdaySales(),
        this.getLowStock(),
        this.getNewLeadsToday()
      ]);

      return {
        revenue: {
          today: todaySales.gross,
          yesterday: yesterdaySales.gross,
          change: yesterdaySales.gross > 0 
            ? ((todaySales.gross - yesterdaySales.gross) / yesterdaySales.gross) * 100
            : 0
        },
        orders: {
          today: todaySales.count,
          yesterday: yesterdaySales.count
        },
        inventory: {
          lowStockItems: lowStock.length,
          lowStockProducts: lowStock
        },
        leads: {
          newToday: newLeads
        }
      };
    } catch (error) {
      console.error('getBusinessMetrics error:', error);
      return {
        revenue: { today: 0, yesterday: 0, change: 0 },
        orders: { today: 0, yesterday: 0 },
        inventory: { lowStockItems: 0, lowStockProducts: [] },
        leads: { newToday: 0 }
      };
    }
  }

  // Order Management
  async getPendingOrders() {
    try {
      const payload = await this.ensurePayload();
      
      const orders = await payload.find({
        collection: 'orders',
        where: {
          status: { in: ['pending', 'processing', 'in-progress'] }
        },
        limit: 50,
        sort: '-createdAt'
      });

      return orders.docs.map((order: any) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customer: order.customerName,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt
      }));

    } catch (error) {
      console.error('getPendingOrders error:', error);
      return [];
    }
  }

  // Product Analytics
  async getTopProducts(limit: number = 5) {
    try {
      const payload = await this.ensurePayload();
      
      const products = await payload.find({
        collection: 'products',
        where: {
          status: { equals: 'active' }
        },
        limit: 100
      });

      // Sort by total revenue
      const sortedProducts = products.docs
        .sort((a: any, b: any) => (b.totalRevenue || 0) - (a.totalRevenue || 0))
        .slice(0, limit);

      return sortedProducts.map((product: any) => ({
        id: product.id,
        name: product.name,
        sales: product.totalSales || 0,
        revenue: product.totalRevenue || 0,
        category: product.category
      }));

    } catch (error) {
      console.error('getTopProducts error:', error);
      return [];
    }
  }

  // Analytics Tracking
  async trackEvent(eventType: string, data: any) {
    try {
      const payload = await this.ensurePayload();
      
      await payload.create({
        collection: 'analytics',
        data: {
          eventType,
          source: data.source || 'system',
          category: data.category || 'general',
          value: data.value || 0,
          revenue: data.revenue || 0,
          details: data.details || {},
          ...data
        }
      });

      return true;
    } catch (error) {
      console.error('trackEvent error:', error);
      return false;
    }
  }

  // Product Management
  async updateProductStats(productId: string, stats: any) {
    try {
      const payload = await this.ensurePayload();
      
      await payload.update({
        collection: 'products',
        id: productId,
        data: {
          totalSales: stats.totalSales,
          totalRevenue: stats.totalRevenue,
          lastSale: new Date()
        }
      });

      return true;
    } catch (error) {
      console.error('updateProductStats error:', error);
      return false;
    }
  }
}

export default PayloadAdapter; 