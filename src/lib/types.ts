// Telegram API types
export interface TelegramMessage {
  message_id: number
  from?: TelegramUser
  chat: TelegramChat
  date: number
  text?: string
  reply_to_message?: TelegramMessage
}

export interface TelegramUser {
  id: number
  is_bot: boolean
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
}

export interface TelegramChat {
  id: number
  type: 'private' | 'group' | 'supergroup' | 'channel'
  title?: string
  username?: string
  first_name?: string
  last_name?: string
}

// Business metrics interfaces
export interface BusinessMetrics {
  todayRevenue: number
  todayOrders: number
  yesterdayRevenue: number
  yesterdayOrders: number
  weekRevenue: number
  avgOrderValue: number
  conversionRate: number
  weeklyVisitors: number
  cartAbandonmentRate: number
  lowStockCount: number
  pendingOrders: number
  topProducts: ProductPerformance[]
  topSources: TrafficSource[]
}

export interface ProductPerformance {
  name: string
  sales: number
  units?: number
  growth?: number
}

export interface TrafficSource {
  source: string
  count: number
  conversionRate?: number
  revenue?: number
}

// Alert types
export interface BusinessAlert {
  id: string
  type: 'low_stock' | 'overdue_orders' | 'sales_drop' | 'high_abandonment' | 'revenue_spike'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  message: string
  data?: any
  created: Date
  resolved?: boolean
}

// Webhook security
export interface WebhookValidation {
  isValid: boolean
  chatId?: string
  username?: string
  timestamp: Date
}

// Scheduled job types
export interface ScheduledJob {
  id: string
  name: string
  schedule: string // cron format
  enabled: boolean
  lastRun?: Date
  nextRun?: Date
}

// Store integration types
export interface StoreCredentials {
  provider: 'woo' | 'shopify'
  siteUrl?: string
  consumerKey?: string
  consumerSecret?: string
  shopDomain?: string
  accessToken?: string
}

// Analytics types
export interface DailyAnalytics {
  date: Date
  revenue: number
  orders: number
  visitors: number
  conversionRate: number
  avgOrderValue: number
  topProduct: string
  topSource: string
  alerts: number
}

export interface WeeklyReport {
  weekStart: Date
  weekEnd: Date
  totalRevenue: number
  totalOrders: number
  avgDailyRevenue: number
  bestDay: string
  worstDay: string
  growth: {
    revenue: number // percentage
    orders: number // percentage
    conversion: number // percentage
  }
  insights: string[]
  recommendations: string[]
}

// Command response types
export interface CommandResponse {
  success: boolean
  message: string
  data?: any
  timestamp: Date
}

// Bot configuration
export interface BotConfig {
  botToken: string
  allowedChats: string[]
  storeProvider: 'woo' | 'shopify'
  enableAlerts: boolean
  alertThresholds: {
    lowStock: number
    orderAge: number // hours
    salesDrop: number // percentage
  }
  schedules: {
    dailySummary: string // cron
    lowStockCheck: string // cron
    orderCheck: string // cron
  }
}

// Environment validation
export interface EnvValidation {
  isValid: boolean
  missing: string[]
  warnings: string[]
  storeConfigured: boolean
  aiConfigured: boolean
  webhookConfigured: boolean
} 