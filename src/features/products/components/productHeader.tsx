"use client";

import { Star, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ProductHeader({ productId }: { productId: string }) {
  const product = {
    name: "Kit ProMágnesís + FISSIB",
    price: "$13.71",
    rating: 4.8,
    reviews: 2451,
    image: "/product-kit-image.jpg",
    store: "Always Fit",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="flex items-center justify-center bg-muted rounded-lg p-8">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-contain max-w-sm"
        />
      </div>
      <div className="flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <Badge variant="secondary" className="px-4 py-2">
            <h2 className="text-xl font-bold">{product.store}</h2>
          </Badge>
        </div>
        <div className="my-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating} ({product.reviews.toLocaleString()} avaliações)
            </span>
          </div>
          <div className="text-sm mt-1">
            <span>
              <b>Categoria:</b> Saúde
            </span>
          </div>
        </div>
        {/* Price */}
        <div>
          <span className="text-3xl font-bold text-blue-600">
            {product.price}
          </span>
        </div>
      </div>
    </div>
  );
}
