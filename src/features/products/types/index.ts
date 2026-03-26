import { Id } from '@/convex/_generated/dataModel'

export type TSortKey =
  | 'revenue'
  | 'revenueHistory'
  | 'revenueGrowthRate'
  | 'rating'
  | 'sales'
  | 'unitPrice'

export type TSortOrder = 'asc' | 'desc'

export interface ITopProducts {
  _id?: Id<'products'>
  _creationTime?: number
  country: string
  created_at?: string | undefined
  k_creator_conversion_ratio?: number
  k_id?: string
  k_revenue: number
  k_revenue_7_days?: number | undefined
  k_revenue_14_days?: number | undefined
  k_revenue_growth_rate: number
  k_revenue_history: number[]
  k_sales: number
  launch_date?: string
  main_category: string
  name: string
  product_rating: number
  second_category?: string | null
  storage_id?: string | undefined
  third_category?: string | null
  unit_price: number
  updated_at?: string | undefined
}

export interface IProductsWithCategory {
  country: string
  category_id: string
  category_name?: string | null
  k_id?: string
  name: string
  image: string | null | undefined
  unit_price: number
  product_rating: number
  rank?: number
  revenue: number
  revenue_7_days?: number | undefined
  revenue_14_days?: number | undefined
  revenue_growth_rate: number
  revenue_history: number[]
  sales: number
}
;[]
