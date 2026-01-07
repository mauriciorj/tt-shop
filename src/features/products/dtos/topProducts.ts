import { ITopProducts } from "@/products/types";

export default class TopProducts {
  products: ITopProducts[] | [];

  constructor(data: ITopProducts[] | [] | undefined | null) {
    if (!data || data?.length === 0) {
      this.products = [];
    }
    this.products = this.getProducts(data!);
  }

  getProducts(data: ITopProducts[]) {
    return data.map((item) => {
      return {
        ...item,
        revenue: item?.revenue.toLocaleString("pt-BR"),
        revenue_growth_rate: item?.revenue_growth_rate.toLocaleString("pt-BR"),
        sales: item?.sales.toLocaleString("pt-BR"),
      };
    });
  }
}
