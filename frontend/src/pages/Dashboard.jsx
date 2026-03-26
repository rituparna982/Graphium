import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Microscope, Database, Calendar, TrendingUp, ThumbsUp, MessageSquare, Bookmark, Quote, Globe, FileText, CheckCircle, Edit, Library } from 'lucide-react';
import PostModal from '../components/PostModal';

export default function Dashboard() {
  const { user } = useAuth();
  const [postContent, setPostContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feed, setFeed] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [savedSet, setSavedSet] = useState(new Set(user?.savedPosts || []));
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [commentsCache, setCommentsCache] = useState({});
  const [newComment, setNewComment] = useState('');

  const fetchData = async () => {
    try {
      const [feedRes, profileRes] = await Promise.all([
        api.get('/api/posts'),
        api.get('/api/profile').catch(() => ({ data: null }))
      ]);
      setFeed(feedRes.data);
      setProfile(profileRes.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    try {
      await api.post('/api/posts', { content: postContent });
      setPostContent('');
      fetchData();
    } catch (e) {
      alert("Failed to share update.");
    }
  };

  const toggleLike = async (postId) => {
    try {
      const res = await api.post(`/api/posts/${postId}/like`);
      setFeed(feed.map(p => (p._id || p.id) === postId ? {
         ...p, 
         likes: res.data.likes,
         likedBy: res.data.isLiked ? [...(p.likedBy || []), user?._id] : (p.likedBy || []).filter(id => id !== user?._id)
      } : p));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSave = async (postId) => {
    try {
      const res = await api.post(`/api/posts/${postId}/save`);
      setSavedSet(prev => {
        const newSet = new Set(prev);
        if (res.data.isSaved) newSet.add(postId);
        else newSet.delete(postId);
        return newSet;
      });
    } catch(err) {
      console.error(err);
    }
  };

  const toggleComments = async (postId) => {
    if (activeCommentPost === postId) {
      setActiveCommentPost(null);
    } else {
      setActiveCommentPost(postId);
      if (!commentsCache[postId]) {
        try {
          const res = await api.get(`/api/posts/${postId}/comments`);
          setCommentsCache(prev => ({...prev, [postId]: res.data}));
        } catch(err) {
          console.error(err);
        }
      }
    }
  };

  const submitComment = async (postId) => {
    if (!newComment.trim()) return;
    try {
      const res = await api.post(`/api/posts/${postId}/comment`, { content: newComment });
      setCommentsCache(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), res.data]
      }));
      setFeed(feed.map(p => (p._id || p.id) === postId ? { ...p, comments: p.comments + 1 } : p));
      setNewComment('');
    } catch(err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading-state"><p>Loading feed...</p></div>;

  return (
    <div className="core-rail">
      {/* Left Column */}
      <div>
        <div className="card mini-profile-card">
          <div className="mini-profile-bg"></div>
          <div className="mini-profile-avatar">{user?.name?.charAt(0) || 'U'}</div>
          <div className="mini-profile-name">{user?.name || 'Researcher'}</div>
          <div className="mini-profile-title">{profile?.title || 'Researcher'}</div>
          <div className="mini-profile-stats">
            <div className="stat-row"><span>H-Index</span><span className="stat-value">{profile?.stats?.hIndex || 0}</span></div>
            <div className="stat-row"><span>Total Citations</span><span className="stat-value">{profile?.stats?.citations?.toLocaleString() || 0}</span></div>
          </div>
          <div className="stat-row" style={{ padding: 16, justifyContent: 'flex-start', gap: 8, borderTop: '1px solid var(--border-color)' }}>
             <Library size={18} /> My Library
          </div>
        </div>

        <div className="card widget-card" style={{ padding: 16 }}>
          <div className="widget-title">Active Projects</div>
          <div className="widget-item">
             <div className="widget-item-icon"><Microscope size={18} /></div>
             <div className="widget-item-text"><strong>Q-Sim Lab</strong> 12 collaborators</div>
          </div>
          <div className="widget-item">
             <div className="widget-item-icon"><Database size={18} /></div>
             <div className="widget-item-text"><strong>Material Dataset</strong> Open Source</div>
          </div>
        </div>

        <div className="card news-widget" style={{ marginTop: 16 }}>
          <h2 className="news-header"><Calendar size={18} /> Upcoming Deadlines</h2>
          <ul className="news-list">
            <li className="news-item">
              <div className="news-title">NSF Quantum Leap Challenge Institute <span className="grant-badge">Grant</span></div>
              <div className="news-meta">Due in 14 days • $5M funding available</div>
            </li>
            <li className="news-item">
              <div className="news-title">NeurIPS 2026 Paper Submission</div>
              <div className="news-meta">Due in 28 days • 12,492 interested</div>
            </li>
          </ul>
        </div>
        <div className="card news-widget">
          <h2 className="news-header"><TrendingUp size={18} color="#10b981" /> Trending Papers</h2>
          <ul className="news-list">
            <li className="news-item">
              <div className="news-title">Room-temperature superconductivity in carbonaceous sulfur...</div>
              <div className="news-meta">Nature • 142 recommendations</div>
            </li>
            <li className="news-item">
              <div className="news-title">Transformers scale to 10 Trillion parameters</div>
              <div className="news-meta">ArXiv • 8,921 readers</div>
            </li>
          </ul>
        </div>
      </div>

      {/* Center Column */}
      <div>
        <div className="card share-box share-box-v2">
          <div className="share-bar">
            <div className="share-avatar" style={{ width: 48, height: 48, fontSize: 20 }}>
              {user?.name?.charAt(0) || 'U'}
            </div>
            <button className="share-trigger" onClick={() => setIsModalOpen(true)}>
              Start a post
            </button>
          </div>
          <div className="share-actions-v2">
            <div className="share-action-item" onClick={() => setIsModalOpen(true)}>
              <FileText size={20} color="#378fe9" />
              <span>Media</span>
            </div>
            <div className="share-action-item" onClick={() => setIsModalOpen(true)}>
              <Calendar size={20} color="#c37d16" />
              <span>Event</span>
            </div>
            <div className="share-action-item" onClick={() => setIsModalOpen(true)}>
              <Edit size={20} color="#e06847" />
              <span>Write article</span>
            </div>
          </div>
        </div>

        <PostModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          user={user}
          profile={profile}
          onPostSuccess={fetchData}
        />
        <div className="feed-container">
          {feed.map(item => (
            <div key={item._id || item.id} className="card feed-post interactive">
              <div className="post-header">
                <div className="share-avatar" style={{width: 48, height: 48, fontSize: 20}}>{item.author?.name?.charAt(0) || 'U'}</div>
                <div className="post-author-info">
                  <div className="post-author-name">{item.author?.name || 'Unknown Researcher'}</div>
                  <div className="post-author-headline">{item.action} • {item.target}</div>
                  <div className="post-time">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Just now'} • <Globe size={12} /></div>
                </div>
              </div>
              <div className="post-body">{item.content}</div>
              
              {item.attachment && (
                <div className="post-attachment">
                  <div className="post-attachment-header">
                     <span className="attachment-title">{item.attachment.title}</span>
                     <span className="attachment-type">{item.attachment.type}</span>
                  </div>
                  <div className="post-attachment-body">{item.attachment.desc}</div>
                </div>
              )}

              <div className="post-stats">
                <span><ThumbsUp size={14} color="var(--accent-color)" style={{ verticalAlign: 'middle', marginRight: 4 }} /> {item.likes}</span>
                <span>{item.comments} comments • {item.citations || 0} citations</span>
              </div>
              <div className="post-actions">
                <button 
                  className="post-action-btn" 
                  onClick={() => toggleLike(item._id || item.id)}
                  style={{ color: item.likedBy?.includes(user?._id) ? 'var(--accent-color)' : 'inherit' }}
                >
                  <ThumbsUp size={18}/> {item.likedBy?.includes(user?._id) ? 'Liked' : 'Recommend'}
                </button>
                <button 
                  className="post-action-btn"
                  onClick={() => toggleComments(item._id || item.id)}
                >
                  <MessageSquare size={18}/> Comment
                </button>
                <button 
                  className="post-action-btn"
                  onClick={() => toggleSave(item._id || item.id)}
                  style={{ color: savedSet.has(item._id || item.id) ? 'var(--accent-color)' : 'inherit' }}
                >
                  <Bookmark size={18}/> {savedSet.has(item._id || item.id) ? 'Saved' : 'Save'}
                </button>
                <button className="post-action-btn"><Quote size={18}/> Cite</button>
              </div>

              {activeCommentPost === (item._id || item.id) && (
                <div className="comments-section" style={{ marginTop: 12, borderTop: '1px solid var(--border-color)', paddingTop: 12 }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                    <div className="share-avatar" style={{width: 32, height: 32, fontSize: 14, flexShrink: 0}}>{user?.name?.charAt(0) || 'U'}</div>
                    <div style={{ display: 'flex', flex: 1, gap: 8 }}>
                      <input 
                        type="text" 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..." 
                        style={{ flex: 1, padding: '8px 12px', borderRadius: 20, border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                        onKeyDown={(e) => { if (e.key === 'Enter') submitComment(item._id || item.id); }}
                      />
                      <button className="btn-primary" onClick={() => submitComment(item._id || item.id)} style={{ borderRadius: 20, padding: '0 16px' }}>Post</button>
                    </div>
                  </div>
                  
                  <div className="comments-list">
                    {(commentsCache[item._id || item.id] || []).map(comment => (
                      <div key={comment._id} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                        <div className="share-avatar" style={{width: 32, height: 32, fontSize: 14, flexShrink: 0}}>{comment.author?.name?.charAt(0) || 'U'}</div>
                        <div style={{ background: 'var(--bg-secondary)', padding: '8px 12px', borderRadius: 8, flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{comment.author?.name || 'User'}</div>
                          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{comment.content}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
