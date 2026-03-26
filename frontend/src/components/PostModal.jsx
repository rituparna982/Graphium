import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Video, Calendar, MoreHorizontal, Globe, ChevronDown, Smile, FileText, Hash } from 'lucide-react';
import api from '../api/axios';

export default function PostModal({ isOpen, onClose, user, profile, onPostSuccess }) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!content.trim() && !image) return;
    
    setIsPosting(true);
    try {
      // For now, we only have a content field in the backend
      // In a real app, we'd use FormData for images
      await api.post('/api/posts', { 
        content: content,
        // attachment: image ? { type: 'image', data: imagePreview } : null 
      });
      
      setContent('');
      setImage(null);
      setImagePreview(null);
      onPostSuccess();
      onClose();
    } catch (err) {
      alert("Failed to post. Please try again.");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create a post</h2>
          <button className="modal-close-btn" onClick={onClose}><X size={24} /></button>
        </div>

        <div className="modal-body">
          <div className="modal-user-info">
            <div className="share-avatar" style={{ width: 48, height: 48, fontSize: 20 }}>
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="modal-user-details">
              <h3>{user?.name || 'Researcher'}</h3>
              <div className="modal-privacy-select">
                <Globe size={12} />
                <span>Anyone</span>
                <ChevronDown size={12} />
              </div>
            </div>
          </div>

          <textarea 
            className="modal-textarea"
            placeholder="What do you want to talk about?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            autoFocus
          />

          {imagePreview && (
            <div className="modal-image-preview">
              <img src={imagePreview} alt="Preview" />
              <button className="remove-image-btn" onClick={removeImage}><X size={16} /></button>
            </div>
          )}

          <div style={{ marginTop: 12 }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <Smile size={20} color="var(--text-secondary)" />
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <div className="modal-toolbar">
            <input 
              type="file" 
              accept="image/*" 
              style={{ display: 'none' }} 
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            <ImageIcon className="toolbar-icon" size={20} onClick={() => fileInputRef.current.click()} />
            <Video className="toolbar-icon" size={20} />
            <FileText className="toolbar-icon" size={20} />
            <Calendar className="toolbar-icon" size={20} />
            <MoreHorizontal className="toolbar-icon" size={20} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20, color: 'var(--border-color)' }}>|</span>
            <button 
              className="btn-primary" 
              onClick={handleSubmit}
              disabled={(!content.trim() && !image) || isPosting}
              style={{
                borderRadius: '24px',
                padding: '6px 16px',
                opacity: (!content.trim() && !image) ? 0.5 : 1
              }}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
