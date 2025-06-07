import { useState, useEffect } from 'react';
import { ResearcherProfile } from '../types';
import { storage } from '../utils/storage';

const ProfilePage = () => {
  const [profile, setProfile] = useState<ResearcherProfile>({
    name: '',
    email: '',
    field: '',
    institution: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const savedProfile = storage.getProfile();
    if (savedProfile) {
      setProfile(savedProfile);
    } else {
      setIsEditing(true); // Auto-edit mode if no profile exists
    }
  }, []);

  const handleInputChange = (field: keyof ResearcherProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const saveProfile = () => {
    if (!profile.name.trim() || !profile.email.trim()) {
      alert('Please fill in at least your name and email.');
      return;
    }

    storage.setProfile(profile);
    setIsEditing(false);
    setHasChanges(false);
    alert('Profile saved successfully!');
  };

  const cancelEdit = () => {
    const savedProfile = storage.getProfile();
    if (savedProfile) {
      setProfile(savedProfile);
      setIsEditing(false);
      setHasChanges(false);
    }
  };

  const clearProfile = () => {
    if (confirm('Are you sure you want to clear your profile? This action cannot be undone.')) {
      localStorage.removeItem('researcher_profile');
      setProfile({ name: '', email: '', field: '', institution: '' });
      setIsEditing(true);
      setHasChanges(false);
    }
  };

  const researchFields = [
    'Biomedical Sciences',
    'Neuroscience',
    'Pharmacology',
    'Genetics',
    'Biochemistry',
    'Molecular Biology',
    'Immunology',
    'Oncology',
    'Cardiology',
    'Infectious Diseases',
    'Public Health',
    'Bioinformatics',
    'Systems Biology',
    'Other'
  ];

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>
        👤 Researcher Profile
      </h1>
      
      <p style={{ fontSize: '18px', color: 'hsl(var(--text-muted))', marginBottom: '32px' }}>
        Your profile helps personalize the research experience and provides context for the AI agents.
      </p>

      <div style={{ maxWidth: '600px' }}>
        <div className="card">
          {isEditing ? (
            <form onSubmit={(e) => { e.preventDefault(); saveProfile(); }}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={profile.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="form-input"
                  placeholder="Dr. Jane Smith"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  value={profile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="form-input"
                  placeholder="jane.smith@university.edu"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="field" className="form-label">
                  Research Field
                </label>
                <select
                  id="field"
                  value={profile.field}
                  onChange={(e) => handleInputChange('field', e.target.value)}
                  className="form-input"
                >
                  <option value="">Select your primary research field</option>
                  {researchFields.map(field => (
                    <option key={field} value={field}>{field}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="institution" className="form-label">
                  Institution/Organization
                </label>
                <input
                  type="text"
                  id="institution"
                  value={profile.institution}
                  onChange={(e) => handleInputChange('institution', e.target.value)}
                  className="form-input"
                  placeholder="Harvard Medical School"
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="submit" className="btn btn-primary">
                  💾 Save Profile
                </button>
                {!profile.name && !profile.email ? null : (
                  <button 
                    type="button" 
                    onClick={cancelEdit}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          ) : (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>
                  {profile.name}
                </h3>
                
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div>
                    <strong>Email:</strong> {profile.email}
                  </div>
                  {profile.field && (
                    <div>
                      <strong>Research Field:</strong> {profile.field}
                    </div>
                  )}
                  {profile.institution && (
                    <div>
                      <strong>Institution:</strong> {profile.institution}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary"
                >
                  ✏️ Edit Profile
                </button>
                <button 
                  onClick={clearProfile}
                  className="btn btn-secondary"
                  style={{ color: 'hsl(var(--error))' }}
                >
                  🗑️ Clear Profile
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Benefits */}
        <div className="card" style={{ marginTop: '32px', background: 'hsl(var(--background))' }}>
          <h3 style={{ marginBottom: '16px' }}>🎯 How Your Profile Helps</h3>
          <ul style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
            <li><strong>Personalized Results:</strong> Agents can tailor responses to your research background</li>
            <li><strong>Relevant Context:</strong> Field-specific terminology and methodologies</li>
            <li><strong>Collaboration Ready:</strong> Easy sharing of research sessions with profile context</li>
            <li><strong>Session Tracking:</strong> All your research activities are associated with your profile</li>
            <li><strong>Privacy First:</strong> Data is stored locally in your browser only</li>
          </ul>
        </div>

        {/* Data Privacy Notice */}
        <div className="card" style={{ marginTop: '24px', border: '1px solid hsl(var(--border))' }}>
          <h4 style={{ marginBottom: '12px', fontSize: '16px' }}>🔒 Privacy Notice</h4>
          <p style={{ margin: 0, fontSize: '14px', color: 'hsl(var(--text-muted))', lineHeight: '1.5' }}>
            Your profile information is stored locally in your browser's localStorage and is never transmitted to external servers. 
            This ensures complete privacy and control over your personal information. You can clear your profile at any time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
