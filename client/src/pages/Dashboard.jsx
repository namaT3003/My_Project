export default function Dashboard() {
  return (
    <main className="dashboard-page">
      <section className="dashboard-hero">
        <div>
          <p className="dashboard-tag">Student Dashboard</p>
          <h1>Welcome back, Ritik 👋</h1>
          <p className="dashboard-subtext">
            Track your performance, stay consistent, and follow your smart learning path.
          </p>
        </div>

        <button className="primary-btn">Continue Learning</button>
      </section>

      <section className="dashboard-stats">
        <div className="dashboard-card">
          <h3>Study Streak</h3>
          <h2>7 Days</h2>
          <p>You’ve been consistent this week.</p>
        </div>

        <div className="dashboard-card">
          <h3>Total XP</h3>
          <h2>1,280</h2>
          <p>Earned through quizzes and sessions.</p>
        </div>

        <div className="dashboard-card">
          <h3>Weak Topic</h3>
          <h2>Trigonometry</h2>
          <p>Recommended for revision today.</p>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-card wide-card">
          <h3>Smart Recommendation</h3>
          <p className="recommendation-text">
            You haven’t studied Trigonometry recently. Revise it today to improve retention and confidence.
          </p>
        </div>

        <div className="dashboard-card wide-card">
          <h3>Recent Progress</h3>
          <ul className="progress-list">
            <li>Completed: Algebra Basics</li>
            <li>Practiced: Binary Search Quiz</li>
            <li>Watched: AI Learning Summary</li>
          </ul>
        </div>
      </section>
    </main>
  );
}