import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './AiCoach.css';
import { 
  FiHome, FiCpu, FiCoffee, FiUser, FiSearch, FiBell, FiSettings, 
  FiActivity, FiAward, FiTarget, FiLogOut, FiTrendingUp, FiChevronDown,
  FiX, FiCamera, FiUpload, FiPlay, FiCheckCircle, FiAlertTriangle, FiInfo 
} from 'react-icons/fi';
export default function AiCoach() {
  const [active, setActive] = useState("aicoach");
  const [videoSrc, setVideoSrc] = useState(null); // Uploaded video ke liye
  const [isCameraActive, setIsCameraActive] = useState(false); // Camera chal raha hai ya nahi
  const [stream, setStream] = useState(null); // Camera ka live data

const navigate = useNavigate();


const handleLogout = () => {
  // 🔥 localStorage clear
  localStorage.removeItem("userId");

  // (optional) sab clear karna ho to:
  // localStorage.clear();

  // 🔥 redirect to login page
  navigate("/");
};
  const fileInputRef = useRef(null);
  const liveVideoRef = useRef(null); // Live camera ko screen par dikhane ke liye ref

  // 1. Upload Video ka logic
  const handleUploadClick = () => {
    stopCamera(); // Agar camera chal raha hai toh band kar do
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setVideoSrc(videoUrl);
      setIsCameraActive(false);
    }
  };

  // 2. Live Camera shuru karne ka logic
  const startCamera = async () => {
    try {
      // Pehle uploaded video hata do
      setVideoSrc(null); 
      
      // Browser se camera ki permission maango
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setIsCameraActive(true);
      
    } catch (err) {
      alert("Camera permission denied! Please allow camera access in your browser settings.");
      console.error("Camera Error:", err);
    }
  };

  // 3. Camera band karne ka logic
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop()); // Camera ki light band kar dega
      setStream(null);
    }
    setIsCameraActive(false);
  };

  // Jab isCameraActive true ho, toh video tag me stream daal do
  useEffect(() => {
    if (isCameraActive && liveVideoRef.current && stream) {
      liveVideoRef.current.srcObject = stream;
    }
  }, [isCameraActive, stream]);

  // Jab user page chhod kar jaye, toh automatically camera band ho jaye
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

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
            <h4>Arjun V.</h4>
            <p>Pro Sprinter</p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        
        <header className="top-bar">
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input type="text" placeholder="Search biomechanics sessions..." />
          </div>
          <div className="top-actions">
            <FiBell className="icon" />
            <FiSettings className="icon" />
          </div>
        </header>

        {/* PAGE HEADER */}
        <div className="header-section ai-header">
          <div>
            <h1>AI Biomechanics <span className="text-cyan">Coach</span></h1>
            <p className="subtitle" style={{textTransform: 'none', fontSize: '13px', marginTop: '5px'}}>
              Session: Dynamic Squat Depth Analysis • Oct 24, 2023
            </p>
          </div>
          
          <input 
            type="file" 
            accept="video/mp4,video/x-m4v,video/*" 
            style={{ display: 'none' }} 
            ref={fileInputRef} 
            onChange={handleFileChange} 
          />
          
          {/* ACTION BUTTONS (Camera & Upload) */}
          <div className="header-action-buttons">
            {isCameraActive ? (
              <button className="btn-outline-red flex-btn" onClick={stopCamera}>
                <FiX /> Stop Camera
              </button>
            ) : (
              <button className="btn-outline-cyan flex-btn" onClick={startCamera}>
                <FiCamera /> Use Camera
              </button>
            )}
            
            <button className="btn-primary flex-btn" onClick={handleUploadClick}>
              <FiUpload /> Upload Video
            </button>
          </div>
        </div>

        {/* MAIN LAYOUT GRID */}
        <div className="ai-content-grid">
          
          {/* LEFT COLUMN - VIDEO & METRICS */}
          <div className="left-column">
            
            <div className="video-player-card">
              <div className="video-placeholder">
                
                {/* CONDITIONAL RENDERING: Live Camera OR Uploaded Video OR Placeholder */}
                {isCameraActive ? (
                  <video 
                    ref={liveVideoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', transform: 'scaleX(-1)' }} 
                    /* transform: scaleX(-1) mirror effect deta hai taaki camera natural lage */
                  />
                ) : videoSrc ? (
                  <video 
                    src={videoSrc} 
                    controls 
                    autoPlay 
                    style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px', backgroundColor: '#000' }}
                  />
                ) : (
                  <>
                    <div className="play-button-large"><FiPlay /></div>
                    <div className="skeleton-line"><span className="angle-text text-cyan">84.2°</span></div>
                  </>
                )}
                
              </div>
              
              <div className="video-controls">
                <button className="play-btn-small"><FiPlay /></button>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill"></div>
                  <div className="progress-dot"></div>
                </div>
                <span className="time-text">00:42 / 01:15</span>
              </div>
            </div>

            <div className="video-metrics-row">
              <div className="metric-box border-green">
                <p>DEPTH QUALITY</p>
                <h3>94% <FiCheckCircle className="text-green icon-right" /></h3>
              </div>
              <div className="metric-box border-red">
                <p>KNEE DRIFT</p>
                <h3>Moderate <FiAlertTriangle className="text-red icon-right" /></h3>
              </div>
              <div className="metric-box border-green">
                <p>SPINE ANGLE</p>
                <h3>Optimal <FiActivity className="text-green icon-right" /></h3>
              </div>
              <div className="metric-box border-cyan">
                <p>PEAK FORCE</p>
                <h3>2.4 kN <span className="text-cyan icon-right">⚡</span></h3>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - FEEDBACK & SUGGESTIONS */}
          <div className="right-column">
            <div className="card feedback-card">
              <h3>📊 Live Analysis Feedback</h3>
              <div className="feedback-pills">
                <div className="pill pill-green"><span className="dot-green"></span> Back alignment perfect</div>
                <div className="pill pill-red"><span className="dot-red"></span> Knee angle incorrect</div>
                <div className="pill pill-green"><span className="dot-green"></span> Foot pressure centered</div>
                <div className="pill pill-grey"><span className="dot-cyan"></span> Hip hinge detected</div>
              </div>
            </div>

            <div className="card suggestions-card">
              <h3>AI Coach Suggestions</h3>
              <p className="subtitle-text">Actionable improvements for your next set</p>
              <div className="suggestion-list">
                <div className="suggestion-item">
                  <div className="icon-circle icon-cyan"><FiInfo /></div>
                  <div>
                    <h4>Adjust Stance Width</h4>
                    <p>Widening your stance by 2-3 inches will reduce the shear force on your patellar tendon during descent.</p>
                  </div>
                </div>
                <div className="suggestion-item">
                  <div className="icon-circle icon-cyan"><FiCheckCircle /></div>
                  <div>
                    <h4>Core Bracing Priority</h4>
                    <p>Detected slight lumbar rounding at the bottom of the rep. Focus on 360-degree intra-abdominal pressure.</p>
                  </div>
                </div>
              </div>
              <button className="btn-outline-cyan">Generate Detailed PDF Report</button>
            </div>

            <div className="card hr-card">
              <div className="hr-header">
                <p>HEART RATE SYNC</p>
                <span className="live-status"><span className="dot"></span> LIVE</span>
              </div>
              <h2>142 <span>BPM</span></h2>
              <div className="hr-bars">
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar active-bar"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}