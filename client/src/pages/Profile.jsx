import { useState } from 'react';

function Profile() {
  const [user] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Student',
    preferredMode: 'Interactive',
    studyGoal: 'Master AI & ML',
    premiumStatus: 'Premium',
    currentStreak: 15
  });

  const handleEdit = () => {
    alert('Edit profile feature is coming soon!');
  };

  return (
    <main className="profile-page">
      <section className="profile-header">
        <span className="section-tag">User Profile</span>
        <h1>My Profile</h1>
        <p>Manage your account settings and track your learning journey in one place.</p>
      </section>

      <div className="profile-hero-card">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="profile-info">
          <h2>{user.name}</h2>
          <p className="profile-email">{user.email}</p>

          <div className="profile-meta">
            <div className="meta-item">
              <span className="meta-label">Role</span>
              <span>{user.role}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Status</span>
              <span>{user.premiumStatus}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Streak</span>
              <span>{user.currentStreak} days</span>
            </div>
          </div>
        </div>

        <button className="edit-profile-btn" onClick={handleEdit}>
          Edit Profile
        </button>
      </div>

      <div className="profile-cards-grid">
        <div className="profile-card">
          <h3>Learning Preferences</h3>
          <div className="card-content">
            <div className="card-row">
              <span className="card-label">Preferred mode</span>
              <span>{user.preferredMode}</span>
            </div>
            <div className="card-row">
              <span className="card-label">Study goal</span>
              <span>{user.studyGoal}</span>
            </div>
          </div>
        </div>

        <div className="profile-card">
          <h3>Activity Summary</h3>
          <div className="card-content">
            <div className="card-row">
              <span className="card-label">Current streak</span>
              <span>{user.currentStreak} days</span>
            </div>
            <div className="card-row">
              <span className="card-label">Premium status</span>
              <span>{user.premiumStatus}</span>
            </div>
            <div className="card-row">
              <span className="card-label">Role</span>
              <span>{user.role}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Profile;