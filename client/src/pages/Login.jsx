import { useState } from 'react';
import { Link } from 'react-router-dom';

const roleData = {
  student: {
    icon: '👤',
    label: 'Student',
    title: 'Student Portal',
    color: '#3b82f6',
    desc: 'Continue learning with personalized courses and progress tracking.',
    features: ['📚 Access courses', '🎯 Track progress', '🏆 Earn certificates']
  },
  mentor: {
    icon: '🎯',
    label: 'Mentor',
    title: 'Mentor Zone',
    color: '#f59e0b',
    desc: 'Manage your courses, students, and mentorship dashboard.',
    features: ['📚 Create courses', '👥 Help students', '💵 Grow earnings']
  },
  admin: {
    icon: '⚙️',
    label: 'Admin',
    title: 'Admin Panel',
    color: '#ef4444',
    desc: 'Manage the platform, users, and content with control.',
    features: ['👥 Manage users', '📊 View reports', '🔧 Control settings']
  }
};

export default function Login() {
  const [selectedRole, setSelectedRole] = useState('student');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const role = roleData[selectedRole];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login data:', { ...formData, role: selectedRole });
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

          <div className="role-selection">
            <p>Choose Your Role</p>
            <div className="role-buttons">
              {Object.entries(roleData).map(([key, item]) => (
                <button
                  key={key}
                  type="button"
                  className={`role-btn ${selectedRole === key ? 'active' : ''}`}
                  style={{ 
                    '--role-color': item.color,
                    borderColor: selectedRole === key ? item.color : 'rgba(255, 255, 255, 0.12)',
                    background: selectedRole === key ? `${item.color}20` : 'rgba(255, 255, 255, 0.05)',
                    color: selectedRole === key ? '#ffffff' : '#e2e8f0'
                  }}
                  onClick={() => setSelectedRole(key)}
                >
                  <span style={{ fontSize: '20px', marginRight: '8px' }}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="auth-form-card">
          <h1>Welcome Back</h1>
          <p className="auth-subtext">Sign in to continue as a <span style={{ color: role.color, fontWeight: '600' }}>{role.label.toLowerCase()}</span></p>

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

            <button
              type="submit"
              className="primary-btn full-width"
              style={{ 
                background: `linear-gradient(135deg, ${role.color} 0%, ${role.color}dd 100%)`,
                boxShadow: `0 8px 20px ${role.color}40`
              }}
            >
              Sign In as {role.label}
            </button>
          </form>

          <div className="auth-switch">
            Don't have an account? <Link to="/signup">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
}