CREATE TABLE top_stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  k_id TEXT NOT NULL,
  store_id UUID REFERENCES stores(id), -- Linked to stores table
  position INTEGER,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  region TEXT NOT NULL,
  main_category INTEGER, -- main_category from shop-detail
  second_category INTEGER,
  third_category INTEGER,
  revenue NUMERIC(15, 2),
  revenue_history NUMERIC[],
  revenue_growth_rate NUMERIC(5, 2),
  sales NUMERIC(15, 2),
  unit_price NUMERIC(10, 2), -- 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE
);