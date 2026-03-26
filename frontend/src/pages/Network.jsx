import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { BookOpen, UserPlus } from 'lucide-react';

export default function Network() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    api.get('/api/community').then(res => setMatches(res.data));
  }, []);

  return (
    <div className="network-layout">
      <div>
        <div className="card network-sidebar">
           <h2 style={{fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)'}}>Manage my network</h2>
           <div className="network-nav-item"><span>Collaborators</span><span style={{fontWeight: 600}}>1,432</span></div>
           <div className="network-nav-item"><span>Co-Authors</span><span style={{fontWeight: 600}}>84</span></div>
           <div className="network-nav-item"><span>Institutions</span><span style={{fontWeight: 600}}>12</span></div>
           <div className="network-nav-item"><span>Labs & Groups</span><span style={{fontWeight: 600}}>8</span></div>
           <div className="network-nav-item"><span>Conferences</span><span style={{fontWeight: 600}}>3</span></div>
        </div>
      </div>
      <div>
        <div className="card">
           <div style={{padding: 20, borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <span style={{fontSize: 16, fontWeight: 600}}>Suggested Collaborators based on your recent publications</span>
              <span style={{color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 500}}>See all</span>
           </div>
           <div className="network-grid">
             {matches.map(match => (
                <div key={match._id || match.id} className="card people-card interactive">
                   <div className="people-banner"></div>
                   <div className="people-avatar">{match.name?.charAt(0) || 'U'}</div>
                   <div className="people-info">
                      <div className="people-name">{match.name}</div>
                      <div className="people-headline">{match.title}</div>
                      <div className="people-shared" style={{display:'flex', justifyContent:'center'}}><BookOpen size={14} style={{ marginRight: 6 }} /> {match.mutual || 12} shared citations</div>
                   </div>
                   <div className="people-action">
                      <button className="btn-connect" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><UserPlus size={14} style={{ marginRight: 4 }} /> Collaborate</button>
                   </div>
                </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}
