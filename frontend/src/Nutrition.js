import React, { useState } from 'react';
import './Nutrition.css';
import { useNavigate } from "react-router-dom";
import { FiHome, FiCpu, FiCoffee, FiUser, FiSearch, FiBell, FiSettings, FiCheckCircle, FiAlertCircle, FiZap, FiPlus, FiActivity, FiAward, FiTarget, FiLogOut } from 'react-icons/fi';
import { BiTargetLock, BiLeaf } from 'react-icons/bi';
import { MdOutlineSetMeal } from 'react-icons/md';

export default function Nutrition() {
  const [active, setActive] = useState("nutrition");

  // 1. Interactive States
  const [goal, setGoal] = useState('Build Muscle');
  const [diet, setDiet] = useState('Veg');
  const navigate = useNavigate();

const handleLogout = () => {
  // 🔥 localStorage clear
  localStorage.removeItem("userId");

  // (optional) sab clear karna ho to:
  // localStorage.clear();

  // 🔥 redirect to login page
  navigate("/");
};
  // 2. Dynamic Data Logic (Goal change hone par Macros change honge)
  const nutritionStats = {
    'Build Muscle': { cals: '2,840', protein: '180g', carbs: '320g', fats: '65g', width: '75%' },
    'Stamina': { cals: '3,200', protein: '140g', carbs: '450g', fats: '85g', width: '90%' },
    'Cut Weight': { cals: '1,950', protein: '160g', carbs: '150g', fats: '55g', width: '40%' }
  };

  // 3. Dynamic Meals Logic (Veg/Non-Veg change hone par Meals change honge)
  const mealsData = {
    'Veg': [
      { time: '06:30 AM • PRE-WORKOUT', cals: 320, title: 'Chilled Sattu Power Blast', desc: "Bihar's legacy fuel. High fiber, sustained release carbs with 15g protein.", tags: ['HYDRATION+', 'ALKALINE'], color: 'cyan', bg: 'bg-sattu' },
      { time: '01:30 PM • POST-LUNCH FUEL', cals: 640, title: 'Ragi Rotis & Sprouted Moong', desc: "Finger millet energy with protein-packed sprouts and seasonal greens.", tags: ['CALCIUM RICH', 'GLUTEN FREE'], color: 'green', bg: 'bg-ragi' },
      { time: '05:00 PM • RECOVERY SNACK', cals: 280, title: 'Grilled Peri-Peri Paneer', desc: "150g Fresh Paneer sautéed with cold-pressed olive oil and local spices.", tags: ['CASEIN PROTEIN', 'LOW GI'], color: 'red', bg: 'bg-paneer' }
    ],
    'Non-Veg': [
      { time: '06:30 AM • PRE-WORKOUT', cals: 350, title: 'Egg Whites & Oatmeal', desc: "Classic athletic breakfast. Fast-absorbing protein and complex carbs.", tags: ['HIGH PROTEIN', 'SUSTAINED ENERGY'], color: 'cyan', bg: 'bg-eggs' },
      { time: '01:30 PM • POST-LUNCH FUEL', cals: 680, title: 'Grilled Chicken & Quinoa', desc: "Lean chicken breast with fiber-rich quinoa and steamed broccoli.", tags: ['LEAN MUSCLE', 'IRON RICH'], color: 'green', bg: 'bg-chicken' },
      { time: '05:00 PM • RECOVERY SNACK', cals: 320, title: 'Pan-Seared Salmon', desc: "Rich in Omega-3 fatty acids for joint recovery and CNS repair.", tags: ['OMEGA-3', 'JOINT HEALTH'], color: 'red', bg: 'bg-salmon' }
    ]
  };

  const currentStats = nutritionStats[goal];
  const currentMeals = mealsData[diet];

  return (
    <div className="dashboard-container">
      
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo-section">
          <h2>ATHLETE OS</h2>
          <span>ELITE PERFORMANCE</span>
        </div>
        <nav className="side-nav">
                  <div className={`nav-item ${active === "dash" ? "active" : ""}`} onClick={() => { setActive("dash"); navigate("/dashboard"); }}><FiHome /> Dashboard</div>
                  <div className={`nav-item ${active === "aicoach" ? "active" : ""}`} onClick={() => { setActive("aicoach"); navigate("/aicoach"); }}><FiCpu /> AI Coach</div>
                  <div className={`nav-item ${active === "nutrition" ? "active" : ""}`} onClick={() => { setActive("nutrition"); navigate("/nutrition"); }}><FiCoffee /> Nutrition</div>
                  <div className={`nav-item ${active === "injury" ? "active" : ""}`} onClick={() => { setActive("injury"); navigate("/injury"); }}><FiActivity /> Injury</div>
                  <div className={`nav-item ${active === "ranking" ? "active" : ""}`} onClick={() => { setActive("ranking"); navigate("/ranking"); }}><FiAward /> Ranking</div>
                  <div className={`nav-item ${active === "opportunities" ? "active" : ""}`} onClick={() => { setActive("opportunities"); navigate("/opportunities"); }}><FiTarget /> Opportunities</div>
                  <div className={`nav-item ${active === "profile" ? "active" : ""}`} onClick={() => { setActive("profile"); navigate("/profile"); }}><FiUser /> Profile</div>
                  <div className="nav-item logout" onClick={handleLogout} style={{ marginTop: 'auto', color: '#ff5252', cursor: 'pointer' }}><FiLogOut /> Logout</div>
                </nav>
        <div className="user-profile-mini">
          <div className="avatar"></div>
          <div className="user-info">
            <h4>Arjun Singh</h4>
            <p>Pro Athlete</p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        
        {/* TOP BAR */}
        <header className="top-bar">
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input type="text" placeholder="Search foods or macros..." />
          </div>
          <div className="top-actions">
            <FiBell className="icon" />
            <FiSettings className="icon" />
            <span className="system-status text-muted">CURRENT PHASE: <span className="text-cyan font-bold" style={{marginLeft: '6px'}}>HYPERTROPHY II</span></span>
          </div>
        </header>

        {/* NUTRITION 3-COLUMN GRID */}
        <div className="nutrition-grid">
          
          {/* ================= LEFT COLUMN ================= */}
          <div className="nutri-left-col">
            
            {/* Performance Goal */}
            <div className="card">
              <h3 className="card-title-small"><BiTargetLock className="text-cyan" size={18}/> PERFORMANCE GOAL</h3>
              <div className="interactive-btn-group">
                <button className={`inter-btn ${goal === 'Build Muscle' ? 'active-cyan' : ''}`} onClick={() => setGoal('Build Muscle')}>
                  Build Muscle <FiZap />
                </button>
                <button className={`inter-btn ${goal === 'Stamina' ? 'active-cyan' : ''}`} onClick={() => setGoal('Stamina')}>
                  Stamina
                </button>
                <button className={`inter-btn ${goal === 'Cut Weight' ? 'active-cyan' : ''}`} onClick={() => setGoal('Cut Weight')}>
                  Cut Weight
                </button>
              </div>
            </div>

            {/* Dietary Type */}
            <div className="card">
              <h3 className="card-title-small"><BiLeaf className="text-green" size={18}/> DIETARY TYPE</h3>
              <div className="diet-toggle-box">
                <div className={`diet-box ${diet === 'Veg' ? 'active-veg' : ''}`} onClick={() => setDiet('Veg')}>
                  <BiLeaf size={24} />
                  <span>VEG</span>
                </div>
                <div className={`diet-box ${diet === 'Non-Veg' ? 'active-nonveg' : ''}`} onClick={() => setDiet('Non-Veg')}>
                  <MdOutlineSetMeal size={24} />
                  <span>NON-VEG</span>
                </div>
              </div>
            </div>

            {/* Metabolic Rate */}
            <div className="card">
              <p className="text-muted" style={{fontSize: '10px', letterSpacing: '1px', marginBottom: '8px'}}>REAL-TIME SYNC</p>
              <h3 className="card-title-small" style={{marginBottom: '10px'}}>METABOLIC RATE</h3>
              <h1 className="text-cyan" style={{fontSize: '36px', transition: '0.3s'}}>{currentStats.cals} <span style={{fontSize: '14px', color: '#8a93a6'}}>kcal/day</span></h1>
              <div className="progress-bar-container" style={{marginTop: '15px'}}>
                <div className="progress-bar-fill" style={{width: currentStats.width, transition: 'width 0.5s ease'}}></div>
              </div>
            </div>

          </div>

          {/* ================= CENTER COLUMN (Macros & Meals) ================= */}
          <div className="nutri-center-col">
            
            {/* Macros Row */}
            <div className="macros-row">
              <div className="macro-box border-top-cyan">
                <p>PROTEIN</p>
                <h2>{currentStats.protein}</h2>
                <div className="macro-line line-cyan"></div>
              </div>
              <div className="macro-box border-top-green">
                <p>CARBS</p>
                <h2>{currentStats.carbs}</h2>
                <div className="macro-line line-green"></div>
              </div>
              <div className="macro-box border-top-red">
                <p>FATS</p>
                <h2>{currentStats.fats}</h2>
                <div className="macro-line line-red"></div>
              </div>
            </div>

            <div className="fuel-plan-header">
              <h2>Daily Fuel Plan</h2>
              <span className="date-badge">WEDNESDAY, OCT 25</span>
            </div>

            {/* Dynamic Meal List */}
            <div className="meal-list">
              {currentMeals.map((meal, index) => (
                <div className={`meal-card border-left-${meal.color}`} key={index}>
                  <div className={`meal-img-box ${meal.bg}`}></div>
                  <div className="meal-info">
                    <div className="meal-time-row">
                      <span className={`text-${meal.color} meal-time`}>{meal.time}</span>
                      <span className="meal-cals">{meal.cals} <br/><small>KCAL</small></span>
                    </div>
                    <h3>{meal.title}</h3>
                    <p>{meal.desc}</p>
                    <div className="meal-tags">
                      {meal.tags.map((tag, i) => <span key={i}>{tag}</span>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* ================= RIGHT COLUMN (Insights) ================= */}
          <div className="nutri-right-col">
            
            {/* Micronutrient Radar */}
            <div className="card">
              <h3 style={{marginBottom: '20px', fontSize: '16px'}}>Micronutrient Radar</h3>
              <div className="micro-item">
                <div className="micro-icon bg-cyan-light"><FiZap className="text-cyan"/></div>
                <div className="micro-details">
                  <div className="micro-text"><span>Vitamin D3</span> <span className="text-green">OPTIMAL</span></div>
                  <div className="micro-bar-bg"><div className="micro-bar-fill bg-green" style={{width: '90%'}}></div></div>
                </div>
              </div>
              <div className="micro-item">
                <div className="micro-icon bg-red-light"><FiAlertCircle className="text-red"/></div>
                <div className="micro-details">
                  <div className="micro-text"><span>Ferritin / Iron</span> <span className="text-red">CRITICAL</span></div>
                  <div className="micro-bar-bg"><div className="micro-bar-fill bg-red" style={{width: '30%'}}></div></div>
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div className="card ai-insight-card">
              <h3 className="card-title-small"><span className="text-cyan">✦ ATHLETE OS AI</span></h3>
              <p className="ai-quote">
                "Arjun, your recovery metrics from Oura show a slight dip. I've increased the magnesium-rich content in your dinner plan. Stick to the <span className="text-cyan">Ashwagandha Moon Milk</span> tonight."
              </p>
              <button className="btn-outline-cyan">MODIFY PLAN</button>
            </div>

            {/* Supplement Stack */}
            <div className="card">
              <h3 style={{marginBottom: '16px', fontSize: '16px'}}>Supplement Stack</h3>
              <ul className="supp-list">
                <li><FiCheckCircle className="text-cyan"/> Creatine Monohydrate (5g)</li>
                <li><FiCheckCircle className="text-cyan"/> Omega-3 Fish Oil (2000mg)</li>
                <li className="text-muted"><div className="empty-circle"></div> ZMA (Pre-Bed)</li>
              </ul>
            </div>

            <div className="fab-button"><FiPlus size={28} /></div>

          </div>
        </div>
      </main>
    </div>
  );
}