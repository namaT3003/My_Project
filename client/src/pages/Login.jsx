import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (user && user.email === formData.email && user.password === formData.password) {
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      navigate('/dashboard');
      return;
    }

    setError('Invalid email or password. Please try again.');
  };

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <div className="auth-brand-panel">
          <div className="auth-brand-badge">🚀 SkillMentor</div>
          <h2>Welcome Back</h2>
          <p>Sign in to continue your learning journey.</p>
        </div>

        <div className="auth-form-card">
          <h1>Sign In</h1>
          <p className="auth-subtext">Enter your credentials to access your account</p>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
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
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="primary-btn full-width">
              Sign In
            </button>
          </form>

          <div className="auth-switch">
            Don't have an account? <a href="/signup">Create one</a>
          </div>
        </div>
      </div>
    </div>
  );
}