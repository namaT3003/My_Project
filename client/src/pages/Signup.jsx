import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save user to localStorage
    const user = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      streak: 7,
      xp: 1200,
      isPremium: false
    };
    
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    
    navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <div className="auth-brand-panel">
          <div className="auth-brand-badge">🚀 SkillMentor</div>
          <h2>Join SkillMentor</h2>
          <p>Create your account and start your learning journey today.</p>
        </div>

        <div className="auth-form-card">
          <h1>Sign Up</h1>
          <p className="auth-subtext">Create your account to get started</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Select Your Role</label>
              <select name="role" value={formData.role} onChange={handleChange} required>
                <option value="student">👤 Student</option>
                <option value="mentor">🎯 Mentor</option>
              </select>
            </div>

            <button type="submit" className="primary-btn full-width">
              Create Account
            </button>
          </form>

          <div className="auth-switch">
            Already have an account? <a href="/login">Sign in</a>
          </div>
        </div>
      </div>
    </div>
  );
}