import { UUID } from "crypto";

interface ITopStores {
  created_at: Date;
  id: UUID;
  k_id: string;
  k_position: number;
  main_category: number;
  name: string;
  region: string;
  revenue: number | string;
  revenue_growth_rate: number | string;
  revenue_history: number[];
  sales: number | string;
  second_category: number | null;
  store_id: UUID;
  third_category: number | null;
  type: string;
  updated_at: Date;
}

export default class TopStores {
  stores: ITopStores[] | [];

  constructor(data: ITopStores[] | [] | undefined | null) {
    if (!data || data?.length === 0) {
      this.stores = [];
    }
    this.stores = this.getStores(data!);
  }

  getStores(data: ITopStores[]) {
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
