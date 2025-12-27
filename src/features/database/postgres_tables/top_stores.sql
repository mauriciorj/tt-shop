CREATE TABLE top_stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  k_id TEXT NOT NULL,
  unit_price TEXT NOT NULL,
  revenue TEXT NOT NULL,
  sales TEXT NOT NULL,
  revenue_history NUMERIC[],
  revenue_growth_rate NUMERIC(5, 2),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  main_category INTEGER, -- main_category from shop-detail
  region TEXT NOT NULL,
  position INTEGER,
  store_id UUID REFERENCES stores(id), -- Linked to stores table
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
