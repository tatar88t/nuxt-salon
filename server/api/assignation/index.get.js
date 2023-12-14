import { pool } from "../db";

export default defineEventHandler(async (e) => {
  const result = await pool.query("SELECT * from assignation");
  console.log(result.rows[0]);
  return {
    data: result.rows,
  };
});
