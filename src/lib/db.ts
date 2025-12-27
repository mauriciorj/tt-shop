import { Pool, types } from "pg";

// Force numeric types (OID 1700) to be returned as numbers (floats) instead of strings.
// Note: This may lose precision for extremely large numbers, but is suitable for typical currency/counts in UI.
types.setTypeParser(1700, (val) => parseFloat(val));

const pool = new Pool({
  host: process.env.POSTGRES_HOST || "localhost",
  port: parseInt(process.env.POSTGRES_PORT || "5431"),
  user: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "mysecretpassword",
  database: process.env.POSTGRES_DB || "postgres",
});

export default pool;
