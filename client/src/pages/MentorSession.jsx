import { useState } from 'react';

const getMentorReply = (message) => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('binary search')) {
    return `Binary search is one of the most powerful DSA techniques for sorted lists.

• Start with low = 0 and high = length - 1.
• Find mid = Math.floor((low + high) / 2).
• Compare target with array[mid].
• Move left if target is smaller, right if it is larger.
• Repeat until low > high or the item is found.

This approach runs in O(log n), so it is ideal for fast lookup in large datasets.`;
  }

  if (lowerMessage.includes('career')) {
    return `For a strong tech career, focus on skills, projects, and networking.

• Build a portfolio that shows real work.
• Practice with data structures and system design.
• Learn how to explain your decisions clearly.
• Connect with mentors and recruiters.

Keep refining your story and keep learning consistently.`;
  }

  if (lowerMessage.includes('exam')) {
    return `A great exam strategy combines understanding and practice.

• Identify high-priority topics first.
• Use active recall and spaced repetition.
• Practice past questions under timed conditions.
• Review mistakes and keep your schedule steady.

Stay calm, sleep well, and trust your preparation.`;
  }

  if (lowerMessage.includes('plan')) {
    return `Let's build a study plan for your next milestone.

• Week 1: Review key concepts and set strong foundations.
• Week 2: Practice problems and real examples.
• Week 3: Simulate timed sessions and review weak spots.
• Week 4: Refine and repeat the highest-impact topics.

This gives you structure while keeping the plan flexible as you improve.`;
  }

  return `I am your AI mentor and I can help you with learning, career direction, exam preparation, and study planning.

Ask me a specific question about a topic, a career goal, an exam strategy, or a study plan and I will guide you step by step.`;
};

const speakResponse = (text) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 1;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
};

export default function MentorSession() {
  const [sessionGoal, setSessionGoal] = useState('');
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    setLoading(true);
    setResponse('');
    const prompt = message.trim();
    setMessage('');

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setTimeout(() => {
      const aiResponse = getMentorReply(prompt);
      setResponse(aiResponse);
      setLoading(false);
      speakResponse(aiResponse);
    }, 1400);
  };

  return (
    <div className="mentor-session-page">
      <div className="mentor-session-header">
        <div>
          <div className="session-badge">Live AI Mentor</div>
          <h1 className="session-title">Premium AI Avatar Mentorship</h1>
          <p className="session-subtitle">
            Experience a real-time mentor session with AI guidance, voice feedback, and a premium study workflow.
          </p>
        </div>
        <div className="session-meta">
          <span>Route: /mentor-session</span>
          <span>Instant voice responses</span>
        </div>
      </div>

      <div className="session-layout">
        <section className="mentor-video-panel">
          <div className="mentor-video-card">
            <video
              className="mentor-video"
              src="/avatar.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
            <div className="video-overlay">
              <div className="live-badge">
                <span className="live-dot"></span>
                Live
              </div>
              <div className="avatar-details">
                <h2>AI Mentor</h2>
                <p>Learning + Career Guide</p>
              </div>
            </div>
          </div>

          <div className="mentor-summary-card">
            <h3>Real mentor feel</h3>
            <p>
              The avatar section is designed to feel like a live mentor call. Your mentor speaks responses automatically after each message.
            </p>
          </div>
        </section>

        <section className="chat-panel">
          <div className="chat-card">
            <div className="chat-header">
              <div>
                <h2>Mentor Chat</h2>
                <p>Type your question and the AI mentor will answer with voice-enabled guidance.</p>
              </div>
              <span className="status-pill">Active session</span>
            </div>

            <div className="session-goal-section">
              <label htmlFor="session-goal">Session Goal (Optional)</label>
              <input
                id="session-goal"
                type="text"
                placeholder="e.g., Build interview readiness in 4 weeks"
                value={sessionGoal}
                onChange={(e) => setSessionGoal(e.target.value)}
              />
            </div>

            <div className="message-section">
              <label htmlFor="message">Your Message</label>
              <textarea
                id="message"
                placeholder="Ask me about binary search, career planning, exam prep, or a study plan..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
              />
              <button
                className="send-btn"
                onClick={handleSendMessage}
                disabled={!message.trim() || loading}
              >
                {loading ? 'Thinking...' : 'Send Message'}
              </button>
            </div>

            <div className="response-card">
              {loading && (
                <div className="loading-response">
                  <div className="loading-spinner" />
                  <p>AI Mentor is thinking...</p>
                </div>
              )}

              {!loading && response && (
                <div className="response-content-wrap">
                  <div className="response-header">
                    <div className="mentor-avatar-small">
                      <span className="avatar-icon-small">🤖</span>
                    </div>
                    <div>
                      <div className="mentor-label">AI Mentor</div>
                      <p className="response-subtitle">Speaking response now</p>
                    </div>
                  </div>
                  <div className="response-content">
                    {response.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                </div>
              )}

              {!loading && !response && (
                <div className="response-placeholder">
                  <p>Send a message to begin your live AI mentor session.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
