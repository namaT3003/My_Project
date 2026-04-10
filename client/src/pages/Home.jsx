export default function Home() {
  return (
    <main className="home-page">

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-badge">
          AI-Powered Learning + Mentorship
        </div>

        <h1 className="hero-title">
          Learn Smarter with <span>Bridge Skill</span>
        </h1>

        <p className="hero-subtitle">
          A premium AI-powered platform where students can understand concepts,
          practice effectively, get smart recommendations, and unlock mentorship.
        </p>

        <div className="hero-actions">
          <button className="primary-btn">Start Learning</button>
          <button className="secondary-btn">Watch Demo</button>
        </div>

        {/* MINI STATS */}
        <div className="hero-mini-stats">
          <div className="mini-stat">
            <h4>10x</h4>
            <p>Faster Learning</p>
          </div>

          <div className="mini-stat">
            <h4>4 Modes</h4>
            <p>AI Explanation</p>
          </div>

          <div className="mini-stat">
            <h4>24/7</h4>
            <p>AI Mentor</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="feature-section">
        <div className="feature-card premium-card">
          <div className="feature-icon">🎯</div>
          <h3>Personalized Learning</h3>
          <p>
            Study based on your level, weak topics, and performance to improve faster.
          </p>
        </div>

        <div className="feature-card premium-card">
          <div className="feature-icon">🧠</div>
          <h3>AI Topic Explainer</h3>
          <p>
            Explain any concept in Friendly, Beginner, Strict, or Exam mode.
          </p>
        </div>

        <div className="feature-card premium-card">
          <div className="feature-icon">🚀</div>
          <h3>AI Mentor Sessions</h3>
          <p>
            Get guided support through AI-based mentorship and future tutor integration.
          </p>
        </div>
      </section>

      {/* WHY SECTION */}
      <section className="why-section">
        <div className="section-heading">
          <p className="section-tag">WHY BRIDGE SKILL</p>
          <h2>
            Built for students who want clarity, confidence, and growth
          </h2>
        </div>

        <div className="why-grid">
          <div className="why-card">
            <h4>Adaptive Learning</h4>
            <p>
              Content adjusts based on your understanding and learning pace.
            </p>
          </div>

          <div className="why-card">
            <h4>Smart Recommendations</h4>
            <p>
              Know exactly what to study next instead of wasting time.
            </p>
          </div>

          <div className="why-card">
            <h4>Mentorship Access</h4>
            <p>
              Unlock guidance using streaks or premium access features.
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}