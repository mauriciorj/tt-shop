CREATE TABLE creators (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  k_id TEXT NOT NULL, -- id from shop-detail
  tt_account TEXT, -- account from shop-detail
  tt_nickname TEXT, -- nickname from shop-detail
  tt_followers INTEGER, -- followers from shop-detail
  revenue NUMERIC(15, 2), -- revenue from shop-detail-total
  video_revenue NUMERIC(15, 2), -- revenue from shop-detail-total
  live_revenue NUMERIC(15, 2), -- revenue from shop-detail-total
  by_product TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE
);