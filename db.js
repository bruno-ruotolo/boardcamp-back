import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const dbConfig = ({
  connectionString: process.env.DATABASE_URL
})

if (process.env.MODE === "PROD") {
  dbConfig.ssl = {
    rejectUnauthorized: false
  }
}

const db = new Pool(dbConfig);

export default db;