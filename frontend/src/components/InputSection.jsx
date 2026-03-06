import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'lucide-react';
import '../styles/components.css';

gsap.registerPlugin(ScrollTrigger);

const InputSection = () => {
  const [activeTab, setActiveTab] = useState('url');
  const [urlInput, setUrlInput] = useState('');

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal the main heading
      gsap.from('.input-heading', {
        scrollTrigger: { trigger: '.input-section', start: 'top 80%' },
        y: 40, opacity: 0, duration: 0.8, ease: 'power3.out'
      });
      
      // Reveal the input container 
      gsap.from('.input-container', {
        scrollTrigger: { trigger: '.input-section', start: 'top 75%' },
        y: 20, opacity: 0, duration: 0.6, delay: 0.2, ease: 'power2.out'
      });
    });
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Transition to analyzing state would happen here in the real App
    const event = new CustomEvent('startAnalysis', { detail: { url: urlInput } });
    window.dispatchEvent(event);
  };

  return (
    <section className="input-section" style={styles.section} id="input-section">
      <div style={styles.container}>
        
        <h2 className="input-heading" style={styles.heading}>Check Your Listing</h2>
        
        <div className="input-container" style={styles.contentWrapper}>
          
          {/* Tabs */}
          <div style={styles.tabContainer}>
            <button 
              style={{...styles.tabBtn, ...(activeTab === 'url' ? styles.tabActive : {})}}
              onClick={() => setActiveTab('url')}
            >
              🔗 Paste URL
            </button>
            <button 
              style={{...styles.tabBtn, ...(activeTab === 'manual' ? styles.tabActive : {})}}
              onClick={() => setActiveTab('manual')}
            >
              📋 Enter Details
            </button>
          </div>

          {/* Form Content */}
          <div style={styles.formArea}>
            {activeTab === 'url' && (
              <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <div style={styles.inputWrapper}>
                  <Link size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                  <input 
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://99acres.com/..."
                    style={styles.input}
                    required
                  />
                  <button type="submit" style={styles.submitBtn}>
                    Analyze &rarr;
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'manual' && (
              <div style={styles.manualPlaceholder}>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                  Manual detail entry coming soon. Paste a URL for now.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

const styles = {
  section: {
    backgroundColor: 'var(--bg2)',
    padding: '100px 48px',
    display: 'flex',
    justifyContent: 'center',
    '@media (maxWidth: 768px)': {
      padding: '60px 24px',
    }
  },
  container: {
    maxWidth: '680px',
    width: '100%',
    textAlign: 'center',
  },
  heading: {
    fontFamily: "var(--font-display)",
    fontSize: 'clamp(36px, 4.5vw, 48px)',
    fontWeight: 800,
    color: 'var(--text)',
    marginBottom: '48px',
  },
  contentWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '32px',
  },
  tabContainer: {
    backgroundColor: 'var(--bg)',
    borderRadius: '100px',
    padding: '4px',
    display: 'inline-flex',
    border: '1px solid var(--border)',
  },
  tabBtn: {
    fontFamily: "var(--font-body)",
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-muted)',
    padding: '8px 20px',
    borderRadius: '100px',
    transition: 'all 0.2s ease',
  },
  tabActive: {
    backgroundColor: 'var(--surface)',
    color: 'var(--text)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  formArea: {
    width: '100%',
  },
  inputWrapper: {
    backgroundColor: 'var(--surface)',
    border: '1.5px solid var(--border)',
    borderRadius: '14px',
    padding: '6px 6px 6px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'all 0.2s ease',
    // Hover/focus effects would usually be handled in CSS classes, but here's a rough approximation for standard state
  },
  input: {
    flex: 1,
    fontFamily: "var(--font-body)",
    fontSize: '15px',
    color: 'var(--text)',
    border: 'none',
    backgroundColor: 'transparent',
    minWidth: '0', // prevents flex overflow
  },
  submitBtn: {
    backgroundColor: 'var(--text)',
    color: 'var(--bg)',
    fontFamily: "var(--font-body)",
    fontWeight: 600,
    fontSize: '14px',
    padding: '12px 24px',
    borderRadius: '10px',
    whiteSpace: 'nowrap',
  },
  manualPlaceholder: {
    padding: '40px',
    backgroundColor: 'var(--surface)',
    border: '1px dashed var(--border)',
    borderRadius: '14px',
  }
};

export default InputSection;
