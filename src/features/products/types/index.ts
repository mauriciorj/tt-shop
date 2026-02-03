import { Id } from '../../../../convex/_generated/dataModel'

export interface ITopProducts {
  _id?: Id<'products'>
  _creationTime?: number
  country: string
  created_at?: string | undefined
  k_creator_conversion_ratio?: number
  k_id?: string
  k_revenue: number
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

export interface IProductWithCategory {
  country: string
  category: string | undefined
  name: string
  image: string | null | undefined
  unit_price: number
  product_rating: number
  revenue: number
  revenue_growth_rate: number
  revenue_history: number[]
  sales: number
}
;[]
