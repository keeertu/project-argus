import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function URLInput({ onSubmit, isLoading, initialURL = '' }) {
  const [url, setUrl] = useState(initialURL);
  const [detectedPlatform, setDetectedPlatform] = useState('');

  useEffect(() => {
    setUrl(initialURL);
  }, [initialURL]);

  useEffect(() => {
    const urlLower = url.toLowerCase();
    
    if (urlLower.includes('99acres')) {
      setDetectedPlatform('99acres');
    } else if (urlLower.includes('magicbricks')) {
      setDetectedPlatform('MagicBricks');
    } else if (urlLower.includes('housing.com')) {
      setDetectedPlatform('Housing.com');
    } else if (urlLower.includes('nobroker')) {
      setDetectedPlatform('NoBroker');
    } else {
      setDetectedPlatform('');
    }
  }, [url]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      const formData = new FormData();
      formData.append('url', url.trim());
      onSubmit(formData);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="bg-dark-card rounded-2xl p-6 md:p-8 shadow-2xl"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
        <span className="text-3xl md:text-4xl">🔗</span>
        <span>Analyze by URL</span>
      </h2>
      
      <div className="space-y-5">
        <div>
          <label className="block text-gray-300 mb-2 text-sm font-semibold">
            Listing URL <span className="text-status-scam">*</span>
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="w-full px-4 py-3 bg-dark-bg border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
            placeholder="Paste listing URL from 99acres, MagicBricks, Housing.com or NoBroker"
          />
          
          {/* Platform Detection Indicator */}
          <div className="mt-2 min-h-[24px]">
            {detectedPlatform ? (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-status-genuine text-sm"
              >
                <span>✓</span>
                <span>{detectedPlatform} detected</span>
              </motion.div>
            ) : url.length > 10 ? (
              <div className="text-gray-500 text-xs">
                Supported: 99acres, MagicBricks, Housing.com, NoBroker
              </div>
            ) : null}
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          type="submit"
          disabled={isLoading || !url.trim()}
          className="w-full py-4 bg-accent text-white font-bold text-base md:text-lg rounded-lg hover:bg-accent/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-3 min-h-[44px] touch-manipulation"
        >
          {isLoading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
              <span>Analyzing with AI...</span>
            </>
          ) : (
            <>
              <span>🔍</span>
              <span>Analyze Listing</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.form>
  );
}
