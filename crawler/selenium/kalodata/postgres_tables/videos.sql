CREATE TABLE videos (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  tt_account TEXT, -- account from shop-detail
  description TEXT, -- description from shop-detail
  views NUMERIC(15, 2), -- views from shop-detail
  duration TEXT, -- duration from shop-detail
  k_id TEXT NOT NULL, -- id from shop-detail
  k_revenue NUMERIC(15, 2), -- revenue from shop-detail-total
  k_sales NUMERIC(15, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE
);