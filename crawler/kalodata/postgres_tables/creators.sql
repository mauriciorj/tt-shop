CREATE TABLE creators (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  tt_account TEXT, -- account from shop-detail
  tt_nickname TEXT, -- nickname from shop-detail
  tt_followers INTEGER, -- followers from shop-detail
  k_id TEXT NOT NULL, -- id from shop-detail
  k_revenue NUMERIC(15, 2), -- revenue from shop-detail-total
  k_video_revenue NUMERIC(15, 2), -- revenue from shop-detail-total
  k_live_revenue NUMERIC(15, 2), -- revenue from shop-detail-total
  k_by_product TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE
);