import { createPool } from "mysql2/promise";
import dotenv from 'dotenv';

dotenv.config();

export const pool = createPool({
  host: process.env.DB_HOST,   // Database host 
  user: process.env.DB_USER,        // Database user
  password: process.env.DB_PASSWORD,        // Database password
  port: process.env.DB_PORT,         // Database port
  database: process.env.DB_NAME   // Database name

  })


