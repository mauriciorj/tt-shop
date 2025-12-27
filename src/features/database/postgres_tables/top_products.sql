CREATE TABLE top_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  k_id TEXT NOT NULL, -- id from product-queryList
  position INTEGER,
  product_id UUID REFERENCES products(id), -- Linked to products table
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
