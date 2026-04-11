import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
    if (!loggedInUser) {
      navigate('/login');
      return;
    }
    setUser(loggedInUser);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  const goToMentorSession = () => {
    navigate('/mentor-session');
  };

  if (!user) return null;

  return (
    <main className="dashboard-page">
      <section className="dashboard-hero">
        <div>
          <p className="dashboard-tag">{user.role === 'student' ? 'Student Dashboard' : 'Mentor Dashboard'}</p>
          <h1>Welcome back, {user.name} 👋</h1>
          <p className="dashboard-subtext">
            Track your performance, stay consistent, and follow your smart learning path.
          </p>
        </div>

        <div className="dashboard-actions">
          <button className="primary-btn" onClick={goToMentorSession}>
            Go to Mentor Session
          </button>
          <button className="secondary-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </section>

      <section className="dashboard-stats">
        <div className="dashboard-card">
          <h3>Study Streak</h3>
          <h2>{user.streak} Days</h2>
          <p>You've been consistent this week.</p>
        </div>

        <div className="dashboard-card">
          <h3>Total XP</h3>
          <h2>{user.xp.toLocaleString()}</h2>
          <p>Earned through quizzes and sessions.</p>
        </div>

        <div className="dashboard-card">
          <h3>Premium Status</h3>
          <h2>{user.isPremium ? 'Premium' : 'Free'}</h2>
          <p>{user.isPremium ? 'Enjoy all premium features' : 'Upgrade for more features'}</p>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-card wide-card">
          <h3>Smart Recommendation</h3>
          <p className="recommendation-text">
            Based on your progress, we recommend focusing on advanced algorithms and data structures to boost your coding skills.
          </p>
        </div>

        <div className="dashboard-card wide-card">
          <h3>Recent Progress</h3>
          <ul className="progress-list">
            <li>Completed: Algorithm Basics</li>
            <li>Practiced: Data Structures Quiz</li>
            <li>Watched: AI Learning Summary</li>
          </ul>
        </div>
      </section>
    </main>
  );
}