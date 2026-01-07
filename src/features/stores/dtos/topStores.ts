import { ITopStores } from "@/stores/types";

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
