import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Injury.css';
import { 
  FiHome, FiCpu, FiCoffee, FiUser, FiSearch, FiBell, FiSettings, 
  FiActivity, FiAward, FiTarget, FiLogOut, FiChevronRight, 
  FiAlertTriangle, FiTrendingUp, FiCheckCircle 
} from 'react-icons/fi';

export default function Injury() {
  const navigate = useNavigate();
  const [active, setActive] = useState("injury");
  const userName = localStorage.getItem('userName') || 'Arjun S.';

  const [trainingDuration, setTrainingDuration] = useState(60);
  const [sleepHours, setSleepHours] = useState(7.5);
  const [painLevel, setPainLevel] = useState(4);
  const [energyLevel, setEnergyLevel] = useState('Moderate (Normal)');

  const handleLogout = () => {
    localStorage.clear(); 
    navigate('/'); 
  };

  const handleUpdateData = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId') || 1; 
      await axios.post('http://localhost:5000/api/fitness-log', {
        userId, trainingDuration, sleepHours, painLevel, energyLevel
      });
      alert("Today's data updated successfully! AI is analyzing your new metrics.");
    } catch (err) {
      alert("Data updated (UI Mode). Connect backend to save to DB.");
    }
  };

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
            <h4>{userName}</h4>
            <p>Pro Division I</p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <div className="top-bar">
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input type="text" placeholder="Search biometrics, logs, or insights..." />
          </div>
          <div className="top-actions">
            <FiBell className="icon" />
            <FiSettings className="icon" />
            <span className="live-tracking"><span className="dot text-cyan"></span> LIVE TRACKING</span>
          </div>
        </div>

        <div className="header-section">
          <p className="subtitle text-cyan" style={{letterSpacing: '1px', fontWeight: 'bold'}}>RECOVERY ANALYSIS</p>
          <h1 style={{fontSize: '32px', marginBottom: '8px'}}>Injury Risk Overview</h1>
          <p className="text-muted">Based on recent activity, posture, and fatigue.</p>
        </div>

        <div className="injury-grid">
          <div className="injury-left-col">
            
            <div className="card stability-card">
              <div className="radial-chart-container">
                <div className="radial-chart">
                  <div className="radial-inner">
                    <h2>65%</h2>
                    <p>RISK LEVEL</p>
                  </div>
                </div>
              </div>
              <div className="stability-info">
                <h3>Metric Stability Status</h3>
                <div className="pill-row">
                  <span className="status-pill pill-red"><span className="dot-red"></span> FATIGUE: HIGH</span>
                  <span className="status-pill pill-yellow"><span className="dot-yellow"></span> RECOVERY: LOW</span>
                  <span className="status-pill pill-green"><span className="dot-green"></span> LOAD: OPTIMAL</span>
                </div>
                <p className="text-muted" style={{fontSize: '13px', lineHeight: '1.5'}}>
                  Your cumulative workload is within safe zones, but sleep quality and heart rate variability suggest significant neural fatigue. Suggest active recovery cycle.
                </p>
              </div>
            </div>

            <div className="charts-row">
              <div className="card chart-card">
                <div className="card-header">
                  <h4>Weekly Training Load</h4>
                  <span>•••</span>
                </div>
                <div className="bar-chart">
                  <div className="bar bg-cyan" style={{height: '40%'}}><span>M</span></div>
                  <div className="bar bg-cyan" style={{height: '60%'}}><span>T</span></div>
                  <div className="bar bg-cyan" style={{height: '50%'}}><span>W</span></div>
                  <div className="bar bg-cyan" style={{height: '80%'}}><span>T</span></div>
                  <div className="bar bg-green" style={{height: '90%', boxShadow: '0 0 10px #00e676'}}><span>F</span></div>
                  <div className="bar bg-green" style={{height: '70%'}}><span>S</span></div>
                  <div className="bar bg-grey" style={{height: '20%'}}><span>S</span></div>
                </div>
              </div>

              <div className="card chart-card">
                <h4>Recovery Progress</h4>
                <div className="recovery-status">
                  <span className="text-muted" style={{fontSize: '12px'}}>Status: <span className="text-yellow">Partial</span></span>
                  <span className="text-yellow" style={{fontSize: '12px', fontWeight: 'bold'}}>45%</span>
                </div>
                <div className="progress-bar-container" style={{marginBottom: '20px'}}>
                  <div className="progress-bar-fill bg-yellow" style={{width: '45%'}}></div>
                </div>
                <div className="recovery-stats">
                  <div><p>HR</p><h4>72 BPM</h4></div>
                  <div><p>SLEEP</p><h4>7.2h</h4></div>
                  <div><p>ENERGY</p><h4>Med</h4></div>
                </div>
              </div>
            </div>

            <div className="card form-card">
              <h3 className="card-title"><FiActivity className="text-cyan" /> Daily Fitness Log</h3>
              <form onSubmit={handleUpdateData} className="fitness-form">
                <div className="form-grid-2">
                  <div className="input-group">
                    <label>TRAINING DURATION (MIN)</label>
                    <input type="number" value={trainingDuration} onChange={(e)=>setTrainingDuration(e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label>PAIN LEVEL (0-10)</label>
                    <div className="slider-container">
                      <input type="range" min="0" max="10" value={painLevel} onChange={(e)=>setPainLevel(e.target.value)} className="custom-slider" />
                      <span className="slider-value text-cyan">{painLevel}</span>
                    </div>
                  </div>
                  <div className="input-group">
                    <label>SLEEP HOURS</label>
                    <input type="number" step="0.1" value={sleepHours} onChange={(e)=>setSleepHours(e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label>ENERGY LEVEL</label>
                    <select value={energyLevel} onChange={(e)=>setEnergyLevel(e.target.value)}>
                      <option>High (Optimal)</option>
                      <option>Moderate (Normal)</option>
                      <option>Low (Fatigued)</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn-cyan-full">UPDATE TODAY'S DATA</button>
              </form>
            </div>

            <div className="card timeline-card">
              <h3>Injury History Timeline</h3>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-dot dot-red"></div>
                  <div className="timeline-content">
                    <p className="time-ago">4 WEEKS AGO</p>
                    <h4>Left Ankle Sprain</h4>
                    <p>Grade 1 sprain during lateral movement drills. Full range restored; focus on proprioception.</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot dot-cyan"></div>
                  <div className="timeline-content">
                    <p className="time-ago">3 MONTHS AGO</p>
                    <h4>Lower Back Strain</h4>
                    <p>Acute strain during deadlift PR attempt. Rehabilitated via core stabilization and mobility.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="injury-right-col">
            <div className="card insight-card">
              <h3 className="card-title-small"><span className="text-cyan">✦ AI Health Insights</span></h3>
              <div className="insight-list">
                <div className="insight-item">
                  <div className="icon-box bg-red-light"><FiAlertTriangle className="text-red"/></div>
                  <div>
                    <h4>High fatigue (34%)</h4>
                    <p>Central nervous system strain detected through grip strength and HR variability.</p>
                  </div>
                </div>
                <div className="insight-item">
                  <div className="icon-box bg-yellow-light"><FiTrendingUp className="text-yellow"/></div>
                  <div>
                    <h4>Knee risk increasing</h4>
                    <p>Joint loading symmetry deviated by 8% in today's squat session.</p>
                  </div>
                </div>
                <div className="insight-item">
                  <div className="icon-box bg-green-light"><FiCheckCircle className="text-green"/></div>
                  <div>
                    <h4>Sleep optimized (+12%)</h4>
                    <p>Consistent bedtime is improving REM cycle duration.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card protocol-card">
              <h3 style={{fontSize: '16px', marginBottom: '16px'}}>Recommended Protocol</h3>
              <div className="protocol-list">
                <div className="protocol-item">
                  <span>🌙 Rest 1-2 days</span> <FiChevronRight className="text-muted"/>
                </div>
                <div className="protocol-item">
                  <span>🧍 Focus on stretching</span> <FiChevronRight className="text-muted"/>
                </div>
                <div className="protocol-item">
                  <span>🚿 Contrast Hydrotherapy</span> <FiChevronRight className="text-muted"/>
                </div>
              </div>
            </div>

            <div className="workshop-card">
              <div className="workshop-img"></div>
              <div className="workshop-content">
                <h4>Recovery Workshop</h4>
                <p>Learn advanced fascial release techniques for lower extremity health.</p>
                <button className="btn-link text-cyan">VIEW TUTORIAL →</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}