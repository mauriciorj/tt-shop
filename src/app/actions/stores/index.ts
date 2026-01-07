"use server";

import TopStores from "@/stores/dtos/topStores";
import pool from "@/db/lib/db";

export async function getStores(page: number = 1, limit: number = 10) {
  try {
    const offset = (page - 1) * limit;
    const result = await pool.query(
      `SELECT *, count(*) OVER() as total_count FROM stores WHERE k_position IS NOT NULL ORDER BY k_position ASC LIMIT $1 OFFSET $2`,
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
