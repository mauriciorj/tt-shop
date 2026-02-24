import { IProduct, IProductDto } from '@/types/index'

export default class ProductDto {
  product: IProductDto | null

  constructor(data: IProduct | undefined | null) {
    if (!data) {
      this.product = null
    }
    this.product = this.getProduct(data!)
  }

  getProduct(data: IProduct): IProductDto {
    return {
      name: data?.name,
      storage_id: data?.storage_id,
      product_rating: data?.product_rating,
      unit_price: data?.unit_price,
      creator_conversion_ratio: data?.k_creator_conversion_ratio,
      day_revenue: data?.k_day_revenue,
      day_sales: data?.k_day_sales,
      revenue: data?.k_revenue,
      revenue_history: data?.k_revenue_history,
      revenue_history_14_days: data?.k_revenue_history_14_days,
      revenue_history_7_days: data?.k_revenue_history_7_days,
      revenue_growth_rate: data?.k_revenue_growth_rate,
      sales: data?.k_sales,
    }
  }
}
