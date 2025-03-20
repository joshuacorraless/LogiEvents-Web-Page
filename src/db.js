import { createPool } from "mysql2/promise";

export const pool = createPool({
  host: "localhost",   // Database host 
  user: 'root',        // Database user
  password: 'charlie',        // Database password
  port: 3306,         // Database port
  database: 'reque'   // Database name

  })


