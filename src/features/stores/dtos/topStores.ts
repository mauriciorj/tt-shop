import { IStore, IStoreWithCategory } from '@/stores/types'

export default class TopStoresDto {
  stores: IStoreWithCategory[]

  constructor(data: IStore[] | undefined | null) {
    if (!data || data?.length === 0) {
      this.stores = []
      return
    }
    this.stores = this.getStores(data)
  }

  getStores(data: IStore[]): IStoreWithCategory[] {
    return data.map((item: IStore) => {
      delete item._id
      delete item._creationTime
      delete item.created_at
      delete item.k_day_sales
      delete item.k_day_revenue
      delete item.k_top_creators
      delete item.k_top_products
      delete item.k_top_videos
      delete item.second_category
      delete item.third_category
      delete item.updated_at
      return {
        country: item.country,
        category_id: item.main_category,
        k_id: item.k_id,
        name: item.name,
        image: item.storage_id,
        type: item.type,
        unit_price: item.unit_price,
        revenue: item.k_revenue,
        revenue_7_days: item.k_revenue_7_days,
        revenue_14_days: item.k_revenue_14_days,
        revenue_growth_rate: item.k_revenue_growth_rate,
        revenue_history: item.k_revenue_history,
        sales: item.k_sales,
      }
    })
  }
}
