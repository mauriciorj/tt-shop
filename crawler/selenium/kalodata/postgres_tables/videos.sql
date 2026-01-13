CREATE TABLE videos (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  k_id TEXT NOT NULL, -- id from shop-detail
  tt_account TEXT, -- account from shop-detail
  description TEXT, -- description from shop-detail
  views NUMERIC(15, 2), -- views from shop-detail
  duration TEXT, -- duration from shop-detail
  revenue NUMERIC(15, 2), -- revenue from shop-detail-total
  sales NUMERIC(15, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE
);