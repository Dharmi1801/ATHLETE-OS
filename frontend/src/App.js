import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import AiCoach from './AiCoach';
import Profile from './Profile';
import Nutrition from './Nutrition';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/aicoach" element={<AiCoach />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/nutrition" element={<Nutrition/>} />
        
      </Routes>
    </Router>
  );
}
export default App;