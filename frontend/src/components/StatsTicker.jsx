import React from 'react';
import '../styles/components.css';

const StatsTicker = () => {
  const content = (
    <div style={styles.tickerContent}>
      <span>🏠 ₹500Cr+ lost annually</span>
      <span style={styles.dot}>&middot;</span>
      <span>⚡ 847 scams detected</span>
      <span style={styles.dot}>&middot;</span>
      <span>🛡️ 94% accuracy</span>
      <span style={styles.dot}>&middot;</span>
      <span>🇮🇳 6 cities covered</span>
      <span style={styles.dot}>&middot;</span>
      <span>👤 15M+ renters at risk</span>
      <span style={styles.dot}>&middot;</span>
      <span>🔒 Zero data stored</span>
      <span style={styles.dot}>&middot;</span>
    </div>
  );

  return (
    <section style={styles.tickerContainer} className="ticker-wrapper">
      <div style={styles.tickerTrack} className="ticker-track">
        {/* We duplicate the content 3 times to create a seamless infinite loop */}
        {content}
        {content}
        {content}
      </div>
    </section>
  );
};

const styles = {
  tickerContainer: {
    backgroundColor: 'var(--fg)',
    color: 'var(--bg)',
    padding: '20px 0',
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    whiteSpace: 'nowrap',
    width: '100vw',
    left: '50%',
    right: '50%',
    marginLeft: '-50vw',
    marginRight: '-50vw',
  },
  tickerTrack: {
    display: 'flex',
    width: 'fit-content',
    animation: 'scrollTicker 20s linear infinite',
  },
  tickerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
    paddingRight: '32px',
    fontFamily: "var(--font-mono)",
    fontSize: '12px',
  },
  dot: {
    color: 'var(--muted)',
    opacity: 0.5,
  }
};

// Insert keyframes and hover state into document head
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes scrollTicker {
      0% { transform: translateX(0); }
      100% { transform: translateX(-33.333333%); } /* Since we have 3 identical children, we translate by Exactly 1/3 of the total width */
    }
    .ticker-wrapper:hover .ticker-track {
      animation-play-state: paused;
    }
  `;
  document.head.appendChild(style);
}

export default StatsTicker;
