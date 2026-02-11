export type UserRole = 'admin' | 'manager' | 'user'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  phone?: string
  department?: string
  createdAt: Date
  password?: string
}

export interface UserDistribution {
  type: string
  value: number
  color: string
}

export interface RevenueData {
  month: string
  revenue: number
  target: number
}

export interface OrderData {
  month: string
  orders: number
  previousYear: number
}

export interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  sales: number
  status: 'active' | 'inactive' | 'out_of_stock'
}

export interface Order {
  id: string
  customer: string
  email: string
  amount: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  date: string
  items: number
}

export interface Report {
  id: string
  title: string
  type: string
  generatedBy: string
  date: string
  size: string
}

export interface AnalyticsData {
  pageViews: number
  sessions: number
  bounceRate: number
  avgSessionDuration: number
  newUsers: number
  returningUsers: number
  topPages: { page: string; views: number }[]
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: Date
  roles: UserRole[]
}

export interface MenuItem {
  href: string
  icon: React.ReactNode
  label: string
  roles: UserRole[]
  badge?: number
}

export interface Permission {
  id: string
  name: string
  description: string
  roles: UserRole[]
}

export interface TrafficSource {
  source: string
  value: number
  color: string
  change?: number
}