CREATE TABLE categories (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  main_category_id TEXT, -- account from shop-detail
  main_category_name TEXT, -- nickname from shop-detail
  second_category_id TEXT,
  second_category_name TEXT,
  third_category_id TEXT,
  third_category_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE
);