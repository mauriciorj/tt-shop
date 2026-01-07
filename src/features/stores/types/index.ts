import { UUID } from "crypto";

export interface ITopStores {
  id: UUID;
  k_id: string;
  k_position: number;
  name: string;
  type: string;
  region: string;
  main_category: number;
  second_category: number | null;
  third_category: number | null;
  day_revenue: number;
  day_sales: number;
  revenue: number | string;
  revenue_history: number[];
  revenue_growth_rate: number | string;;
  sales: number | string;
  unit_price: number;
  created_at: Date;
  updated_at: Date;
}

export interface IStore {
  id: number;
  name: string;
  type: string;
  logo: string;
  bestSellingProducts: string[];
  revenue: string;
  revenueLastMonth: string;
  growthRate: number;
  itemsSold: string;
  avgUnitPrice: string;
}
