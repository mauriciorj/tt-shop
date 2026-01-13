CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country TEXT,
  k_id TEXT NOT NULL,
  k_position INTEGER,
  name TEXT NOT NULL,
  launch_date TEXT,
  product_rating NUMERIC(5, 2),
  main_category INTEGER,
  second_category INTEGER,
  third_category INTEGER,
  creator_conversion_ratio NUMERIC(5, 2),
  revenue NUMERIC(15, 2),
  revenue_history NUMERIC[],
  revenue_growth_rate NUMERIC(5, 2),
  sales NUMERIC(15, 2),
  unit_price NUMERIC(10, 2),
  top_creators NUMERIC[], -- 
  top_videos NUMERIC[], -- 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE
);
