"use server";

import TopProducts from "@/products/dtos/topProducts";
import pool from "@/db/lib/db";

export async function getProducts() {
  try {
    const result = await pool.query(
      "SELECT * FROM products WHERE k_position IS NOT NULL"
    );
    const getProducts = new TopProducts(result?.rows);
    if (getProducts?.products) {
      return getProducts?.products;
    }
    return [];
  } catch (error) {
    console.error("Error fetching top stores:", error);
    throw new Error("Failed to fetch stores");
  }
}
