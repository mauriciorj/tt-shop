import { ITopStores, IStoreWithCategory } from "@/stores/types";

export default class TopStores {
  stores: IStoreWithCategory[];

  constructor(data: ITopStores[] | undefined | null) {
    if (!data || data?.length === 0) {
      this.stores = [];
    }
    this.stores = this.getStores(data!);
  }

  getStores(data: ITopStores[]): IStoreWithCategory[] {
    return data.map((item: ITopStores) => {
      delete item._id;
      delete item._creationTime;
      delete item.created_at;
      delete item.k_day_sales;
      delete item.k_day_revenue;
      delete item.k_id;
      delete item.k_top_creators;
      delete item.k_top_products;
      delete item.k_top_videos;
      delete item.second_category;
      delete item.third_category;
      delete item.updated_at;
      return {
        country: item.country,
        category: item.main_category,
        name: item.name,
        image: item.storage_id,
        type: item.type,
        unit_price: item.unit_price,
        revenue: item.k_revenue,
        revenue_growth_rate: item.k_revenue_growth_rate,
        revenue_history: item.k_revenue_history,
        sales: item.k_sales,
      };
    });
  }
}
