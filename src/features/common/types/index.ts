import { Id } from '@/convex/_generated/dataModel'

export interface ICreator {
  _id: Id<'creators'>
  _creationTime: number
  k_id: string
  storage_id?: string
  tt_account: string
  tt_nickname: string
  tt_followers: number
  k_revenue: number
  k_sales?: number
  k_video_revenue?: number
  k_live_revenue?: number
  created_at?: string
  updated_at?: string
}

export interface ICreatorDto {
  storage_id?: string
  image?: string | null
  tt_account: string
  tt_nickname: string
  tt_followers: number
  revenue: number
  sales?: number
}

export interface IProduct {
  _id: Id<'products'>
  _creationTime: number
  country: string
  name: string
  name_url?: string
  storage_id?: string
  launch_date: string
  product_rating: number
  main_category: string
  second_category?: string
  third_category?: string
  unit_price: number
  k_id: string
  k_creator_conversion_ratio: number
  k_day_revenue?: number
  k_day_sales?: number
  k_revenue: number
  k_revenue_history: number[]
  k_revenue_history_14_days?: number[]
  k_revenue_history_7_days?: number[]
  k_revenue_growth_rate: number
  k_sales: number
  k_top_creators?: string[]
  k_top_videos?: string[]
  created_at?: string
  updated_at?: string
}

export interface IProductDto {
  name: string
  storage_id?: string
  image?: string | null
  product_rating: number
  unit_price: number
  creator_conversion_ratio: number
  day_revenue?: number
  day_sales?: number
  revenue: number
  revenue_history: number[]
  revenue_history_14_days?: number[]
  revenue_history_7_days?: number[]
  revenue_growth_rate: number
  sales: number
}

export interface IVideo {
  _id: Id<'videos'>
  _creationTime: number
  tt_account?: string
  storage_id?: string
  description: string
  views: number
  duration: string
  k_id: string
  k_revenue: number
  k_sales?: number
  main_category?: string
  transcription?: string
  created_at?: string
  updated_at?: string
}

export interface IVideoDto {
  tt_account?: string
  storage_id?: string
  image?: string | null
  description: string
  views: number
  duration: string
  id: string
  revenue: number
  sales?: number
  transcription?: string
}
