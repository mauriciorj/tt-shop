"use server";

import TopProducts from "@/products/dtos/topProducts";
import pool from "@/db/lib/db";

export async function getProducts(
  page: number = 1,
  limit: number = 10,
  sortBy: string = "k_revenue",
  order: "asc" | "desc" = "asc"
) {
  try {
    const offset = (page - 1) * limit;

    // Validate sortBy column
    const validColumns = [
      "k_revenue",
      "k_revenue_growth_rate",
      "sales",
      "day_sales",
    ];
    const sortColumn = validColumns.includes(sortBy) ? sortBy : "k_revenue";
    const sortOrder = order === "asc" ? "ASC" : "DESC";

    const result = await pool.query(
      `SELECT *, count(*) OVER() as total_count FROM products ORDER BY ${sortColumn} ${sortOrder} LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    const getProducts = new TopProducts(result?.rows);
    if (getProducts?.products) {
      return {
        data: getProducts?.products,
        total: parseInt(result.rows[0]?.total_count || "0", 10),
      };
    }
    return { data: [], total: 0 };
  } catch (error) {
    console.error("Error fetching top stores:", error);
    throw new Error("Failed to fetch stores");
  }
}
