import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          SkillMentor
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/learn">Learn</Link>
          <Link to="/practice">Practice</Link>
          <Link to="/video-summary">Video Summary</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/mentor-session">Mentor Session</Link>
        </div>

        <div className="nav-actions">
          <Link to="/login" className="nav-cta nav-cta-login">
            Login
          </Link>
          <Link to="/signup" className="nav-cta nav-cta-signup">
            Signup
          </Link>
          <Link to="/contact" className="nav-link-secondary">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;