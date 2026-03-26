import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { CheckCircle, UserPlus, User, Microscope, BookOpen, Download } from 'lucide-react';

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get('/api/profile').then(res => setProfile(res.data));
  }, []);

  const handleScholarSync = async () => {
    const authorId = window.prompt("Enter your Google Scholar Author ID (e.g., LSf_mNcAAAAJ):");
    if (!authorId) return;

    try {
      const res = await api.get(`/api/scholar/author/${authorId}`);
      const scholarData = res.data.author;
      
      if (scholarData) {
        // Update local profile state and backend
        const updated = {
          ...profile,
          stats: {
            ...profile.stats,
            hIndex: scholarData.stats?.h_index || profile.stats.hIndex,
            citations: scholarData.stats?.citations || profile.stats.citations,
          },
          institution: scholarData.affiliations || profile.institution
        };
        
        await api.put('/api/profile', updated);
        setProfile(updated);
        alert("Profile synced with Google Scholar!");
      }
    } catch (err) {
      alert("Sync failed. Ensure Author ID is correct and SERPAPI_KEY is configured.");
    }
  };

  if (!profile) return <div className="loading-state">Loading...</div>;

  return (
    <div className="profile-view">
      <div className="profile-core">
        <div>
          <div className="card profile-top-card">
            <div className="profile-banner"></div>
            <div className="profile-main-avatar">{profile.name?.charAt(0) || 'U'}</div>
            <div className="profile-info">
              <h1 className="profile-name">{profile.name} <CheckCircle className="badge-verified" /></h1>
              <div className="profile-headline">{profile.title}</div>
              <div className="profile-location">{profile.institution || 'Quantum Institute, MIT'} • Cambridge, MA • <span className="profile-connections">500+ Collaborators</span></div>
              
              <div className="profile-metrics-ribbon">
                 <div className="metric-block">
                   <span className="metric-val">{profile.stats?.hIndex || 0}</span>
                   <span className="metric-lbl">H-Index</span>
                 </div>
                 <div className="metric-block">
                   <span className="metric-val">{profile.stats?.interest || 0}</span>
                   <span className="metric-lbl">Interest Score</span>
                 </div>
                 <div className="metric-block">
                   <span className="metric-val">{profile.stats?.citations?.toLocaleString() || 0}</span>
                   <span className="metric-lbl">Total Citations</span>
                 </div>
                 <div className="metric-block">
                   <span className="metric-val">12</span>
                   <span className="metric-lbl">Peer Reviews</span>
                 </div>
              </div>

              <div className="profile-actions">
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><UserPlus size={16} /> Request Collaboration</button>
                <button className="btn-secondary" onClick={handleScholarSync}>Sync with Scholar</button>
                <button className="btn-secondary">Message</button>
                <button className="btn-secondary">More</button>
              </div>
            </div>
          </div>
          <div className="card profile-section">
            <h2 className="section-title"><User /> About</h2>
            <div className="about-text">{profile.about}</div>
          </div>
          <div className="card profile-section">
            <h2 className="section-title"><Microscope /> Current Grants & Funding</h2>
            {profile.grants?.map((grant, i) => (
              <div key={i} className="item-card" style={{ marginBottom: 16, paddingBottom: 16 }}>
                <div className="item-icon" style={{ background: 'var(--accent-light)' }}><Microscope /></div>
                <div className="item-content">
                  <h3 style={{ marginBottom: 4 }}>{grant.name}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{grant.agency} • {grant.amount} • {grant.period}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="card profile-section">
            <h2 className="section-title"><BookOpen /> Notable Publications</h2>
            {profile.publications?.map((pub, i) => (
              <div key={i} className="item-card">
                <div className="item-icon"><BookOpen /></div>
                <div className="item-content">
                  <h3>{pub.title}</h3>
                  <div className="item-meta">{pub.journal} • {pub.date ? new Date(pub.date).getFullYear() : '2026'} • Citations: {pub.citations}</div>
                  <div className="item-description">{pub.abstract}</div>
                  <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                     <button className="btn-secondary" style={{ fontSize: 13, padding: '4px 12px', borderRadius: 12, display: 'flex', alignItems:'center', gap: 4 }}><Download size={14} /> PDF</button>
                     <button className="btn-secondary" style={{ fontSize: 13, padding: '4px 12px', borderRadius: 12 }}>Cite</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="card profile-section" style={{ padding: 24 }}>
             <h2 className="section-title" style={{ fontSize: 16, marginBottom: 16 }}>Network Spotlight</h2>
               <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
                 <div className="share-avatar" style={{ width: 48, height: 48, fontSize: 18, flex: 'none' }}>A</div>
                 <div style={{ flex: 1 }}>
                   <div style={{ fontWeight: 600, fontSize: 14 }}>Alice Walker</div>
                   <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Postdoc Researcher</div>
                 </div>
               </div>
          </div>
        </div>
      </div>
    </div>
  );
}
