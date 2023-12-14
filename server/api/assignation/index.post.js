import { pool } from "../db";

export default defineEventHandler(async (e) => {
  //   const now = new Date();

  const body = await readBody(e);
  const { client_name, phone, assign_dt, services, emp_id, work_shift_id } =
    body;
  console.log(body, "BODY");
  const insertText =
    "INSERT INTO assignation(client_name, phone, assign_dt, services, emp_id, work_shift_id) VALUES ($1, $2, $3, $4, $5, $6)";
  await pool.query(insertText, [
    client_name,
    phone,
    assign_dt,
    services,
    emp_id,
    work_shift_id,
  ]);

  const result = await pool.query("SELECT * from assignation");

  console.log(result.rows[0]);

  return {
    message: result.rows[0],
  };
});
