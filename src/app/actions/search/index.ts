"use server";

import pool from "@/db/lib/db";
import TopStores from "@/stores/dtos/topStores";
import TopProducts from "@/products/dtos/topProducts";

export async function searchStores(query: string) {
  try {
    if (!query) return [];

    const result = await pool.query(
      "SELECT * FROM top_stores WHERE name ILIKE $1",
      [`%${query}%`]
    );
    const topStores = new TopStores(result?.rows);
    return topStores?.stores || [];
  } catch (error) {
    console.error("Error searching stores:", error);
    return [];
  }
}

export async function searchProducts(query: string) {
  try {
    if (!query) return [];

    const result = await pool.query(
      "SELECT * FROM top_products WHERE name ILIKE $1",
      [`%${query}%`]
    );
    const topProducts = new TopProducts(result?.rows);
    return topProducts?.products || [];
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
}
