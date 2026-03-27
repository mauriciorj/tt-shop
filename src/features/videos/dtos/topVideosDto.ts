import { ITopVideos, ITopVideosWithCategory } from '@/videos/types'

export default class TopVideosDto {
  videos: ITopVideosWithCategory[]

  constructor(data: ITopVideos[]) {
    if (!data || data?.length === 0) {
      this.videos = []
    }
    this.videos = this.getVideos(data!)
  }

  getVideos(data: ITopVideos[]): ITopVideosWithCategory[] {
    return data.map((item: ITopVideos) => {
      delete item._id
      delete item._creationTime
      delete item.created_at
      delete item.updated_at
      return {
        category_id: item?.main_category || null,
        description: item.description,
        duration: item.duration,
        image: item.storage_id,
        revenue: item.k_revenue,
        revenue_7_days: item.k_revenue_7_days,
        revenue_14_days: item.k_revenue_14_days,
        sales: item.k_sales,
        transcription: item?.transcription,
        tt_account: item.tt_account,
        video_id: item.k_id,
        views: item.views,
      }
    })
  }
}
