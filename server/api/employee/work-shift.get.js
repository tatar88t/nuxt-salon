import { pool } from "../db";

export default defineEventHandler(async (e) => {
  const body = await readBody(e);
  const { emp_id = 1 } = body;
  console.log(body, "BODY");

  const result = await pool.query(
    "SELECT * from work_shift WHERE emp_id = $1",
    []
  );
  console.log(result.rows[0]);
  return {
    data: result.rows,
  };
});
