import React, { useEffect, useState } from 'react';
import { Search, MapPin, Image as ImageIcon, ShieldCheck } from 'lucide-react';
import { gsap } from 'gsap';

const AnalysisScreen = ({ url }) => {
  const [activeStage, setActiveStage] = useState(0);

  const stages = [
    { title: 'Fetching Data', icon: Search },
    { title: 'Price Analysis', icon: MapPin },
    { title: 'Image Verification', icon: ImageIcon },
    { title: 'Risk Calculation', icon: ShieldCheck }
  ];

  useEffect(() => {
    const startAnalysis = async () => {
      try {
        // Stage 1: Starting
        setActiveStage(0);
        
        // Prepare Form Data for Backend
        const formData = new FormData();
        formData.append('url', url);

        // Make the live API request
        const response = await fetch('http://localhost:8080/analyze/url', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) throw new Error('Network response was not ok');
        
        const result = await response.json();

        // Artificial delay for cinematic effect while stages progress
        setTimeout(() => setActiveStage(1), 800);
        setTimeout(() => setActiveStage(2), 1600);
        setTimeout(() => setActiveStage(3), 2400);
        
        setTimeout(() => {
          const event = new CustomEvent('analysisComplete', { detail: { result } });
          window.dispatchEvent(event);
        }, 3200);

      } catch (error) {
        console.error('Analysis failed:', error);
        // Fallback or error state
        setTimeout(() => {
            const event = new CustomEvent('analysisComplete', { detail: { error: true } });
            window.dispatchEvent(event);
        }, 1000);
      }
    };

    startAnalysis();

    // Progress Bar GSAP Animation
    gsap.to('.progress-fill', {
      width: '100%',
      duration: 3.2,
      ease: 'linear'
    });

    return () => {};
  }, [url]);

  return (
    <div style={styles.screen}>
      <div style={styles.centerContainer}>
        
        <h2 style={styles.heading}>Analyzing your listing...</h2>
        <div style={styles.urlDisplay}>{url || 'https://example.com/listing'}</div>

        <div style={styles.grid}>
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            
            let stateStyle = styles.cardWaiting;
            let iconColor = 'var(--text-subtle)';
            
            if (activeStage === idx) {
              stateStyle = styles.cardActive;
              iconColor = 'var(--accent-dark)';
            } else if (activeStage > idx) {
              stateStyle = styles.cardDone;
              iconColor = 'var(--safe)';
            }

            return (
              <div key={idx} style={{...styles.cardBase, ...stateStyle}}>
                <Icon size={24} color={iconColor} className={activeStage === idx ? "spin-pulse" : ""} />
                <span style={styles.cardTitle}>{stage.title}</span>
              </div>
            );
          })}
        </div>

      </div>

      {/* Bottom Progress Bar */}
      <div style={styles.progressTrack}>
        <div className="progress-fill" style={styles.progressFill}></div>
      </div>
    </div>
  );
};

const styles = {
  screen: {
    height: '100vh',
    width: '100vw',
    backgroundColor: 'var(--bg)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerContainer: {
    maxWidth: '500px',
    width: '100%',
    padding: '0 24px',
    textAlign: 'center',
  },
  heading: {
    fontFamily: "var(--font-display)",
    fontSize: '32px',
    fontWeight: 700,
    color: 'var(--text)',
    marginBottom: '8px',
  },
  urlDisplay: {
    fontFamily: "var(--font-mono)",
    fontSize: '12px',
    color: 'var(--text-muted)',
    marginBottom: '48px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    '@media (maxWidth: 400px)': {
      gridTemplateColumns: '1fr',
    }
  },
  cardBase: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    padding: '32px 16px',
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
  },
  cardWaiting: {
    opacity: 0.4,
  },
  cardActive: {
    opacity: 1,
    borderColor: 'var(--accent)',
    backgroundColor: 'rgba(200,232,50,0.04)',
    boxShadow: '0 8px 24px rgba(200,232,50,0.1)',
  },
  cardDone: {
    opacity: 1,
    borderColor: 'var(--safe)',
  },
  cardTitle: {
    fontFamily: "var(--font-body)",
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text)',
  },
  progressTrack: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '3px',
    backgroundColor: 'var(--border)',
  },
  progressFill: {
    height: '100%',
    width: '0%', // GSAP takes over
    backgroundColor: 'var(--accent)',
  }
};

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes subtlePulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.1); opacity: 0.7; }
      100% { transform: scale(1); opacity: 1; }
    }
    .spin-pulse {
      animation: subtlePulse 1s ease-in-out infinite;
    }
  `;
  document.head.appendChild(style);
}

export default AnalysisScreen;
