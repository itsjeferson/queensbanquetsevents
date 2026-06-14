import { useState } from 'react';
import Button from '../../components/common/Button/Button';

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState('homepage');

  return (
    <>
      <div className="dash-header">
        <h1>Content Management</h1>
        <p>Edit website content, banners, and testimonials.</p>
      </div>
      <div className="tab-nav">
        {['homepage', 'about', 'testimonials'].map((tab) => (
          <button
            key={tab}
            type="button"
            className={`tab-btn${activeTab === tab ? ' active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      {activeTab === 'homepage' && (
        <div className="card-widget">
          <h3>Hero Banner</h3>
          <div className="form-group"><label>Headline</label><input defaultValue="Crafting Unforgettable Moments" /></div>
          <div className="form-group"><label>Subheadline</label><textarea style={{ minHeight: 80 }} defaultValue="From intimate gatherings to grand celebrations, we transform your vision into extraordinary experiences that last a lifetime." /></div>
          <div className="form-group"><label>CTA Button Text</label><input defaultValue="Explore Packages" /></div>
          <div className="form-group">
            <label>Banner Image</label>
            <div className="upload-zone"><div className="upload-icon">🖼️</div><div className="upload-text"><strong>Click to upload banner</strong><br />Recommended: 1920x1080px</div></div>
          </div>
          <Button variant="gold">Save Changes</Button>
        </div>
      )}
      {activeTab === 'about' && (
        <div className="card-widget">
          <h3>About Page Content</h3>
          <div className="form-group"><label>Company Description</label><textarea style={{ minHeight: 120 }} defaultValue="Founded in 2012, Velura Events began with a simple belief..." /></div>
          <div className="form-group"><label>Years of Experience</label><input defaultValue="12+" /></div>
          <div className="form-group"><label>Events Completed</label><input defaultValue="500+" /></div>
          <Button variant="gold">Save Changes</Button>
        </div>
      )}
      {activeTab === 'testimonials' && (
        <div className="card-widget">
          <h3>Testimonials</h3>
          <div style={{ border: '1px solid var(--border-soft)', borderRadius: 10, padding: 16, marginBottom: 20 }}>
            <div className="form-row">
              <div className="form-group"><label>Client Name</label><input defaultValue="Maria Reyes" /></div>
              <div className="form-group"><label>Event Type</label><input defaultValue="Wedding — Oct 2024" /></div>
            </div>
            <div className="form-group"><label>Testimonial</label><textarea style={{ minHeight: 80 }} defaultValue="Velura made our wedding absolutely magical..." /></div>
            <button type="button" className="action-btn danger">Remove</button>
          </div>
          <Button variant="outline">+ Add Testimonial</Button>
        </div>
      )}
    </>
  );
}
