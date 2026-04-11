import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-content">
          <h1>Contact SkillMentor</h1>
          <p>Reach out for support, mentorship, or collaboration</p>
        </div>
      </section>

      <section className="contact-content">
        <div className="contact-form-section">
          <div className="contact-card">
            <h2>Get in Touch</h2>
            <p>Send us a message and we'll respond as soon as possible.</p>

            {submitted && (
              <div className="success-message">
                Your message has been received. Our team will get back to you soon.
              </div>
            )}

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  name="message"
                  placeholder="Tell us how we can help..."
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  required
                />
              </div>

              <button type="submit" className="primary-btn">
                Send Message
              </button>
            </form>
          </div>
        </div>

        <div className="contact-info-section">
          <div className="contact-info-card">
            <h3>Contact Information</h3>
            <div className="info-items">
              <div className="info-item">
                <span className="info-icon">📧</span>
                <div>
                  <strong>Email</strong>
                  <p>support@skillmentor.ai</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">📞</span>
                <div>
                  <strong>Phone</strong>
                  <p>+91 9876543210</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">📍</span>
                <div>
                  <strong>Location</strong>
                  <p>India</p>
                </div>
              </div>
            </div>
          </div>

          <div className="faq-card">
            <h3>Frequently Asked Questions</h3>
            <div className="faq-item">
              <h4>How does mentor access work?</h4>
              <p>Mentor sessions unlock with a 5+ day study streak or premium membership. Keep learning consistently!</p>
            </div>
            <div className="faq-item">
              <h4>Is AI mentor free?</h4>
              <p>Basic AI mentor features are free. Premium features require a subscription for unlimited access.</p>
            </div>
            <div className="faq-item">
              <h4>How to improve streak?</h4>
              <p>Complete daily quizzes, watch video summaries, or practice coding problems to maintain your streak.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}