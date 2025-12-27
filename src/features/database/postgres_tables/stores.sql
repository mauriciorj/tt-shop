CREATE TABLE stores (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  k_id TEXT NOT NULL, -- id from shop-detail
  unit_price NUMERIC(10, 2), -- 
  revenue NUMERIC(15, 2), -- revenue from shop-detail-total
  sales NUMERIC(15, 2), -- sale from shop-detail-total [item sold]
  revenue_history NUMERIC[], -- unit_price from shop-detail-history
  revenue_growth_rate NUMERIC(5, 2), -- data > revenue from shop-detail-history
  name TEXT NOT NULL, -- name from shop-detail
  type TEXT, -- type from shop-detail
  region TEXT, -- region from shop-detail
  day_revenue NUMERIC(15, 2), -- day_revenue from shop-detail-total
  day_sale NUMERIC(15, 2), -- sale from shop-detail-total [item sold]
  main_category INTEGER, -- main_category from shop-detail
  second_category INTEGER, -- second_category from shop-detail
  third_category INTEGER, -- third_category from shop-detail
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT
);