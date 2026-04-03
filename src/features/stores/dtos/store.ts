import { IStore, IStoreWithCategory } from '@/stores/types'

export default class StoreDto {
  store: IStoreWithCategory | null

  constructor(data: IStore | undefined | null) {
    if (!data) {
      this.store = null
    }
    this.store = this.getStores(data!)
  }

  getStores(data: IStore): IStoreWithCategory {
    delete data._id
    delete data._creationTime
    delete data.created_at
    delete data.k_day_sales
    delete data.k_day_revenue
    delete data.k_id
    delete data.second_category
    delete data.third_category
    delete data.updated_at
    return {
      country: data.country,
      category_id: data.main_category,
      name: data.name,
      image: data.storage_id,
      type: data.type,
      unit_price: data.unit_price,
      revenue: data.k_revenue,
      revenue_growth_rate: data.k_revenue_growth_rate,
      revenue_history: data.k_revenue_history,
      sales: data.k_sales,
      top_creators: data?.k_top_creators || [],
      top_products: data?.k_top_products || [],
      top_videos: data?.k_top_videos || [],
    }
  }
}
