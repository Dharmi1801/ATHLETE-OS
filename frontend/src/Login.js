import React, { useState } from "react"; // ✅ fix
import { useNavigate } from "react-router-dom";
import axios from "axios"; // ✅ fix
import "./LoginPage.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    // Variable define karo jo check karega ki website live hai ya local laptop par
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const res = await axios.post(`${API_BASE_URL}/api/login`, {
  email,
  password,
});// Login.js ke andar API call ke baad:

if (res.data.success) {
   // User ID ko local storage me save karo
   localStorage.setItem('userId', res.data.user.id); // Database wala ID yahan set hoga
   localStorage.setItem('userName', res.data.user.full_name); 
   navigate('/dashboard');
}

    if (res.data.success) {
      alert("Login Success ✅");

      localStorage.setItem("user", JSON.stringify(res.data.user)); // ✅ store user

      console.log(res.data);

      navigate("/dashboard"); // ✅ redirect
    }
  } catch (err) {
    alert("Login Failed ❌");
  }
};

  return (
    <div className="container">
      {/* LEFT SIDE */}
      <div className="left">
        <h4 className="logo">ATHLETE OS</h4>

        <h1 className="title">
          Empowering <br />
          Every <span>Athlete’s</span> <br />
          Journey with AI
        </h1>

        <p className="subtitle">
          Access your personalized biomechanical engine.
          Precision metrics for the next generation of performance.
        </p>

        <div className="card">
          <p>ACTIVE TRACKING</p>
          <h2>142 BPM ❤️</h2>
          <div className="progress"></div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="right">
        <h2>Initialize Session</h2>
        <p className="desc">
          Sign in to sync your performance profile.
        </p>

        {/* ✅ form fix */}
        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            placeholder="name@athleteos.ai"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="btn">
            INITIALIZE SESSION
          </button>
        </form>

        <div className="divider">OR AUTHENTICATE VIA</div>

        <button className="google-btn">
          Continue with Google
        </button>

        <p className="apply">
          New operative? <span>Apply for Access</span>
        </p>
      </div>
    </div>
  );
};

export default Login; // ✅ fix