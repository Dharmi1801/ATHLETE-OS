
require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const pool = require("./config/db");
const predictionRoutes = require('./routes/predictionRoutes');


const app = express();
app.use(cors());
app.use(express.json());




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
    const result = await pool.query('SELECT * FROM athlete_metrics WHERE user_id = $1', [userId]);
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
        dob = EXCLUDED.dob, gender = EXCLUDED.gender, location = EXCLUDED.location,
        primary_sport = EXCLUDED.primary_sport, specialization = EXCLUDED.specialization,
        pro_years = EXCLUDED.pro_years, height = EXCLUDED.height, weight = EXCLUDED.weight;
    `;
    await pool.query(query, [userId, dob, gender, location, primarySport, specialization, proYears, height, weight]);
    res.json({ success: true, message: "Profile saved successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Leaderboard API
app.get('/api/leaderboard', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM leaderboard ORDER BY rank_position ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Event Register API
app.post('/api/register-event', async (req, res) => {
  const { userId, eventName } = req.body;
  try {
    await pool.query('INSERT INTO event_registrations (user_id, event_name) VALUES ($1, $2)', [userId, eventName]);
    res.json({ success: true, message: "Successfully registered for the event!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Daily Fitness Log API
app.post('/api/fitness-log', async (req, res) => {
  const { userId, trainingDuration, sleepHours, painLevel, energyLevel } = req.body;
  try {
    await pool.query(
      `INSERT INTO daily_fitness_logs (user_id, training_duration, sleep_hours, pain_level, energy_level) VALUES ($1,$2,$3,$4,$5)`,
      [userId, trainingDuration, sleepHours, painLevel, energyLevel]
    );
    res.json({ success: true, message: "Today's data updated successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// injury prediction api
// Opportunities API
app.get('/api/opportunities', async (req, res) => {
  const { category } = req.query;
  try {
    let query = 'SELECT * FROM opportunities_events';
    let params = [];
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

app.post('/api/opportunities/register', async (req, res) => {
  const { userId, eventId } = req.body;
  try {
    await pool.query('INSERT INTO opportunity_registrations (user_id, event_id) VALUES ($1, $2)', [userId, eventId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ AI NUTRITION DIET PLAN API — Google Gemini (Free)
const { GoogleGenerativeAI } = require('@google/generative-ai');

app.post('/api/nutrition/diet-plan', async (req, res) => {
  const { goal, diet, sport } = req.body;

  if (!goal || !diet) {
    return res.status(400).json({ error: "Goal and diet type are required" });
  }

  const prompt = `You are an elite sports nutritionist AI for ATHLETE OS platform.
Generate a highly personalized daily diet plan for a professional athlete with the following profile:
- Performance Goal: ${goal}
- Dietary Type: ${diet}
- Sport: ${sport || 'General Athletic Training'}

Respond ONLY with a valid JSON object (no markdown, no explanation, no backticks) in this exact structure:
{
  "macros": {
    "cals": "2,840",
    "protein": "180g",
    "carbs": "320g",
    "fats": "65g",
    "width": "75%"
  },
  "meals": [
    {
      "time": "06:30 AM • PRE-WORKOUT",
      "cals": 320,
      "title": "Meal Name Here",
      "desc": "Short description of the meal with nutritional benefits. Max 2 sentences.",
      "tags": ["TAG1", "TAG2"],
      "color": "cyan",
      "timeSlot": "pre-workout"
    },
    {
      "time": "09:00 AM • BREAKFAST",
      "cals": 480,
      "title": "Meal Name Here",
      "desc": "Short description of the meal with nutritional benefits. Max 2 sentences.",
      "tags": ["TAG1", "TAG2"],
      "color": "green",
      "timeSlot": "breakfast"
    },
    {
      "time": "01:30 PM • LUNCH",
      "cals": 640,
      "title": "Meal Name Here",
      "desc": "Short description of the meal with nutritional benefits. Max 2 sentences.",
      "tags": ["TAG1", "TAG2"],
      "color": "green",
      "timeSlot": "lunch"
    },
    {
      "time": "05:00 PM • RECOVERY SNACK",
      "cals": 280,
      "title": "Meal Name Here",
      "desc": "Short description of the meal with nutritional benefits. Max 2 sentences.",
      "tags": ["TAG1", "TAG2"],
      "color": "red",
      "timeSlot": "snack"
    },
    {
      "time": "08:30 PM • DINNER",
      "cals": 580,
      "title": "Meal Name Here",
      "desc": "Short description of the meal with nutritional benefits. Max 2 sentences.",
      "tags": ["TAG1", "TAG2"],
      "color": "cyan",
      "timeSlot": "dinner"
    }
  ],
  "aiInsight": "A personalized 2-sentence AI insight about the athlete's nutrition plan mentioning specific nutrients and recovery tips based on their goal.",
  "supplements": [
    "Supplement 1 (dose)",
    "Supplement 2 (dose)",
    "Supplement 3 (dose)"
  ],
  "micronutrients": [
    { "name": "Nutrient Name", "status": "OPTIMAL", "level": 90 },
    { "name": "Nutrient Name", "status": "GOOD", "level": 70 },
    { "name": "Nutrient Name", "status": "LOW", "level": 40 },
    { "name": "Nutrient Name", "status": "CRITICAL", "level": 25 }
  ]
}

Rules:
- For ${diet} diet: ${diet === 'Veg' ? 'Use ONLY vegetarian ingredients (no meat, fish, eggs). Use paneer, tofu, legumes, dairy, nuts, seeds.' : 'Include lean meats, fish, eggs. Prefer chicken, salmon, tuna, turkey.'}
- For ${goal}: ${goal === 'Build Muscle' ? 'High protein (1.8-2g/kg), moderate carbs, caloric surplus.' : goal === 'Stamina' ? 'High carbs for glycogen, moderate protein, higher calories for endurance.' : 'Caloric deficit, high protein to preserve muscle, low carbs.'}
- Keep meal names creative and specific
- Tags must be SHORT (max 2 words, ALL CAPS)
- color field must be exactly one of: "cyan", "green", "red"
- width in macros should reflect caloric intake as % (40-95%)
- micronutrient level is a number 0-100
- micronutrient status must be one of: "OPTIMAL", "GOOD", "LOW", "CRITICAL"`;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(prompt);
    const rawText = result.response.text().trim();

    let dietPlan;
    try {
      const cleaned = rawText.replace(/```json|```/g, '').trim();
      dietPlan = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr, "\nRaw:", rawText);
      return res.status(500).json({ error: "Failed to parse AI response" });
    }

    res.json({ success: true, plan: dietPlan });

  } catch (err) {
    console.error("Diet plan generation error:", err);
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

/* ==============================
   🔥 MIDDLEWARE (ORDER IMPORTANT)
================================= */

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ==============================
   🔥 DEBUG BODY CHECK
================================= */
app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.url);
  console.log("BODY RECEIVED:", req.body);
  next();
});


app.use('/api', predictionRoutes); 
