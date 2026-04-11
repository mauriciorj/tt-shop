import { Id } from '@/convex/_generated/dataModel'

export interface ITopVideos {
  _id?: Id<'videos'>
  _creationTime?: number
  created_at?: string | undefined
  description: string
  duration: string
  k_id?: string
  k_revenue: number
  k_revenue_7_days?: number | undefined
  k_revenue_14_days?: number | undefined
  k_sales: number
  main_category?: string | null | undefined
  storage_id?: string | undefined
  transcription?: string | undefined
  tt_account?: string | null | undefined
  updated_at?: string | undefined
  views: number
}

export interface ITopVideosWithCategory {
  category_id?: string | null
  category_name?: string | null
  description: string
  duration: string
  image: string | null | undefined
  revenue: number
  revenue_7_days?: number | undefined
  revenue_14_days?: number | undefined
  sales: number
  transcription?: string | undefined
  tt_account?: string | null | undefined
  video_id?: string | undefined
  views: number
}

export type Status = 'idle' | 'loading' | 'success' | 'error'
