import { IVideo, IVideoDto } from '@/types/index'

export default class VideoDto {
  video: IVideoDto | null

  constructor(data: IVideo | undefined | null) {
    if (!data) {
      this.video = null
    }
    this.video = this.getVideo(data!)
  }

  getVideo(data: IVideo): IVideoDto {
    return {
      tt_account: data?.tt_account,
      storage_id: data?.storage_id,
      description: data?.description,
      views: data?.views,
      duration: data?.duration,
      id: data?.k_id,
      revenue: data?.k_revenue,
      sales: data?.k_sales,
      transcription: data?.transcription,
    }
  }
}
