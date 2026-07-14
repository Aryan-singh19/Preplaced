import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = ({ user, setUser }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { to: '/landing', label: 'Home' },
    { to: '/course-ai', label: 'Course' },
    { to: '/resume-checker', label: 'Resume' },
    { to: '/roadmaps', label: 'Roadmaps' },
    { to: '/aptitude', label: 'Practice' },
  ];

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'U';


  const handleLogout = () => {
    setUser(null); // remove user from state
    localStorage.removeItem("user"); // optional if stored
    navigate('/'); // redirect to signup page
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <div className="nav-logo-icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 12L6 7L9 10L11 7L14 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="8" cy="4" r="1.5" fill="white"/>
          </svg>
        </div>
        PlaceMate.AI
      </div>

      <ul className="nav-links">
        {links.map(({ to, label }) => (
          <li key={to}>
            <Link
              replace={to === '/landing'}
              to={to}
              className={location.pathname === to ? 'active' : ''}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="nav-user">
        {user && (
          <div className="nav-user-info">
            <span className="nav-user-name">{user.name}</span>
            <span className="nav-user-meta">{user.branch} · {user.year}</span>
          </div>
        )}
        <div className="nav-avatar">{initials}</div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;