// server.js

require('dotenv').config(); // 🔥 IMPORTANT

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 ENV se DB connect
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.connect()
  .then(() => console.log("✅ Database Connected Successfully"))
  .catch(err => console.error("❌ Database Connection Failed:", err));

// ✅ LOGIN API (same)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );

    if (result.rows.length > 0) {
      res.json({ success: true, user: result.rows[0] });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DASHBOARD API
app.get('/api/dashboard/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM athlete_metrics WHERE user_id = $1',
      [userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ PROFILE UPDATE API
app.put('/api/profile/:userId', async (req, res) => {
  const { userId } = req.params;
  const { dob, gender, location, primarySport, specialization, proYears, height, weight } = req.body;

  try {
    const query = `
      INSERT INTO athlete_profiles 
      (user_id, dob, gender, location, primary_sport, specialization, pro_years, height, weight)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      ON CONFLICT (user_id)
      DO UPDATE SET 
        dob = EXCLUDED.dob,
        gender = EXCLUDED.gender,
        location = EXCLUDED.location,
        primary_sport = EXCLUDED.primary_sport,
        specialization = EXCLUDED.specialization,
        pro_years = EXCLUDED.pro_years,
        height = EXCLUDED.height,
        weight = EXCLUDED.weight;
    `;

    await pool.query(query, [
      userId, dob, gender, location,
      primarySport, specialization,
      proYears, height, weight
    ]);

    res.json({ success: true, message: "Profile saved successfully!" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔥 SERVER START
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});