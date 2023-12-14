import pg from "pg";

export const pool = new pg.Pool({
  host: "127.0.0.1",
  port: "8040",
  database: "salon",
  user: "postgres",
  password: "operationcwal",
});
