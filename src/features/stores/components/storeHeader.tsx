"use client";

import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function StoreHeader({ storeId }: { storeId: string }) {
  const store = {
    name: "Always Fit",
    image: "/product-kit-image.jpg",
  };

  return (
    <div className="flex flex-row items-center p-8">
      <div>
        <img
          src={store.image || "/placeholder.svg"}
          alt={store.name}
          className="w-full h-full object-contain max-w-sm"
        />
      </div>
      <div className="ml-5">
        <h1 className="text-3xl font-bold mb-2">{store.name}</h1>
      </div>
    </div>
  );
}
