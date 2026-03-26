import React from 'react';
import { Search, Edit, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Messaging() {
  const { user } = useAuth();
  return (
    <div className="network-layout" style={{ gridTemplateColumns: '320px 1fr' }}>
      <div className="card" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 16, borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600 }}>Messaging</h2>
          <Edit size={18} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} />
        </div>
        <div style={{ padding: '12px 16px' }}>
          <div className="search-box" style={{ width: '100%', background: '#f8fafc' }}>
            <Search className="search-icon" size={16} />
            <input type="text" placeholder="Search messages" className="search-input" />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div className="network-nav-item" style={{ padding: 16, borderBottom: '1px solid var(--border-color)', background: '#f1f5f9' }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <div className="share-avatar" style={{ width: 48, height: 48, flex: 'none' }}>JW</div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '220px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>James Wilson</span>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>11:42 AM</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '220px' }}>
                  Sure, I can review the manuscript tonight.
                </div>
              </div>
            </div>
          </div>
          <div className="network-nav-item" style={{ padding: 16, borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <div className="share-avatar" style={{ width: 48, height: 48, flex: 'none', background: '#10b981' }}>ER</div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '220px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Elena Rodriguez</span>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Yesterday</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '220px' }}>
                  Thanks for citing our BaFe2As2 dataset!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 16, borderBottom: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600 }}>James Wilson</h2>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Postdoc Researcher | Quantum Chemistry</div>
        </div>
        <div style={{ flex: 1, padding: 24, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ alignSelf: 'flex-start', background: '#f1f5f9', padding: '12px 16px', borderRadius: '0 16px 16px 16px', maxWidth: '70%' }}>
            Hey Dr. Researcher, did you see the latest paper on topological codes?
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 8, textAlign: 'right' }}>10:30 AM</div>
          </div>
          <div style={{ alignSelf: 'flex-end', background: 'var(--accent-color)', color: 'white', padding: '12px 16px', borderRadius: '16px 0 16px 16px', maxWidth: '70%' }}>
            Yes! Really interesting approach to scaling without cross-talk. We should discuss it at the lab meeting. Could you also review my manuscript tonight?
            <div style={{ fontSize: 11, color: '#e0f2fe', marginTop: 8, textAlign: 'right' }}>11:15 AM • {user?.name || 'Me'}</div>
          </div>
          <div style={{ alignSelf: 'flex-start', background: '#f1f5f9', padding: '12px 16px', borderRadius: '0 16px 16px 16px', maxWidth: '70%' }}>
            Sure, I can review the manuscript tonight. I'll leave comments on the PDF.
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 8, textAlign: 'right' }}>11:42 AM</div>
          </div>
        </div>
        <div style={{ padding: 16, borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <input type="text" placeholder="Write a message..." style={{ flex: 1, padding: '12px 16px', borderRadius: 24, border: '1px solid var(--border-color)', outline: 'none' }} />
            <button className="btn-primary" style={{ padding: '0 20px' }}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
