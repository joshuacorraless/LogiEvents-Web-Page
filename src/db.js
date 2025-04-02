import { createPool } from "mysql2/promise";

export const pool = createPool({
  host: "localhost",   // Database host 
  user: 'root',        // Database user
  password: '123456',        // Database password
  port: 3306,         // Database port
  database: 'chatbot_db'   // Database name

  })


