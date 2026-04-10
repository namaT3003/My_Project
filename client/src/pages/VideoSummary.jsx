import { useState } from 'react';

export default function VideoSummary() {
  const [videoLink, setVideoLink] = useState('');
  const [summaryType, setSummaryType] = useState('short');
  const [summary, setSummary] = useState('');
  const [summaryInfo, setSummaryInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateVideoLink = (link) => {
    try {
      const url = new URL(link.trim());
      return [
        'youtube.com',
        'youtu.be',
        'www.youtube.com',
        'm.youtube.com',
      ].some((host) => url.hostname.includes(host));
    } catch {
      return false;
    }
  };

  const handleSummary = async (e) => {
    e.preventDefault();

    if (!videoLink.trim()) {
      setError('Please paste a video link');
      return;
    }

    if (!validateVideoLink(videoLink)) {
      setError('Please enter a valid YouTube video link');
      return;
    }

    setLoading(true);
    setError('');
    setSummary('');
    setSummaryInfo(null);

    try {
      const response = await fetch('/api/video-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoLink: videoLink.trim(), summaryType }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || `Server error: ${response.status}`);
      }

      if (data?.error) {
        setError(data.error);
      } else {
        setSummary(data.summary || 'No summary received');
        setSummaryInfo({ videoLink: videoLink.trim(), summaryType });
      }
    } catch (err) {
      setError(err.message || '❌ Failed to fetch summary');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (summary) {
      navigator.clipboard.writeText(summary);
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
          ) : error ? (
            <div className="video-summary-error">{error}</div>
          ) : summary ? (
            <>
              {summaryInfo && (
                <div className="video-summary-meta">
                  <span>Type: <strong>{summaryInfo.summaryType}</strong></span>
                  <span>Link: <strong>{summaryInfo.videoLink}</strong></span>
                </div>
              )}
              <div className="video-summary-prompt-box">
                <div className="video-summary-prompt-label">Prompt Result</div>
                <div className="video-summary-answer">{summary}</div>
              </div>
              <button
                className="secondary-btn copy-btn"
                type="button"
                onClick={handleCopy}
              >
                Copy Summary
              </button>
            </>
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