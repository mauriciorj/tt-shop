CREATE TABLE stores (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  country TEXT,
  name TEXT NOT NULL, -- name from shop-detail
  type TEXT, -- type from shop-detail
  main_category INTEGER, -- main_category from shop-detail
  second_category INTEGER, -- second_category from shop-detail
  third_category INTEGER, -- third_category from shop-detail
  unit_price NUMERIC(10, 2), -- 
  k_id TEXT NOT NULL, -- id from shop-detail
  k_position INTEGER, -- position from shop-detail
  k_day_revenue NUMERIC(15, 2), -- day_revenue from shop-detail-total
  k_day_sales NUMERIC(15, 2), -- sale from shop-detail-total [item sold]
  k_revenue NUMERIC(15, 2), -- revenue from shop-detail-total
  k_revenue_history NUMERIC[], -- unit_price from shop-detail-history
  k_revenue_growth_rate NUMERIC(5, 2), -- data > revenue from shop-detail-history
  k_sales NUMERIC(15, 2), -- sale from shop-detail-total [item sold]
  k_top_creators NUMERIC[], -- 
  k_top_products NUMERIC[], -- 
  k_top_videos NUMERIC[], -- 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE
);