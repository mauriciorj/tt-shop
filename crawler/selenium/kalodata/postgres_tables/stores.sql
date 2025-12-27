CREATE TABLE stores (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  k_id TEXT NOT NULL, -- id from shop-detail
  name TEXT NOT NULL, -- name from shop-detail
  type TEXT, -- type from shop-detail
  region TEXT, -- region from shop-detail
  main_category INTEGER, -- main_category from shop-detail
  second_category INTEGER, -- second_category from shop-detail
  third_category INTEGER, -- third_category from shop-detail
  day_revenue NUMERIC(15, 2), -- day_revenue from shop-detail-total
  day_sale NUMERIC(15, 2), -- sale from shop-detail-total [item sold]
  revenue NUMERIC(15, 2), -- revenue from shop-detail-total
  revenue_history NUMERIC[], -- unit_price from shop-detail-history
  revenue_growth_rate NUMERIC(5, 2), -- data > revenue from shop-detail-history
  sales NUMERIC(15, 2), -- sale from shop-detail-total [item sold]
  unit_price NUMERIC(10, 2), -- 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE
);