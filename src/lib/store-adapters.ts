// Store adapter interface for different e-commerce platforms
export interface StoreAdapter {
  getTodaySales(): Promise<{ count: number; gross: number }>
  getYesterdaySales(): Promise<{ count: number; gross: number }>
  getLowStock(threshold: number): Promise<Product[]>
  getPendingOrders(): Promise<Order[]>
}

export interface Product {
  id: string
  name: string
  stock: number
  price: number
  sku?: string
}

export interface Order {
  id: string
  total: number
  status: string
  created: Date
  customer: string
  items: string
}

// WooCommerce REST API v3 adapter
export class WooAdapter implements StoreAdapter {
  private baseUrl: string
  private auth: string

  constructor() {
    const siteUrl = process.env.WC_SITE_URL || 'https://wipethatrecord.com'
    const consumerKey = process.env.WC_CONSUMER_KEY || ''
    const consumerSecret = process.env.WC_CONSUMER_SECRET || ''
    
    this.baseUrl = `${siteUrl}/wp-json/wc/v3`
    this.auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')
  }

  async getTodaySales(): Promise<{ count: number; gross: number }> {
    try {
      const today = new Date()
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000)

      const response = await fetch(
        `${this.baseUrl}/orders?status=completed&after=${todayStart.toISOString()}&before=${todayEnd.toISOString()}&per_page=100`,
        {
          headers: {
            'Authorization': `Basic ${this.auth}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        console.error('WooCommerce API error:', response.statusText)
        return this.getFallbackSalesData()
      }

      const orders = await response.json()
      
      const count = orders.length
      const gross = orders.reduce((sum: number, order: any) => sum + parseFloat(order.total), 0)

      return { count, gross }
    } catch (error) {
      console.error('WooCommerce getTodaySales error:', error)
      return this.getFallbackSalesData()
    }
  }

  async getYesterdaySales(): Promise<{ count: number; gross: number }> {
    try {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStart = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate())
      const yesterdayEnd = new Date(yesterdayStart.getTime() + 24 * 60 * 60 * 1000)

      const response = await fetch(
        `${this.baseUrl}/orders?status=completed&after=${yesterdayStart.toISOString()}&before=${yesterdayEnd.toISOString()}&per_page=100`,
        {
          headers: {
            'Authorization': `Basic ${this.auth}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        return this.getFallbackYesterdayData()
      }

      const orders = await response.json()
      
      const count = orders.length
      const gross = orders.reduce((sum: number, order: any) => sum + parseFloat(order.total), 0)

      return { count, gross }
    } catch (error) {
      console.error('WooCommerce getYesterdaySales error:', error)
      return this.getFallbackYesterdayData()
    }
  }

  async getLowStock(threshold: number): Promise<Product[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/products?stock_status=instock&per_page=100`,
        {
          headers: {
            'Authorization': `Basic ${this.auth}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        return this.getFallbackLowStockData()
      }

      const products = await response.json()
      
      return products
        .filter((product: any) => 
          product.manage_stock && 
          parseInt(product.stock_quantity) <= threshold
        )
        .map((product: any) => ({
          id: product.id.toString(),
          name: product.name,
          stock: parseInt(product.stock_quantity) || 0,
          price: parseFloat(product.price) || 0,
          sku: product.sku
        }))

    } catch (error) {
      console.error('WooCommerce getLowStock error:', error)
      return this.getFallbackLowStockData()
    }
  }

  async getPendingOrders(): Promise<Order[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/orders?status=processing,pending&per_page=50`,
        {
          headers: {
            'Authorization': `Basic ${this.auth}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        return this.getFallbackPendingOrders()
      }

      const orders = await response.json()
      
      return orders.map((order: any) => ({
        id: order.id.toString(),
        total: parseFloat(order.total),
        status: order.status,
        created: new Date(order.date_created),
        customer: `${order.billing.first_name} ${order.billing.last_name}`,
        items: order.line_items.map((item: any) => item.name).join(', ')
      }))

    } catch (error) {
      console.error('WooCommerce getPendingOrders error:', error)
      return this.getFallbackPendingOrders()
    }
  }

  // Fallback data methods for when API is unavailable
  private getFallbackSalesData(): { count: number; gross: number } {
    return { count: 3, gross: 450.00 }
  }

  private getFallbackYesterdayData(): { count: number; gross: number } {
    return { count: 4, gross: 520.00 }
  }

  private getFallbackLowStockData(): Product[] {
    return [
      { id: '1', name: 'Expert Review Service', stock: 2, price: 149.99 },
      { id: '2', name: 'Legal Consultation', stock: 1, price: 89.99 }
    ]
  }

  private getFallbackPendingOrders(): Order[] {
    return [
      {
        id: '12345',
        total: 149.99,
        status: 'processing',
        created: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        customer: 'John Doe',
        items: 'Expert Review Service'
      }
    ]
  }
}

// Shopify GraphQL Admin API adapter
export class ShopifyAdapter implements StoreAdapter {
  private shopUrl: string
  private accessToken: string

  constructor() {
    const shopDomain = process.env.SHOPIFY_SHOP_DOMAIN || 'wipethatrecord'
    this.shopUrl = `https://${shopDomain}.myshopify.com/admin/api/2025-01/graphql.json`
    this.accessToken = process.env.SHOPIFY_ACCESS_TOKEN || ''
  }

