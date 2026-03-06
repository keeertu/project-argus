import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import HowItWorks from './components/HowItWorks';
import DetectionEngines from './components/DetectionEngines';
import RiskScoreDemo from './components/RiskScoreDemo';
import ImpactSection from './components/ImpactSection';
import CallToAction from './components/CallToAction';
import AnalysisScreen from './components/AnalysisScreen';
import ResultsDashboard from './components/ResultsDashboard';
import Footer from './components/Footer';

// A massive mock data object identical to what the backend would return.
export const MOCK_RESULT = {
  "url": "https://www.99acres.com/rent/2bhk-flat-koramangala-bangalore",
  "risk_score": 74,
  "verdict": "HIGH RISK",
  "breakdown": {
    "signals": {
      "price_anomaly": {
        "score": 85,
        "rating": "High Risk",
        "reason": "Price is 45% below the expected market median for a 2BHK in Koramangala (Expected: ₹28,000, Listed: ₹15,000)."
      },
      "image_authenticity": {
        "score": 60,
        "rating": "Suspicious",
        "reason": "Images detected in 12 other listings across 3 different cities. Likely stolen from a genuine property."
      },
      "text_analysis": {
        "score": 90,
        "rating": "High Risk",
        "reason": "Description contains extreme urgency markers ('call immediately', 'last chance') and demands advance token payment before seeing."
      },
      "broker_history": {
        "score": 10,
        "rating": "Low Risk",
        "reason": "Broker phone number is relatively new but has no verified fraud complaints in the database."
      }
    },
    "findings": [
      "Listing price is dangerously below market average.",
      "High urgency language detected combined with demands for money.",
      "Images appear to be cloned from a luxury property in Mumbai.",
      "The contact number was registered less than 2 weeks ago."
    ]
  },
  "recommendations": [
    "Do not transfer any 'token amount' or 'visiting fee' via UPI.",
    "Insist on meeting the owner or broker in person at the property.",
    "Verify the actual photos by asking for a live video call."
  ]
};

function App() {
  const [theme, setTheme] = useState('light');
  const [appState, setAppState] = useState('home'); // 'home', 'analyzing', 'results'
  const [activeUrl, setActiveUrl] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  // Theme toggle effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Listen for the custom events emitted by the GSAP components
  useEffect(() => {
    const handleStartAnalysis = (e) => {
      setActiveUrl(e.detail.url);
      setAppState('analyzing');
    };

    const handleAnalysisComplete = (e) => {
      if (e.detail?.result) {
        setAnalysisResult(e.detail.result);
      } else {
        // Fallback to mock if API failed but we want to show something
        setAnalysisResult(MOCK_RESULT);
      }
      setAppState('results');
    };

    window.addEventListener('startAnalysis', handleStartAnalysis);
    window.addEventListener('analysisComplete', handleAnalysisComplete);

    return () => {
      window.removeEventListener('startAnalysis', handleStartAnalysis);
      window.removeEventListener('analysisComplete', handleAnalysisComplete);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const resetToHome = () => {
    setAppState('home');
    setActiveUrl('');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const scrollToInput = () => {
    const section = document.getElementById('cta');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFinalCtaSelect = () => {
    // Basic interaction for the new UI CTA triggering the global start flow with a dummy URL
    const event = new CustomEvent('startAnalysis', { detail: { url: 'https://housing.com/rent/2bhk-flat-koramangala-bangalore' } });
    window.dispatchEvent(event);
  };

  return (
    <div className="min-h-screen w-full bg-bg">
      
      {appState === 'home' && (
        <>
          <Navbar theme={theme} onThemeToggle={toggleTheme} onCtaClick={scrollToInput} />
          <main className="relative">
            <HeroSection theme={theme} onCtaClick={scrollToInput} />
            <HowItWorks />
            <DetectionEngines />
            <RiskScoreDemo />
            <ImpactSection />
            <CallToAction onVerificationStart={handleFinalCtaSelect} />
          </main>
          <Footer />
        </>
      )}

      {appState === 'analyzing' && (
        <AnalysisScreen url={activeUrl} />
      )}

      {appState === 'results' && (
        <ResultsDashboard result={analysisResult} onReset={resetToHome} />
      )}

    </div>
  );
}

export default App;
