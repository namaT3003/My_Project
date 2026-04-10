import { useState } from 'react';

export default function MentorSession() {
  const [sessionGoal, setSessionGoal] = useState('');
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setResponse('');

    // Simulate AI thinking delay
    setTimeout(() => {
      let aiResponse = '';

      const lowerMessage = message.toLowerCase();

      if (lowerMessage.includes('binary search')) {
        aiResponse = `Great question about binary search! Let me break this down for you:

**Binary Search Fundamentals:**
- Works on sorted arrays only
- Time complexity: O(log n)
- Space complexity: O(1)

**Key Implementation Steps:**
1. Set low = 0, high = array.length - 1
2. While low <= high:
   - Calculate mid = low + (high - low) / 2
   - If target == array[mid], return mid
   - If target < array[mid], high = mid - 1
   - Else low = mid + 1
3. Return -1 if not found

**Common Pitfalls:**
- Forgetting to handle integer overflow in mid calculation
- Not ensuring the array is sorted first
- Off-by-one errors in boundary conditions

Try implementing this and let me know if you need help with a specific case!`;
      } else if (lowerMessage.includes('career')) {
        aiResponse = `Excellent that you're thinking about your career path! Here's some tailored guidance:

**Current Market Trends:**
- Tech skills are in high demand across industries
- AI/ML, cybersecurity, and cloud computing are growing rapidly
- Remote work has become the new normal

**Your Career Action Plan:**
1. **Skill Assessment:** Identify your strengths and interests
2. **Market Research:** Study job descriptions in your target roles
3. **Skill Gap Analysis:** Determine what you need to learn
4. **Learning Path:** Create a 3-6 month roadmap
5. **Networking:** Connect with experienced professionals in your field
6. **Projects:** Build a portfolio showcasing your skills

**Next Steps:**
- Update your LinkedIn profile
- Start contributing to open-source projects
- Consider certifications in high-demand areas
- Network on platforms like LinkedIn and GitHub

What specific career direction interests you most?`;
      } else if (lowerMessage.includes('exam')) {
        aiResponse = `Smart thinking about exam preparation! Let's optimize your strategy:

**Exam Preparation Framework:**

**Phase 1: Foundation Building (Weeks 1-2)**
- Review all syllabus topics
- Create concept maps for each subject
- Identify weak areas through self-assessment

**Phase 2: Intensive Study (Weeks 3-4)**
- Focus on high-weightage topics first
- Practice with previous year questions
- Use active recall techniques
- Take short breaks (Pomodoro: 25min study + 5min break)

**Phase 3: Revision & Testing (Final Week)**
- Quick revision of all topics
- Full-length mock tests under exam conditions
- Analyze mistakes and learn from them
- Focus on time management

**Pro Tips:**
- Start early - cramming doesn't work
- Health first: 7-8 hours sleep, regular exercise
- Stay hydrated and eat brain-boosting foods
- Practice mindfulness to reduce anxiety

**During Exam:**
- Read questions carefully
- Manage time per section
- Don't panic if stuck - move on and return later

You've got this! Stay consistent and believe in your preparation.`;
      } else {
        aiResponse = `I'm here to help you with your learning journey! As your AI mentor, I can assist with:

**Academic Support:**
- Subject explanations and concept clarification
- Problem-solving strategies
- Study techniques and memory methods

**Career Guidance:**
- Career path exploration
- Skill development planning
- Industry insights and trends

**Exam Preparation:**
- Study plan creation
- Test-taking strategies
- Time management techniques

**Learning Optimization:**
- Personalized study schedules
- Productivity tips
- Goal setting and tracking

What specific area would you like to focus on today? Whether it's understanding a complex topic, planning your career, preparing for exams, or optimizing your learning approach, I'm here to guide you every step of the way.

Feel free to ask me anything - from specific coding problems to broader life advice. Let's make your learning journey both effective and enjoyable! 🚀`;
      }

      setResponse(aiResponse);
      setLoading(false);
    }, 2000); // 2 second delay for realistic feel
  };

  return (
    <div className="mentor-session-page">
      {/* Hero Section */}
      <div className="mentor-session-hero">
        <div className="dashboard-tag">AI Avatar Mentorship</div>
        <h1>Meet Your AI Mentor</h1>
        <p className="mentor-session-subtext">
          Real-time guided help for subjects, exams, and career direction. Experience personalized mentorship powered by advanced AI.
        </p>
      </div>

      {/* Main Session Layout */}
      <div className="session-layout">
        {/* Left Panel - Avatar */}
        <div className="avatar-panel">
          <div className="avatar-container">
            <div className="avatar-circle">
              <div className="avatar-placeholder">
                <span className="avatar-icon">🤖</span>
              </div>
              <div className="live-indicator">
                <div className="live-dot"></div>
                <span>Live</span>
              </div>
            </div>

            <div className="mentor-info-card">
              <h2>AI Mentor</h2>
              <p className="mentor-domain">Learning + Career Guide</p>
              <div className="status-badge">
                <span className="status-dot"></span>
                Online & Available
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Chat Interface */}
        <div className="chat-panel">
          <div className="session-goal-section">
            <label htmlFor="session-goal">Session Goal (Optional)</label>
            <input
              id="session-goal"
              type="text"
              placeholder="e.g., Prepare for data structures interview"
              value={sessionGoal}
              onChange={(e) => setSessionGoal(e.target.value)}
            />
          </div>

          <div className="message-section">
            <label htmlFor="message">Your Message</label>
            <textarea
              id="message"
              placeholder="Ask me anything about learning, career, or exams..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
            <button
              className="send-btn"
              onClick={handleSendMessage}
              disabled={!message.trim() || loading}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </div>

          <div className="response-section">
            {loading && (
              <div className="loading-response">
                <div className="loading-spinner"></div>
                <p>AI Mentor is thinking...</p>
              </div>
            )}

            {response && !loading && (
              <div className="mentor-response">
                <div className="response-header">
                  <div className="mentor-avatar-small">
                    <span className="avatar-icon-small">🤖</span>
                  </div>
                  <div className="mentor-label">AI Mentor</div>
                </div>
                <div className="response-content">
                  {response}
                </div>
              </div>
            )}

            {!response && !loading && (
              <div className="response-placeholder">
                <p>Your conversation with the AI Mentor will appear here. Start by sending a message above!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Future Vision Section */}
      <div className="future-vision-section">
        <div className="vision-card">
          <div className="vision-icon">🚀</div>
          <h3>Future of AI Mentorship</h3>
          <p>We're just getting started. Here's what's coming next:</p>

          <div className="vision-features">
            <div className="vision-feature">
              <div className="feature-icon">🎭</div>
              <h4>Real Avatars</h4>
              <p>Interactive 3D avatars that respond with natural expressions and gestures</p>
            </div>

            <div className="vision-feature">
              <div className="feature-icon">👥</div>
              <h4>Human Mentors</h4>
              <p>Connect with experienced professionals for personalized guidance</p>
            </div>

            <div className="vision-feature">
              <div className="feature-icon">🎯</div>
              <h4>Advanced Analytics</h4>
              <p>Detailed progress tracking and personalized learning recommendations</p>
            </div>

            <div className="vision-feature">
              <div className="feature-icon">🌐</div>
              <h4>Multi-Language</h4>
              <p>Support for multiple languages and cultural contexts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}