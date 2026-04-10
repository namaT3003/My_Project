import { useState } from 'react';
import { Link } from 'react-router-dom';

const roleData = {
  student: {
    icon: '👤',
    label: 'Student',
    title: 'Student Portal',
    color: '#3b82f6',
    desc: 'Join as a student and unlock guided learning paths.',
    features: ['📚 Access courses', '🎯 Track progress', '🏆 Earn certificates']
  },
  mentor: {
    icon: '🎯',
    label: 'Mentor',
    title: 'Mentor Zone',
    color: '#f59e0b',
    desc: 'Join as a mentor and share your knowledge with learners.',
    features: ['📚 Create courses', '👥 Help students', '💵 Earn revenue']
  },
  admin: {
    icon: '⚙️',
    label: 'Admin',
    title: 'Admin Panel',
    color: '#ef4444',
    desc: 'Join as admin and manage the platform smoothly.',
    features: ['👥 Manage users', '📊 View reports', '🔧 Control settings']
  }
};

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const role = roleData[formData.role];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Signup data:', formData);
  };

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <div
          className="auth-brand-panel"
          style={{ background: `linear-gradient(135deg, ${role.color}15 0%, rgba(10, 14, 39, 0.95) 100%)` }}
        >
          <div className="auth-brand-badge" style={{ color: role.color, borderColor: role.color }}>
            {role.icon} Bridge Skill
          </div>
          
          <h2 style={{ color: role.color }}>{role.title}</h2>
          <p>{role.desc}</p>

          <div className="auth-features">
            {role.features.map((feature) => (
              <div key={feature} className="feature-item" style={{ borderColor: `${role.color}30` }}>
                {feature}
              </div>
            ))}
          </div>
        </div>

        <div className="auth-form-card">
          <h1>Create Your Account</h1>
          <p className="auth-subtext">Sign up as a <span style={{ color: role.color, fontWeight: '600' }}>{role.label.toLowerCase()}</span> and get started</p>

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
                <option value="admin">⚙️ Admin</option>
              </select>
            </div>

            <button
              type="submit"
              className="primary-btn full-width"
              style={{ 
                background: `linear-gradient(135deg, ${role.color} 0%, ${role.color}dd 100%)`,
                boxShadow: `0 8px 20px ${role.color}40`
              }}
            >
              Create Account
            </button>
          </form>

          <div className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}