import { UUID } from "crypto";

interface ITopProducts {
  created_at: Date;
  creator_conversion_ratio: number;
  id: UUID;
  k_id: string;
  k_position: number;
  launch_date: string;
  main_category: number;
  name: string;
  product_id: UUID;
  product_rating: number;
  revenue: number | string;
  revenue_growth_rate: number | string;
  revenue_history: number[];
  sales: number | string;
  second_category: number | null;
  third_category: number | null;
  unit_price: number;
  updated_at: Date;
}

export default class TopProducts {
  products: ITopProducts[] | [];

  constructor(data: ITopProducts[] | [] | undefined | null) {
    if (!data || data?.length === 0) {
      this.products = [];
    }
    this.products = this.getProducts(data!);
  }

  getProducts(data: ITopProducts[]) {
    return data
      .map((item) => {
        return {
          ...item,
          revenue: item?.revenue.toLocaleString("pt-BR"),
          revenue_growth_rate:
            item?.revenue_growth_rate.toLocaleString("pt-BR"),
          sales: item?.sales.toLocaleString("pt-BR"),
        };
      })
      .sort((a, b) => a.k_position - b.k_position);
  }
}
