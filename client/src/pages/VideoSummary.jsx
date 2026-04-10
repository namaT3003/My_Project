import { useState } from 'react';

export default function VideoSummary() {
  const [videoLink, setVideoLink] = useState('');
  const [summaryType, setSummaryType] = useState('short');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSummary = async (e) => {
    e.preventDefault();

    if (!videoLink.trim()) {
      setError('Please paste a video link');
      return;
    }

    setLoading(true);
    setError('');
    setSummary('');

    try {
      const response = await fetch('/api/video-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoLink: videoLink.trim(), summaryType }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setSummary(data.summary || 'No summary received');
      }
    } catch (err) {
      setError('❌ Failed to fetch summary');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="video-summary-page">
      <div className="video-summary-header">
        <div className="dashboard-tag">🎥 Smart Video Learning</div>
        <h1>Video Summary</h1>
        <p className="video-summary-subtext">
          Paste a video link and get a concise AI-generated summary in the format you prefer.
        </p>
      </div>

      <div className="video-summary-panel">
        <div className="video-summary-controls">
          <form onSubmit={handleSummary} className="video-summary-form">
            <div className="form-group">
              <label htmlFor="videoLink">Video Link</label>
              <input
                id="videoLink"
                type="text"
                placeholder="Paste YouTube or video link here"
                value={videoLink}
                onChange={(e) => setVideoLink(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="summaryType">Summary Type</label>
              <select
                id="summaryType"
                value={summaryType}
                onChange={(e) => setSummaryType(e.target.value)}
                disabled={loading}
              >
                <option value="short">Short</option>
                <option value="detailed">Detailed</option>
                <option value="keypoints">Key Points</option>
                <option value="exam">Exam Focused</option>
              </select>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="primary-btn full-width" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Generating Summary...
                </>
              ) : (
                '🎬 Summarize Video'
              )}
            </button>
          </form>

          <div className="video-info">
            <p className="mode-info-title">💡 Tips:</p>
            <ul className="mode-list">
              <li><strong>Short:</strong> Quick overview</li>
              <li><strong>Detailed:</strong> More complete explanation</li>
              <li><strong>Key Points:</strong> Important takeaways only</li>
              <li><strong>Exam Focused:</strong> Revision-oriented format</li>
            </ul>
          </div>
        </div>

        <div className="video-summary-output-card">
          <h3>📝 Summary Output</h3>

          {loading ? (
            <div className="video-summary-placeholder">
              <div className="loading-container">
                <div className="loading-spinner-large"></div>
                <p>Generating summary...</p>
              </div>
            </div>
          ) : summary ? (
            <div className="video-summary-answer">{summary}</div>
          ) : (
            <div className="video-summary-placeholder">
              Paste a video link and click &quot;Summarize Video&quot; to see the result.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}