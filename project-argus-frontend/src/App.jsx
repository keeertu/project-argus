import { useState } from 'react';
import { motion } from 'framer-motion';
import Hero from './components/Hero';
import DemoButtons from './components/DemoButtons';
import ListingForm from './components/ListingForm';
import URLInput from './components/URLInput';
import ResultDashboard from './components/ResultDashboard';
import AnalyzingLoader from './components/AnalyzingLoader';
import StatsTicker from './components/StatsTicker';
import { analyzeListingWithImage, analyzeListingByURL } from './api/argus';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [activeTab, setActiveTab] = useState('url'); // 'url' or 'manual'
  const [demoURL, setDemoURL] = useState('');
  const [detectedPlatform, setDetectedPlatform] = useState('');

  const handleDemoSelect = (demoData) => {
    if (demoData.url) {
      // URL demo - switch to URL tab and auto-trigger
      setActiveTab('url');
      setDemoURL(demoData.url);
      setResult(null);
      setError(null);
      
      // Auto-trigger analysis after 500ms
      setTimeout(() => {
        const formData = new FormData();
        formData.append('url', demoData.url);
        handleSubmitURL(formData);
      }, 500);
    } else {
      // Manual demo - switch to manual tab
      setActiveTab('manual');
      setSelectedDemo(demoData);
      setResult(null);
      setError(null);
    }
  };

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await analyzeListingWithImage(formData);
      setResult(response);
      setSelectedDemo(null);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.response?.data?.detail || 'Failed to analyze listing. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitURL = async (formData) => {
    setIsLoading(true);
    setError(null);
    
    // Detect platform for loading animation
    const url = formData.get('url');
    const urlLower = url.toLowerCase();
    if (urlLower.includes('99acres')) setDetectedPlatform('99acres');
    else if (urlLower.includes('magicbricks')) setDetectedPlatform('MagicBricks');
    else if (urlLower.includes('housing')) setDetectedPlatform('Housing.com');
    else if (urlLower.includes('nobroker')) setDetectedPlatform('NoBroker');
    else setDetectedPlatform('platform');
    
    try {
      const response = await analyzeListingByURL(formData);
      setResult(response);
      setDemoURL('');
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.response?.data?.detail || 'Failed to analyze listing. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {isLoading && <AnalyzingLoader isURLMode={activeTab === 'url'} platform={detectedPlatform} />}
      
      <StatsTicker />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Hero />
        
        {!result && (
          <>
            <DemoButtons onSelectDemo={handleDemoSelect} />
            
            <div className="max-w-3xl mx-auto">
              {/* Tab Switcher */}
              <div className="flex gap-2 mb-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab('url')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    activeTab === 'url'
                      ? 'bg-accent text-white'
                      : 'bg-dark-card text-gray-400 hover:text-white'
                  }`}
                >
                  🔗 Analyze by URL
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab('manual')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    activeTab === 'manual'
                      ? 'bg-accent text-white'
                      : 'bg-dark-card text-gray-400 hover:text-white'
                  }`}
                >
                  ✏️ Enter Manually
                </motion.button>
              </div>

              {/* Tab Content */}
              {activeTab === 'url' ? (
                <URLInput
                  onSubmit={handleSubmitURL}
                  isLoading={isLoading}
                  initialURL={demoURL}
                />
              ) : (
                <ListingForm
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  initialData={selectedDemo}
                />
              )}
              
              {error && (
                <div className="mt-4 p-4 bg-status-scam/10 border border-status-scam rounded-lg text-status-scam">
                  {error}
                </div>
              )}
            </div>
          </>
        )}
        
        {result && (
          <div className="max-w-6xl mx-auto">
            <ResultDashboard result={result} />
          </div>
        )}
      </div>
      
      <footer className="text-center py-8 text-gray-500 text-sm border-t border-gray-800 mt-12">
        <p className="font-semibold text-gray-400">Project Argus - Protecting India's Renters with AI</p>
        <p className="mt-2">Built for social impact | Powered by Amazon Bedrock</p>
        <div className="mt-4 flex justify-center gap-6 text-xs">
          <span>🛡️ Real-time Analysis</span>
          <span>🤖 Claude 3.5 Sonnet</span>
          <span>📊 Market Data</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
