import { ITopProducts, IProductsWithCategory } from '@/products/types'

export default class TopProductsDto {
  products: IProductsWithCategory[]

  constructor(data: ITopProducts[] | undefined | null) {
    if (!data || data?.length === 0) {
      this.products = []
    }
    this.products = this.getProducts(data!)
  }

  getProducts(data: ITopProducts[]): IProductsWithCategory[] {
    return data.map((item) => {
      delete item._id
      delete item._creationTime
      delete item.created_at
      delete item.k_creator_conversion_ratio
      delete item.launch_date
      delete item.second_category
      delete item.third_category
      delete item.updated_at

      return {
        country: item.country,
        category_id: item.main_category,
        k_id: item.k_id,
        name: item.name,
        image: item.storage_id,
        revenue: item.k_revenue,
        revenue_7_days: item.k_revenue_7_days,
        revenue_14_days: item.k_revenue_14_days,
        revenue_growth_rate: item.k_revenue_growth_rate,
        revenue_history: item.k_revenue_history,
        sales: item.k_sales,
        product_rating: item.product_rating,
        unit_price: item.unit_price,
      }
    })
  }
}
