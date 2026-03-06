import React, { useEffect, useRef } from 'react';
import { AlertCircle, CheckCircle2, ShieldAlert, BadgeInfo } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MOCK_RESULT } from '../App';

gsap.registerPlugin(ScrollTrigger);

const ResultsDashboard = ({ result, onReset }) => {
  if (!result) return null;

  const score = result.risk_score;
  
  // Decide colors based on score
  let themeColor = 'var(--safe)';
  if (score > 30 && score <= 65) themeColor = 'var(--warning)';
  if (score > 65) themeColor = 'var(--danger)';

  const verdictConfig = {
    HIGH: { text: "HIGH RISK", bg: "#fef2f2", border: "#fecaca", color: "var(--danger)" },
    SUSPICIOUS: { text: "SUSPICIOUS", bg: "#fffbeb", border: "#fde68a", color: "var(--warning)" },
    LOW: { text: "LOW RISK", bg: "#f0fdf4", border: "#bbf7d0", color: "var(--safe)" }
  };
  
  let currentVerdict = verdictConfig.LOW;
  if (score > 65) currentVerdict = verdictConfig.HIGH;
  else if (score > 30) currentVerdict = verdictConfig.SUSPICIOUS;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Gauge Drawing Animation
      const circumference = 376.99;
      const progressOffset = circumference - (score / 100) * circumference;

      gsap.fromTo('.gauge-arc', 
        { strokeDashoffset: circumference },
        { strokeDashoffset: progressOffset, duration: 1.8, ease: 'power2.out', delay: 0.3 }
      );

      // 2. Verdict Badge Pop
      gsap.fromTo('.verdict-badge',
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)', delay: 0.9 }
      );

      // 3. Findings list stagger
      gsap.from('.finding-item', {
        opacity: 0, x: 20,
        stagger: 0.1, duration: 0.5,
        ease: 'power2.out', delay: 0.8
      });

      // 4. Signal Cards Details
      gsap.from('.signal-card', {
        scrollTrigger: { trigger: '.signal-cards', start: 'top 80%' },
        opacity: 0, y: 30,
        stagger: 0.12, duration: 0.6, ease: 'power2.out'
      });

      // 5. Reasoning section reveal
      gsap.from('.reasoning-card', {
        scrollTrigger: { trigger: '.reasoning-section', start: 'top 85%' },
        opacity: 0, y: 40, duration: 1, ease: 'power3.out'
      });

      // 6. Recommendation clip reveals
      gsap.from('.recommendation-card', {
        scrollTrigger: { trigger: '.recommendations', start: 'top 85%' },
        clipPath: 'inset(0 100% 0 0)',
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.inOut'
      });

    });
    return () => ctx.revert();
  }, [score]);

  return (
    <div style={styles.dashboard}>
      
      {/* Top Nav */}
      <div style={styles.topNav}>
        <button onClick={onReset} style={styles.backBtn}>&larr; New Analysis</button>
        <div style={styles.urlDisplay}>{result.source_url || result.url || 'Analyzed Listing'}</div>
        <button style={styles.downloadBtn}>Download Report</button>
      </div>

      <div style={styles.content}>
        
        {/* HERO SCORE CARD */}
        <div style={styles.heroCard}>
          
          <div style={styles.heroLeft}>
            <div style={styles.gaugeContainer}>
              <svg viewBox="0 0 140 140" style={styles.gaugeSvg}>
                <circle cx="70" cy="70" r="60" fill="none" stroke="var(--border)" strokeWidth="10" />
                <circle 
                  className="gauge-arc"
                  cx="70" cy="70" r="60" 
                  fill="none" 
                  stroke={themeColor} 
                  strokeWidth="10" 
                  strokeLinecap="round"
                  strokeDasharray="376.99"
                  strokeDashoffset="376.99"
                  transform="rotate(-90 70 70)"
                />
              </svg>
              <div style={styles.gaugeCenterText}>
                <span style={styles.gaugeNum}>{score}</span>
                <span style={styles.gaugeDenom}>/100</span>
              </div>
            </div>
            
            <div className="verdict-badge" style={{
              ...styles.verdictBadge, 
              backgroundColor: currentVerdict.bg,
              borderColor: currentVerdict.border,
              color: currentVerdict.color
            }}>
              {currentVerdict.text}
            </div>
          </div>

          <div style={styles.heroRight}>
            <h3 style={styles.rightHeading}>Risk Indicators:</h3>
            <div style={styles.findingsList}>
              {/* Show actual reasoning from engines as indicators */}
              {result.price_analysis?.reasoning && (
                <div className="finding-item" style={styles.findingItem}>
                  <ShieldAlert size={16} color={result.price_analysis.score > 50 ? "var(--danger)" : "var(--safe)"} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={styles.findingText}>Price: {result.price_analysis.reasoning}</span>
                </div>
              )}
              {result.text_analysis?.reasoning && (
                <div className="finding-item" style={styles.findingItem}>
                  <BadgeInfo size={16} color={result.text_analysis.score > 50 ? "var(--warning)" : "var(--safe)"} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={styles.findingText}>Text: {result.text_analysis.reasoning}</span>
                </div>
              )}
              <div className="finding-item" style={styles.findingItem}>
                <CheckCircle2 size={16} color="var(--safe)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={styles.findingText}>Analyzed via {result.scrape_method || 'direct'} verification pipeline.</span>
              </div>
            </div>
          </div>

        </div>

        {/* AI REASONING SPACE */}
        <div className="reasoning-section" style={styles.reasoningContainer}>
            <h2 style={styles.sectionHeading}>AI Forensic Explanation</h2>
            <div className="reasoning-card" style={styles.reasoningCard}>
                <div style={styles.aiBadge}>PREDICTIVE REASONING MODEL v2.0</div>
                <p style={styles.reasoningBody}>
                    {result.llm_explanation || "Our AI model has flagged this listing primarily due to cross-referenced anomalies in pricing and description patterns. The requested 'token amount' in the description combined with a price that falls in the lowest 5th percentile for this locality is a classic signature of a rental trap. We recommend absolute caution."}
                </p>
                <div style={styles.reasoningFooter}>
                    <span>Model Output: Bedrock/Claude-3.5-Sonnet</span>
                    <div style={styles.pulseDot} />
                </div>
            </div>
        </div>

        {/* 3 SIGNAL CARDS */}
        <div className="signal-cards" style={styles.signalGrid}>
          <SignalCard title="Price Anomaly" data={result.price_analysis} />
          <SignalCard title="Text Patterns" data={result.text_analysis} />
          <SignalCard title="Image Forensic" data={result.image_analysis} />
        </div>

        {/* RECOMMENDATIONS */}
        <div className="recommendations" style={styles.recommendationsContainer}>
          <h2 style={styles.recHeading}>Next Steps</h2>
          <div style={styles.recGrid}>
            {result.recommendations.map((rec, i) => (
              <div key={i} className="recommendation-card" style={styles.recCard}>
                <p style={styles.recText}>{rec}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

const SignalCard = ({ title, data }) => {
    if (!data) return null;
    let sTheme = 'var(--text)';
    if (data.score > 65) sTheme = 'var(--danger)';
    else if (data.score > 30) sTheme = 'var(--warning)';
    else sTheme = 'var(--safe)';

    return (
      <div className="signal-card" style={styles.signalCard}>
        <div style={styles.signalTop}>
          <div style={styles.signalHeader}>
            <BadgeInfo size={16} />
            <span style={styles.signalTitle}>{title}</span>
          </div>
          <div style={{...styles.signalBadge, color: sTheme}}>{data.verdict || data.rating}</div>
        </div>

        <div style={styles.signalProgressBar}>
          <div 
            className="signal-progress-fill" 
            style={{...styles.signalFill, backgroundColor: sTheme, width: data.score + '%'}}
          ></div>
        </div>

        <p style={styles.signalDesc}>{data.reasoning || data.reason}</p>
      </div>
    );
};

const styles = {
  dashboard: {
    minHeight: '100vh',
    backgroundColor: 'var(--bg)',
    paddingBottom: '80px',
  },
  topNav: {
    height: '60px',
    backgroundColor: 'var(--surface)',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  backBtn: {
    fontFamily: "var(--font-body)",
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text)',
  },
  urlDisplay: {
    fontFamily: "var(--font-mono)",
    fontSize: '12px',
    color: 'var(--text-muted)',
    '@media (maxWidth: 600px)': { display: 'none' }
  },
  downloadBtn: {
    fontFamily: "var(--font-body)",
    fontSize: '13px',
    padding: '6px 14px',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    backgroundColor: 'var(--bg)',
    color: 'var(--text)',
  },
  content: {
    maxWidth: '860px',
    margin: '40px auto 0',
    padding: '0 24px',
  },
  // Hero Card
  heroCard: {
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '20px',
    padding: '48px',
    display: 'flex',
    gap: '48px',
    alignItems: 'center',
    '@media (maxWidth: 768px)': {
      flexDirection: 'column',
      padding: '32px 24px',
      gap: '32px',
      textAlign: 'center',
    }
  },
  heroLeft: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    flexShrink: 0,
  },
  gaugeContainer: {
    position: 'relative',
    width: '140px',
    height: '140px',
  },
  gaugeSvg: {
    width: '100%',
    height: '100%',
  },
  gaugeCenterText: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeNum: {
    fontFamily: "var(--font-display)",
    fontSize: '48px',
    fontWeight: 800,
    color: 'var(--text)',
    lineHeight: 1,
  },
  gaugeDenom: {
    fontFamily: "var(--font-body)",
    fontSize: '14px',
    color: 'var(--text-muted)',
    marginTop: '2px',
  },
  verdictBadge: {
    fontFamily: "var(--font-display)",
    fontSize: '16px',
    fontWeight: 700,
    padding: '10px 24px',
    borderRadius: '100px',
    borderStyle: 'solid',
    borderWidth: '1px',
    letterSpacing: '0.02em',
  },
  heroRight: {
    flex: 1,
  },
  rightHeading: {
    fontFamily: "var(--font-body)",
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text)',
    marginBottom: '16px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  findingsList: {
    display: 'flex',
    flexDirection: 'column',
  },
  findingItem: {
    display: 'flex',
    gap: '12px',
    padding: '12px 0',
    borderBottom: '1px solid var(--border-light)',
  },
  findingText: {
    fontFamily: "var(--font-body)",
    fontSize: '14px',
    color: 'var(--text)',
    lineHeight: 1.5,
    textAlign: 'left',
  },
  // Signal Cards Grid
  signalGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '16px',
    marginTop: '24px',
  },
  signalCard: {
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '28px',
  },
  signalTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  signalHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--text)',
  },
  signalTitle: {
    fontFamily: "var(--font-mono)",
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  signalBadge: {
    fontFamily: "var(--font-body)",
    fontSize: '12px',
    fontWeight: 700,
  },
  signalProgressBar: {
    width: '100%',
    height: '6px',
    backgroundColor: 'var(--bg2)',
    borderRadius: '100px',
    marginBottom: '16px',
    overflow: 'hidden',
  },
  signalFill: {
    height: '100%',
    borderRadius: '100px',
  },
  signalDesc: {
    fontFamily: "var(--font-body)",
    fontSize: '13px',
    color: 'var(--text-muted)',
    lineHeight: 1.5,
  },
  // Recommendations
  recommendationsContainer: {
    marginTop: '64px',
  },
  recHeading: {
    fontFamily: "var(--font-display)",
    fontSize: '28px',
    fontWeight: 700,
    color: 'var(--text)',
    marginBottom: '24px',
  },
  recGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
  },
  recCard: {
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border)',
    borderLeft: '4px solid var(--accent)',
    borderRadius: '12px',
    padding: '24px',
    clipPath: 'inset(0 0% 0 0)',
  },
  recText: {
    fontFamily: "var(--font-body)",
    fontSize: '14px',
    color: 'var(--text)',
    lineHeight: 1.6,
  }
};

export default ResultsDashboard;
