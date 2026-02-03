import { ITopProducts, IProductWithCategory } from '@/products/types'

export default class TopProducts {
  products: IProductWithCategory[]

  constructor(data: ITopProducts[] | undefined | null) {
    if (!data || data?.length === 0) {
      this.products = []
    }
    this.products = this.getProducts(data!)
  }

  getProducts(data: ITopProducts[]): IProductWithCategory[] {
    return data.map((item) => {
      delete item._id
      delete item._creationTime
      delete item.created_at
      delete item.k_creator_conversion_ratio
      delete item.k_id
      delete item.launch_date
      delete item.second_category
      delete item.third_category
      delete item.updated_at

      return {
        country: item.country,
        category: item.main_category,
        name: item.name,
        image: item.storage_id,
        revenue: item.k_revenue,
        revenue_growth_rate: item.k_revenue_growth_rate,
        revenue_history: item.k_revenue_history,
        sales: item.k_sales,
        product_rating: item.product_rating,
        unit_price: item.unit_price,
      }
    })
  }
}
