"use server";

import TopStores from "@/stores/dtos/topStores";
import pool from "@/db/lib/db";

export async function getStores() {
  try {
    const result = await pool.query(
      "SELECT * FROM stores WHERE k_position IS NOT NULL"
    );
    const getStores = new TopStores(result?.rows);
    if (getStores?.stores) {
      return getStores?.stores;
    }
    return [];
  } catch (error) {
    console.error("Error fetching top stores:", error);
    throw new Error("Failed to fetch stores");
  }
}
