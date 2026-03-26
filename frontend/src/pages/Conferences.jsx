import React from 'react';
import { Calendar, MapPin, Globe } from 'lucide-react';

export default function Conferences() {
  return (
    <div className="core-rail">
      <div>
        <div className="card widget-card">
           <div className="widget-title">My Schedule</div>
           <div className="widget-item">
              <div className="widget-item-icon" style={{background:'var(--accent-color)', color:'white'}}><span>Mar</span></div>
              <div className="widget-item-text"><strong>APS March Meeting</strong> Los Angeles, CA</div>
           </div>
           <div className="widget-item">
              <div className="widget-item-icon" style={{background:'#10b981', color:'white'}}><span>Dec</span></div>
              <div className="widget-item-text"><strong>NeurIPS 2026</strong> Virtual</div>
           </div>
        </div>
      </div>
      <div style={{ gridColumn: 'span 2' }}>
        <div className="card" style={{ padding: 24 }}>
          <h1 style={{fontSize: 24, fontWeight: 700, marginBottom: 24}}>Upcoming Conferences & Call for Papers</h1>
          
          <div className="item-card">
             <div className="item-icon"><Calendar /></div>
             <div className="item-content">
                <h3>International Conference on Quantum Networking (ICQN 2026)</h3>
                <div className="item-meta"><MapPin size={14} style={{verticalAlign:-2}}/> Geneva, Switzerland • Sept 12-15, 2026</div>
                <div className="item-description" style={{marginBottom: 12}}>The premier venue for quantum communications and networking research. Accepting full papers and posters until May 1st.</div>
                <div><span className="grant-badge" style={{background:'#e0f2fe', color:'#0284c7'}}>Submission Deadline: May 1, 2026</span></div>
             </div>
             <div>
                <button className="btn-primary">Submit Paper</button>
             </div>
          </div>
          
          <div className="item-card">
             <div className="item-icon"><Globe /></div>
             <div className="item-content">
                <h3>NeurIPS 2026</h3>
                <div className="item-meta"><Globe size={14} style={{verticalAlign:-2}}/> Virtual • Dec 1-14, 2026</div>
                <div className="item-description" style={{marginBottom: 12}}>39th Annual Conference on Neural Information Processing Systems.</div>
                <div><span className="grant-badge" style={{background:'#fee2e2', color:'#ef4444'}}>Submission Deadline: Jun 15, 2026</span></div>
             </div>
             <div>
                <button className="btn-secondary">View Event</button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
