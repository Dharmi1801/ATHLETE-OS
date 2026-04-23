const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Neon/Render ke liye zaroori hai
  },
  // ⚡ Connection settings taaki server hang na ho
  max: 20,              // Ek saath max 20 connections
  idleTimeoutMillis: 30000, // 30 sec idle rehne par connection close kar do
  connectionTimeoutMillis: 2000, // 2 sec mein connect nahi hua toh error de do
});

// 🔥 CRITICAL: Yeh listener server ko crash hone se bachayega
pool.on('error', (err) => {
  console.error('⚠️ Unexpected error on idle database client:', err.message);
  // Hum server ko exit nahi hone denge (no process.exit)
});

// Test connection
pool.query('SELECT NOW()')
  .then(() => console.log("✅ Neon PostgreSQL Connected & Ready"))
  .catch(err => console.error("❌ DB Connection Error:", err.message));

module.exports = pool;