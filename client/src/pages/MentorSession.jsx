import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const [listening, setListening] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const [user, setUser] = useState(null);
  const [recognition, setRecognition] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognizer = new SpeechRecognition();
      recognizer.lang = 'en-US';
      recognizer.continuous = false;
      recognizer.interimResults = false;

      recognizer.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript || '';
        if (!transcript) {
          setSpeechError('Could not recognize speech. Try again.');
          setListening(false);
          return;
        }
        setSpeechError('');
        setMessage(transcript);
        setListening(false);
        setTimeout(() => {
          handleSendMessage(transcript);
        }, 500);
      };

      recognizer.onerror = () => {
        setSpeechError('Speech recognition failed. Please try again.');
        setListening(false);
      };

      recognizer.onend = () => {
        setListening(false);
      };

      setRecognition(recognizer);
    }
  }, []);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
    if (!loggedInUser) {
      navigate('/login');
      return;
    }

    // Check if user has access to mentor session
    // Premium users or users with streak >= 5 can access
    if (!loggedInUser.isPremium && loggedInUser.streak < 5) {
      alert('Mentor sessions require either Premium status or a 5+ day study streak. Keep learning to unlock this feature!');
      navigate('/dashboard');
      return;
    }

    setUser(loggedInUser);
  }, [navigate]);

  const handleSendMessage = (overridePrompt) => {
    const promptText = typeof overridePrompt === 'string' ? overridePrompt : message;
    const prompt = promptText?.trim() || '';
    if (!prompt) return;

    setLoading(true);
    setResponse('');
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

  const handleMicClick = () => {
    if (!recognition) {
      setSpeechError('Speech recognition is not supported in this browser.');
      return;
    }

    if (listening) {
      recognition.stop();
      setListening(false);
      return;
    }

    setSpeechError('');
    setListening(true);
    recognition.start();
  };

  if (!user) return null;

  return (
    <div className="mentor-session-page">
      <div className="mentor-session-header">
        <div>
          <div className="session-badge">Live AI Mentor</div>
          <h1 className="session-title">Premium AI Avatar Mentorship</h1>
          <p className="session-subtitle">
            {user ? `Welcome back, ${user.name}! Experience a real-time mentor session with AI guidance, voice feedback, and a premium study workflow.` : 'Experience a real-time mentor session with AI guidance, voice feedback, and a premium study workflow.'}
          </p>
        </div>
        <div className="session-meta">
          <span>Route: /mentor-session</span>
          <span>Instant voice responses</span>
        </div>
      </div>

      <div className="session-layout">
        <section className="mentor-video-panel">
          <div className="mentor-avatar-card">
            <div className="avatar-glow">
              <div className="mentor-avatar-circle">🤖</div>
            </div>
            <div className="live-indicator">
              <span className="live-dot"></span>
              Live AI Mentor
            </div>
            <div className="avatar-details">
              <h2>AI Mentor</h2>
              <p>Learning + Career Guide</p>
            </div>
          </div>

          <div className="mentor-avatar-actions">
            <button
              type="button"
              className={`mic-button ${listening ? 'active' : ''}`}
              onClick={handleMicClick}
            >
              <span className="mic-icon">🎙️</span>
            </button>
            <div className="mic-status">
              {listening ? 'Listening...' : 'Tap the mic to speak'}
            </div>
            {speechError && <p className="speech-error">{speechError}</p>}
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
                onClick={() => handleSendMessage()}
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
