CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commission_rate NUMERIC(5, 2), -- commission_rate from product-detail
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  k_id TEXT UNIQUE NOT NULL, -- id from product-detail
  main_category INTEGER, -- pri_cate_id from product-detail
  min_price NUMERIC(10, 2), -- min_real_price from product-detail
  max_price NUMERIC(10, 2), -- max_real_price from product-detail
  name TEXT NOT NULL, -- product_title from product-detail
  rating NUMERIC(3, 2), -- product_rating from product-detail 
  revenue NUMERIC(15, 2), -- revenue from product-detail-total
  day_revenue NUMERIC(15, 2), -- day_revenue from product-detail-total
  revenue_trend NUMERIC[], -- data from product-detail-history
  revenue_growth_rate NUMERIC(10, 4),
  reviews INTEGER, -- product_review_count from product-detail
  sales NUMERIC(15, 2), -- sale from product-detail-total
  second_category INTEGER, -- sec_cate_id from product-detail
  store_id UUID REFERENCES stores(id), -- Linked to stores table
  third_category INTEGER, -- ter_cate_id from product-detail
  type TEXT,
  unit_price NUMERIC(10, 2), 
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);