import { UUID } from "crypto";

export interface ITopProducts {
  id: UUID;
  k_id: string;
  name: string;
  launch_date: string;
  product_rating: number;
  main_category: number;
  second_category: number | null;
  third_category: number | null;
  creator_conversion_ratio: number;
  revenue: number | string;
  revenue_history: number[];
  revenue_growth_rate: number | string;
  sales: number | string;
  unit_price: number;
  created_at: Date;
  updated_at: Date;
}
