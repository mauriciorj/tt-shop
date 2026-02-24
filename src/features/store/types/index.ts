import { Id } from '@/convex/_generated/dataModel'
import { ICreatorDto, IProductDto, IVideoDto } from '@/types/index'

export interface ITopStore {
  _id?: Id<'stores'>
  _creationTime?: number
  country: string
  created_at?: string | undefined
  k_day_revenue?: number | undefined
  k_day_sales?: number | undefined
  k_id?: string
  k_revenue: number
  k_revenue_growth_rate: number
  k_revenue_history: number[]
  k_sales: number
  k_top_creators?: string[] | undefined
  k_top_products?: string[] | undefined
  k_top_videos?: string[] | undefined
  main_category: string
  name: string
  second_category?: string
  storage_id?: string | undefined
  third_category?: string
  type: string
  unit_price: number
  updated_at?: string | undefined
}

export interface IStoreWithCategory {
  country: string
  category_id: string
  category_name?: string | null
  name: string
  image: string | null | undefined
  type: string
  unit_price: number
  rank?: number
  revenue: number
  revenue_growth_rate: number
  revenue_history: number[]
  sales: number
  top_creators?: string[] | ICreatorDto[] | undefined
  top_products?: string[] | IProductDto[] | undefined
  top_videos?: string[] | IVideoDto[] | undefined
}

export interface IStoreTable {
  category: string
  country: string
  k_revenue: number
  k_revenue_growth_rate: number
  k_revenue_history: number[]
  k_sales: number
  main_category: string
  name: string
  storage_id: string
  type: string
  unit_price: number
}
