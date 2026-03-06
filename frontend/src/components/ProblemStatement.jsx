import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ProblemStatement = () => {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Big number slide in
      gsap.from('.big-number', {
        scrollTrigger: { 
          trigger: '.problem-section', 
          start: 'top 70%' 
        },
        opacity: 0, 
        x: -60, 
        duration: 0.8, 
        ease: 'power2.out'
      });
      
      // Cards clip reveal staggering
      gsap.from('.problem-card', {
        scrollTrigger: { 
          trigger: '.problem-section', 
          start: 'top 60%' 
        },
        clipPath: 'inset(0 100% 0 0)',
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.inOut'
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="problem-section" className="problem-section" style={styles.section}>
      <div style={styles.container}>
        
        {/* Left Side: Big Text */}
        <div style={styles.leftCol}>
          <div className="big-number" style={styles.numberWrapper}>
            <div style={styles.massiveNumber}>₹500Cr+</div>
            <h2 style={styles.heading}>lost to rental fraud every year in India</h2>
          </div>
        </div>

        {/* Right Side: Clarifying Cards */}
        <div style={styles.rightCol}>
          
          <div className="problem-card" style={{...styles.card, borderLeftColor: 'var(--danger)'}}>
            <h3 style={styles.cardTitle}>Stolen Photos</h3>
            <p style={styles.cardDesc}>Scammers reuse images across dozens of fake listings to create authentic-looking traps.</p>
          </div>

          <div className="problem-card" style={{...styles.card, borderLeftColor: 'var(--warning)'}}>
            <h3 style={styles.cardTitle}>Fake Pricing</h3>
            <p style={styles.cardDesc}>Listings are priced 40-50% below market rate to lure in desperate renters looking for a deal.</p>
          </div>

          <div className="problem-card" style={{...styles.card, borderLeftColor: 'var(--warning)'}}>
            <h3 style={styles.cardTitle}>Vanishing Brokers</h3>
            <p style={styles.cardDesc}>Pressure tactics trick users into paying advance token amounts before the "broker" disappears.</p>
          </div>

        </div>
      </div>
    </section>
  );
};

const styles = {
  section: {
    backgroundColor: 'var(--bg)',
    padding: '120px 48px',
    '@media (maxWidth: 768px)': {
      padding: '80px 24px',
    }
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '64px',
    alignItems: 'center',
    '@media (maxWidth: 900px)': {
      gridTemplateColumns: '1fr',
      gap: '48px',
    }
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  numberWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  massiveNumber: {
    fontFamily: "var(--font-display)",
    fontSize: 'clamp(72px, 8vw, 96px)',
    fontWeight: 800,
    color: 'var(--border)',
    lineHeight: 1,
    letterSpacing: '-0.04em',
    marginBottom: '8px',
    marginLeft: '-4px', // optical alignment
  },
  heading: {
    fontFamily: "var(--font-display)",
    fontSize: 'clamp(24px, 3vw, 32px)',
    fontWeight: 700,
    color: 'var(--text)',
    maxWidth: '400px',
    lineHeight: 1.2,
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  card: {
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border)',
    borderLeftWidth: '3px',
    borderRadius: '12px',
    padding: '24px',
    // We start them fully revealed in CSS, and GSAP clips them 'from' 100% hidden
    clipPath: 'inset(0 0% 0 0)', 
  },
  cardTitle: {
    fontFamily: "var(--font-display)",
    fontSize: '18px',
    fontWeight: 700,
    marginBottom: '8px',
    color: 'var(--text)',
  },
  cardDesc: {
    fontFamily: "var(--font-body)",
    fontSize: '15px',
    color: 'var(--text-muted)',
    lineHeight: 1.6,
  }
};

export default ProblemStatement;