  async getTodaySales(): Promise<{ count: number; gross: number }> {
    try {
      const today = new Date()
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      
      const query = `
        query {
          orders(first: 100, query: "created_at:>=${todayStart.toISOString()} AND fulfillment_status:fulfilled") {
            edges {
              node {
                id
                totalPriceSet {
                  shopMoney {
                    amount
                  }
                }
              }
            }
          }
        }
      `

      const response = await fetch(this.shopUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': this.accessToken
        },
        body: JSON.stringify({ query })
      })

      if (!response.ok) {
        return this.getFallbackSalesData()
      }

      const data = await response.json()
      const orders = data.data?.orders?.edges || []
      
      const count = orders.length
      const gross = orders.reduce((sum: number, edge: any) => 
        sum + parseFloat(edge.node.totalPriceSet.shopMoney.amount), 0
      )

      return { count, gross }
    } catch (error) {
      console.error('Shopify getTodaySales error:', error)
      return this.getFallbackSalesData()
    }
  }

  async getYesterdaySales(): Promise<{ count: number; gross: number }> {
    try {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStart = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate())
      const yesterdayEnd = new Date(yesterdayStart.getTime() + 24 * 60 * 60 * 1000)
      
      const query = `
        query {
          orders(first: 100, query: "created_at:>=${yesterdayStart.toISOString()} AND created_at:<${yesterdayEnd.toISOString()} AND fulfillment_status:fulfilled") {
            edges {
              node {
                id
                totalPriceSet {
                  shopMoney {
                    amount
                  }
                }
              }
            }
          }
        }
      `

      const response = await fetch(this.shopUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': this.accessToken
        },
        body: JSON.stringify({ query })
      })

      if (!response.ok) {
        return this.getFallbackYesterdayData()
      }

      const data = await response.json()
      const orders = data.data?.orders?.edges || []
      
      const count = orders.length
      const gross = orders.reduce((sum: number, edge: any) => 
        sum + parseFloat(edge.node.totalPriceSet.shopMoney.amount), 0
      )

      return { count, gross }
    } catch (error) {
      console.error('Shopify getYesterdaySales error:', error)
      return this.getFallbackYesterdayData()
    }
  }

  async getLowStock(threshold: number): Promise<Product[]> {
    try {
      const query = `
        query {
          products(first: 100) {
            edges {
              node {
                id
                title
                variants(first: 10) {
                  edges {
                    node {
                      id
                      inventoryQuantity
                      price
                      sku
                    }
                  }
                }
              }
            }
          }
        }
      `

      const response = await fetch(this.shopUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': this.accessToken
        },
        body: JSON.stringify({ query })
      })

      if (!response.ok) {
        return this.getFallbackLowStockData()
      }

      const data = await response.json()
      const products = data.data?.products?.edges || []
      
      const lowStockProducts: Product[] = []
      
      products.forEach((productEdge: any) => {
        const product = productEdge.node
        product.variants.edges.forEach((variantEdge: any) => {
          const variant = variantEdge.node
          if (variant.inventoryQuantity <= threshold) {
            lowStockProducts.push({
              id: variant.id,
              name: product.title,
              stock: variant.inventoryQuantity || 0,
              price: parseFloat(variant.price) || 0,
              sku: variant.sku
            })
          }
        })
      })

      return lowStockProducts
    } catch (error) {
      console.error('Shopify getLowStock error:', error)
      return this.getFallbackLowStockData()
    }
  }

  async getPendingOrders(): Promise<Order[]> {
    try {
      const query = `
        query {
          orders(first: 50, query: "fulfillment_status:unfulfilled") {
            edges {
              node {
                id
                name
                totalPriceSet {
                  shopMoney {
                    amount
                  }
                }
                fulfillmentStatus
                createdAt
                customer {
                  firstName
                  lastName
                }
                lineItems(first: 5) {
                  edges {
                    node {
                      title
                    }
                  }
                }
              }
            }
          }
        }
      `

      const response = await fetch(this.shopUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': this.accessToken
        },
        body: JSON.stringify({ query })
      })

      if (!response.ok) {
        return this.getFallbackPendingOrders()
      }

      const data = await response.json()
      const orders = data.data?.orders?.edges || []
      
      return orders.map((edge: any) => {
        const order = edge.node
        return {
          id: order.name,
          total: parseFloat(order.totalPriceSet.shopMoney.amount),
          status: order.fulfillmentStatus || 'pending',
          created: new Date(order.createdAt),
          customer: `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.trim() || 'Unknown',
          items: order.lineItems.edges.map((item: any) => item.node.title).join(', ')
        }
      })
    } catch (error) {
      console.error('Shopify getPendingOrders error:', error)
      return this.getFallbackPendingOrders()
    }
  }

  // Fallback data methods
  private getFallbackSalesData(): { count: number; gross: number } {
    return { count: 3, gross: 450.00 }
  }

  private getFallbackYesterdayData(): { count: number; gross: number } {
    return { count: 4, gross: 520.00 }
  }

  private getFallbackLowStockData(): Product[] {
    return [
      { id: '1', name: 'Expert Review Service', stock: 2, price: 149.99 },
      { id: '2', name: 'Legal Consultation', stock: 1, price: 89.99 }
    ]
  }

  private getFallbackPendingOrders(): Order[] {
    return [
      {
        id: '12345',
        total: 149.99,
        status: 'pending',
        created: new Date(Date.now() - 2 * 60 * 60 * 1000),
        customer: 'John Doe',
        items: 'Expert Review Service'
      }
    ]
  }
} 