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

// 1. Leaderboard Data Fetch Karne Ki API
app.get('/api/leaderboard', async (req, res) => {
    try {
        // Top se lekar bottom tak rank wise data bhejega
        const result = await pool.query('SELECT * FROM leaderboard ORDER BY rank_position ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Event Register Karne Ki API
app.post('/api/register-event', async (req, res) => {
    const { userId, eventName } = req.body;
    try {
        await pool.query(
            'INSERT INTO event_registrations (user_id, event_name) VALUES ($1, $2)', 
            [userId, eventName]
        );
        res.json({ success: true, message: "Successfully registered for the event!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Daily Fitness Log Save Karne Ki API
app.post('/api/fitness-log', async (req, res) => {
    const { userId, trainingDuration, sleepHours, painLevel, energyLevel } = req.body;
    
    try {
        await pool.query(
            `INSERT INTO daily_fitness_logs (user_id, training_duration, sleep_hours, pain_level, energy_level) 
             VALUES ($1, $2, $3, $4, $5)`,
            [userId, trainingDuration, sleepHours, painLevel, energyLevel]
        );
        res.json({ success: true, message: "Today's data updated successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 1. Fetch Events (Filter ke sath)
app.get('/api/opportunities', async (req, res) => {
    const { category } = req.query;
    try {
        let query = 'SELECT * FROM opportunities_events';
        let params = [];
        
        // Agar user ne 'All Events' ke alawa kuch select kiya hai
        if (category && category !== 'All Events') {
            query += ' WHERE category = $1';
            params.push(category);
        }
        
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Register for an Event
app.post('/api/opportunities/register', async (req, res) => {
    const { userId, eventId } = req.body;
    try {
        await pool.query(
            'INSERT INTO opportunity_registrations (user_id, event_id) VALUES ($1, $2)',
            [userId, eventId]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// for coach ai
app.use("/api/coach", require("./routes/coachRoutes"));

app.get("/", (req, res) => {
  res.send("Coach AI Backend Running");
});

// 🔥 SERVER START
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});