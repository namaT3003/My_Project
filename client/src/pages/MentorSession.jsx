import { useState } from 'react';

function MentorSession() {
  const [sessionGoal, setSessionGoal] = useState('');
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionStarted, setSessionStarted] = useState(false);

  const startSession = () => {
    setSessionStarted(true);
  };

  const sendMessage = async () => {
    if (!message.trim()) {
      setError('Please enter a message.');
      return;
    }

    setError('');
    setResponse('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5001/api/mentor-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionGoal: sessionGoal.trim(), message: message.trim() })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || data?.error || 'Unable to get mentor response');

      setResponse(data.response || data.result || 'Mentor response received.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mentor-session-page">
      <section className="mentor-header">
        <span className="section-tag">AI Mentor Session</span>
        <h1>AI Mentor Session</h1>
        <p>
          Get personalized guidance on your learning journey and career path.
          Connect with our AI mentor for expert advice and support.
        </p>
      </section>

      <div className="mentor-hero-card">
        <div className="mentor-avatar">
          <div className="avatar-circle">
            <span>AI</span>
          </div>
        </div>
        <div className="mentor-info">
          <h2>AI Mentor</h2>
          <p>Learning and Career Guidance</p>
          <div className="mentor-status">
            <span className="status-dot"></span>
            Live Session
          </div>
        </div>
        <button className="start-session-btn" onClick={startSession} disabled={sessionStarted}>
          {sessionStarted ? 'Session Active' : 'Start Session'}
        </button>
      </div>

      {sessionStarted && (
        <div className="session-panel">
          <div className="session-inputs">
            <div className="form-group">
              <label htmlFor="sessionGoal">Session Goal</label>
              <input
                id="sessionGoal"
                type="text"
                value={sessionGoal}
                onChange={(e) => setSessionGoal(e.target.value)}
                placeholder="e.g., Improve coding skills, career advice"
                className="session-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Your Message</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask your question or share your thoughts..."
                className="session-textarea"
                rows="4"
              />
            </div>
            <button className="send-btn" onClick={sendMessage} disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
            {error && <p className="session-error">{error}</p>}
          </div>

          <div className="session-output">
            <h3>Mentor Response</h3>
            {loading && (
              <div className="loading-container">
                <div className="loading-spinner-large" />
                <p>AI Mentor is thinking...</p>
              </div>
            )}
            {!loading && !response && (
              <p className="output-placeholder">
                Your mentor's response will appear here.
              </p>
            )}
            {!loading && response && (
              <div className="output-content">
                <p>{response}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="access-section">
        <div className="access-card">
          <div className="access-icon">
            <span>🔒</span>
          </div>
          <h3>Unlock Premium Sessions</h3>
          <p>
            Maintain a 7-day learning streak or upgrade to premium to unlock unlimited AI mentor sessions.
            Get personalized career guidance and expert advice on your learning path.
          </p>
        </div>
      </div>
    </main>
  );
}

export default MentorSession;