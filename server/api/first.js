import { pool } from "./db";

export default defineEventHandler(async (e) => {
  console.log("SMTH");
  const result = await pool.query("SELECT * from appuser");
  console.log(result.rows[0]);
  return {
    message: result.rows[0],
  };
});
