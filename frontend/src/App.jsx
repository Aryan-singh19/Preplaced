import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';

// Core Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// General Pages
import SignPage from './pages/SignPage';
import LandingPage from './pages/LandingPage';
import Aptitude from './pages/Aptitude';
import ResumeChecker from './pages/ResumeChecker';
import CourseAI from './pages/CourseAI';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Quiz from './pages/Quiz';

// Roadmap Pages
import RoadmapWrapper from './pages/RoadmapWrapper';
import RoadmapCatalog from './pages/RoadmapCatalog';
import FrontendRoadmap from './pages/FrontendRoadmap';
import BackendRoadmap from './pages/BackendRoadmap';
import FullStackRoadmap from './pages/FullStackRoadmap';
import DSARoadmap from './pages/DSARoadmap';
import OOPRoadmap from './pages/OOPRoadmap';
import DBMSRoadmap from './pages/DBMSRoadmap';
import DataAnalystRoadmap from './pages/DataAnalystRoadmap';
import MLRoadmap from './pages/MLRoadmap';
import GenAIRoadmap from './pages/GenAIRoadmap';
import PromptEngineerRoadmap from './pages/PromptEngineerRoadmap';
import CyberSecurityRoadmap from './pages/CyberSecurityRoadmap';

// Dynamic Mapping for Roadmaps
const ROADMAP_COMPONENTS = {
  frontend: <FrontendRoadmap />,
  backend: <BackendRoadmap />,
  fullstack: <FullStackRoadmap />,
  dsa: <DSARoadmap />,
  oops: <OOPRoadmap />,
  dbms: <DBMSRoadmap />,
  'data-analyst': <DataAnalystRoadmap />,
  'machine-learning': <MLRoadmap />,
  'generative-ai': <GenAIRoadmap />,
  'prompt-engineer': <PromptEngineerRoadmap />,
  'cyber-security': <CyberSecurityRoadmap />,
};

const Layout = ({ user, setUser, children }) => {
  const location = useLocation();
  const showNavbar = location.pathname !== '/';

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {showNavbar && <Navbar user={user} setUser={setUser} />}
      <main style={{ flexGrow: 1 }}>{children}</main>
      {showNavbar && <Footer />}
    </div>
  );
};

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);

  return (
    <Router>
      <Layout user={user} setUser={setUser}>
        <Routes>
          <Route path="/" element={<SignPage setUser={setUser} />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/aptitude" element={<Aptitude />} />
          <Route path="/resume-checker" element={<ResumeChecker />} />
          <Route path="/course-ai" element={<CourseAI />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/quiz/:subjectId" element={<Quiz />} />
          
          <Route path="/roadmaps" element={<RoadmapCatalog />} />
          <Route path="/roadmap/:id" element={<RoadmapWrapper />} />
          
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;