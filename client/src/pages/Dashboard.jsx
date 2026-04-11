import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
    if (loggedInUser) {
      setUser(loggedInUser);
    }
    setLoaded(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  const goToMentorSession = () => {
    navigate('/mentor-session');
  };

  if (!loaded) return null;

  if (!user) {
    return (
      <main className="dashboard-page">
        <section className="dashboard-hero">
          <div>
            <p className="dashboard-tag">Access Required</p>
            <h1>Please login first</h1>
            <p className="dashboard-subtext">
              You need to sign in before accessing your SkillMentor dashboard.
            </p>
            <button className="primary-btn" onClick={() => navigate('/login')}>
              Go to Login
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <section className="dashboard-hero">
        <div>
          <p className="dashboard-tag">{user.role === 'student' ? 'Student Dashboard' : 'Mentor Dashboard'}</p>
          <h1>Welcome back, {user.name}</h1>
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

      <section className="dashboard-info-grid">
        <div className="dashboard-card">
          <h3>Account Details</h3>
          <p className="dashboard-field"><strong>Email:</strong> {user.email}</p>
          <p className="dashboard-field"><strong>Role:</strong> {user.role}</p>
          <p className="dashboard-field"><strong>Premium:</strong> {user.isPremium ? 'Yes' : 'No'}</p>
        </div>

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
      </section>

      <section className="dashboard-graphs">
        <div className="dashboard-card wide-card">
          <h3>Weekly Progress</h3>
          <div className="progress-graph">
            <div className="graph-bar" style={{ height: '40%' }} data-day="Mon"></div>
            <div className="graph-bar" style={{ height: '60%' }} data-day="Tue"></div>
            <div className="graph-bar" style={{ height: '80%' }} data-day="Wed"></div>
            <div className="graph-bar" style={{ height: '50%' }} data-day="Thu"></div>
            <div className="graph-bar" style={{ height: '70%' }} data-day="Fri"></div>
            <div className="graph-bar" style={{ height: '90%' }} data-day="Sat"></div>
            <div className="graph-bar" style={{ height: '30%' }} data-day="Sun"></div>
          </div>
          <div className="graph-labels">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        <div className="dashboard-card wide-card">
          <h3>Learning Focus</h3>
          <div className="learning-focus">
            <div className="focus-item">
              <span className="focus-label">DSA</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '75%' }}></div>
              </div>
              <span className="progress-text">75%</span>
            </div>
            <div className="focus-item">
              <span className="focus-label">Web Dev</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '60%' }}></div>
              </div>
              <span className="progress-text">60%</span>
            </div>
            <div className="focus-item">
              <span className="focus-label">Aptitude</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '85%' }}></div>
              </div>
              <span className="progress-text">85%</span>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-lower">
        <div className="dashboard-card">
          <h3>Mentor Unlock Progress</h3>
          {user.streak >= 7 ? (
            <div className="unlock-success">
              <span className="unlock-icon">🔓</span>
              <p>Mentor Access Unlocked</p>
            </div>
          ) : (
            <div className="unlock-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(user.streak / 7) * 100}%` }}></div>
              </div>
              <p>{7 - user.streak} more days to unlock mentor sessions</p>
            </div>
          )}
        </div>

        <div className="dashboard-card">
          <h3>Recent Activity</h3>
          <ul className="activity-list">
            <li className="activity-item">
              <span className="activity-icon">✅</span>
              <span>Completed DSA quiz</span>
            </li>
            <li className="activity-item">
              <span className="activity-icon">📹</span>
              <span>Watched algorithm summary</span>
            </li>
            <li className="activity-item">
              <span className="activity-icon">🎯</span>
              <span>Used mentor session</span>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
