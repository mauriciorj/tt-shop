CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country TEXT,
  launch_date TEXT,
  product_rating NUMERIC(5, 2),
  main_category INTEGER,
  second_category INTEGER,
  third_category INTEGER,
  unit_price NUMERIC(10, 2),
  k_id TEXT NOT NULL,
  k_position INTEGER,
  k_creator_conversion_ratio NUMERIC(5, 2),
  k_revenue NUMERIC(15, 2),
  k_revenue_history NUMERIC[],
  k_revenue_growth_rate NUMERIC(5, 2),
  k_sales NUMERIC(15, 2),
  k_top_creators NUMERIC[], -- 
  k_top_videos NUMERIC[], -- 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE
);
