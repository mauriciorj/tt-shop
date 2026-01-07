"use server";

import TopStores from "@/stores/dtos/topStores";
import pool from "@/db/lib/db";

export async function getStores(
  page: number = 1,
  limit: number = 10,
  sortBy: string = "k_position",
  order: "asc" | "desc" = "asc"
) {
  try {
    const offset = (page - 1) * limit;

    // Validate sortBy column
    const validColumns = [
      "k_position",
      "revenue",
      "revenue_growth_rate",
      "sales",
      "day_sales",
    ];
    const sortColumn = validColumns.includes(sortBy) ? sortBy : "k_position";
    const sortOrder = order === "asc" ? "ASC" : "DESC";

    const result = await pool.query(
      `SELECT *, count(*) OVER() as total_count FROM stores WHERE k_position IS NOT NULL ORDER BY ${sortColumn} ${sortOrder} LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    const getStores = new TopStores(result?.rows);
    if (getStores?.stores) {
      return {
        data: getStores?.stores,
        total: parseInt(result.rows[0]?.total_count || "0", 10),
      };
    }
    return { data: [], total: 0 };
  } catch (error) {
    console.error("Error fetching top stores:", error);
    throw new Error("Failed to fetch stores");
  }
}
