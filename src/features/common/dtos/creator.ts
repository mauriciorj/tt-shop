import { ICreator, ICreatorDto } from '@/types/index'

export default class CreatorDto {
  creator: ICreatorDto | null

  constructor(data: ICreator | undefined | null) {
    if (!data) {
      this.creator = null
    }
    this.creator = this.getCreator(data!)
  }

  getCreator(data: ICreator): ICreatorDto {
    return {
      storage_id: data?.storage_id,
      tt_account: data?.tt_account,
      tt_nickname: data?.tt_nickname,
      tt_followers: data?.tt_followers,
      revenue: data?.k_revenue,
      sales: data?.k_sales,
    }
  }
}
