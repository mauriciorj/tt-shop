import { ITopProducts, IProductWithCategory } from '@/products/types'

export default class ProductDto {
  product: IProductWithCategory | null

  constructor(data: ITopProducts | undefined | null) {
    if (!data) {
      this.product = null
    }
    this.product = this.getProducts(data!)
  }

  getProducts(data: ITopProducts): IProductWithCategory {
    delete data._id
    delete data._creationTime
    delete data.created_at
    delete data.k_creator_conversion_ratio
    delete data.k_id
    delete data.launch_date
    delete data.second_category
    delete data.third_category
    delete data.updated_at

    return {
      country: data.country,
      category: data.main_category,
      name: data.name,
      image: data.storage_id,
      revenue: data.k_revenue,
      revenue_growth_rate: data.k_revenue_growth_rate,
      revenue_history: data.k_revenue_history,
      sales: data.k_sales,
      product_rating: data.product_rating,
      unit_price: data.unit_price,
    }
  }
}
