import { Id } from '@/convex/_generated/dataModel'
import { ICreatorDto, IVideoDto } from '@/types/index'

export type TProductSortKey =
  | 'revenue'
  | 'revenueHistory'
  | 'revenueGrowthRate'
  | 'rating'
  | 'sales'
  | 'unitPrice'

export type TProductSortOrder = 'asc' | 'desc'

export interface IProduct {
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
  k_top_creators?: string[] | undefined
  k_top_videos?: string[] | undefined
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
  top_creators?: string[] | ICreatorDto[] | undefined
  top_videos?: string[] | IVideoDto[] | undefined
}
;[]
