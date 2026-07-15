import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SignPage.css';

const SignPage = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }
    if (!isLogin && !formData.name) {
      setError('Please enter your full name.');
      return;
    }

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Authentication failed. Please try again.');
      }

      // Store user and token
      localStorage.setItem('user', JSON.stringify(data.user));
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      setUser(data.user);   // update App state → Navbar will show user info
      navigate('/landing');
    } catch (err) {
      setError(err.message || 'An error occurred during authentication.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <div className="auth-logo">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
            <path d="M3 12L6 7L9 10L11 7L14 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="8" cy="4" r="1.5" fill="white"/>
          </svg>
        </div>

        <h1>{isLogin ? 'Welcome back' : 'Create account'}</h1>
        <p className="auth-subtitle">Your AI-powered placement companion</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleAuth}>
          {!isLogin && (
            <div className="input-group">
              <label>Full name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="input-group">
            <label>Email address</label>
            <input
              type="email"
              name="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-btn">
            {isLogin ? 'Sign in' : 'Sign up'}
          </button>
        </form>

        <p className="toggle-auth">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span onClick={() => { setIsLogin(!isLogin); setError(''); }}>
            {isLogin ? 'Sign up' : 'Sign in'}
          </span>
        </p>

      </div>
    </div>
  );
};

export default SignPage;