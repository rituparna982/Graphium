import React from 'react';
import { Microscope, Award, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Labs() {
  const { user } = useAuth();
  return (
    <div className="network-layout">
      <div className="card network-sidebar">
        <h2 style={{fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)'}}>Labs & Grants</h2>
        <div className="network-nav-item" style={{background: '#f1f5f9', color:'var(--text-primary)'}}><span>Active Projects</span><span style={{fontWeight: 600}}>4</span></div>
        <div className="network-nav-item"><span>Past Grants</span><span style={{fontWeight: 600}}>12</span></div>
        <div className="network-nav-item"><span>Funding Bodies</span><span style={{fontWeight: 600}}>5</span></div>
      </div>
      <div>
        <div className="card" style={{ padding: 24 }}>
           <h1 style={{fontSize: 24, fontWeight: 700, marginBottom: 24}}>My Research Labs</h1>
           
           <div className="item-card">
              <div className="item-icon" style={{background: 'var(--accent-light)'}}><Microscope /></div>
              <div className="item-content">
                 <h3>Quantum Materials Discovery Lab</h3>
                 <div className="item-meta">Director: {user?.name || 'Dr. Researcher'} • 14 Collaborators</div>
                 <div className="item-description">Focuses on high-throughput screening using hybrid quantum-classical algorithms. Currently exploring topologically protected states in 2D materials.</div>
                 <div style={{marginTop: 12}}><button className="btn-secondary">Manage Lab <ExternalLink size={14} style={{marginLeft:4, verticalAlign: 'middle'}}/></button></div>
              </div>
           </div>
           
           <h2 style={{fontSize: 20, fontWeight: 700, margin: '32px 0 24px'}}>Active Grants</h2>
           
           <div className="item-card">
              <div className="item-icon" style={{background: '#fef3c7', color: '#f59e0b'}}><Award /></div>
              <div className="item-content">
                 <h3>NSF Quantum Leap Challenge Institute</h3>
                 <div className="item-meta">National Science Foundation • $1.2M • 2024 - 2027</div>
                 <div className="item-description">Funding to accelerate hybrid AI-Quantum physics simulations.</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
