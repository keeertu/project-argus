import { motion } from 'framer-motion';
import { useState } from 'react';
import RiskGauge from './RiskGauge';
import AnalysisCard from './AnalysisCard';

export default function ResultDashboard({ result }) {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const getBackgroundColor = () => {
    const score = result.risk_score;
    if (score <= 30) return 'bg-status-genuine/10';
    if (score <= 65) return 'bg-status-suspicious/10';
    return 'bg-status-scam/10';
  };

  const getBorderColor = () => {
    const score = result.risk_score;
    if (score <= 30) return 'border-status-genuine/30';
    if (score <= 65) return 'border-status-suspicious/30';
    return 'border-status-scam/30';
  };

  const handleShareWarning = () => {
    const url = `${window.location.origin}?listing=${result.listing_id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-8"
    >
      {/* Demo Mode Badge */}
      {result.scrape_method === 'mock' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-center"
        >
          <span className="text-gray-400 text-sm">
            ⚡ Demo Mode — Live scraping blocked by anti-bot protection. Full scraping with AWS deployment coming in Phase 2.
          </span>
        </motion.div>
      )}

      {/* Source Information */}
      {result.scraped_data && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-dark-card rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>🔗</span>
            <span>Source</span>
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-gray-400 min-w-[80px]">Platform:</span>
              <span className="text-white font-medium capitalize">{result.scraped_data.platform}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gray-400 min-w-[80px]">URL:</span>
              <a 
                href={result.source_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent hover:underline break-all"
              >
                {result.source_url}
              </a>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gray-400 min-w-[80px]">Title:</span>
              <span className="text-gray-300">{result.scraped_data.title}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main gauge section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-dark-card rounded-2xl p-6 md:p-8 shadow-2xl"
      >
        <RiskGauge score={result.risk_score} verdict={result.verdict} />
        
        {/* Listing ID */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-center mt-6 pt-6 border-t border-gray-700"
        >
          <span className="text-gray-500 text-xs">Analysis ID: </span>
          <span className="text-gray-400 text-xs font-mono break-all">{result.listing_id}</span>
        </motion.div>
      </motion.div>

      {/* Analysis cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnalysisCard
          title="Price Analysis"
          icon="💰"
          data={result.price_analysis}
          delay={0.3}
        />
        <AnalysisCard
          title="Text Analysis"
          icon="📝"
          data={result.text_analysis}
          delay={0.4}
        />
        <AnalysisCard
          title="Image Analysis"
          icon="🖼️"
          data={result.image_analysis}
          delay={0.5}
        />
      </div>

      {/* Recommendations section */}
      {result.recommendations && result.recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`rounded-2xl p-6 md:p-8 shadow-xl border-2 ${getBorderColor()} ${getBackgroundColor()}`}
        >
          <h3 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl md:text-4xl">💡</span>
            <span>Recommendations</span>
          </h3>
          <ul className="space-y-4">
            {result.recommendations.map((rec, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-start gap-3 md:gap-4 text-gray-200 bg-dark-card/50 p-3 md:p-4 rounded-lg"
              >
                <span className="text-accent text-lg md:text-xl font-bold mt-0.5 flex-shrink-0">→</span>
                <span className="flex-1 text-sm md:text-base leading-relaxed">{rec}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShareWarning}
          className="px-6 md:px-8 py-3 md:py-4 bg-accent text-white font-semibold rounded-lg hover:bg-accent/80 transition-colors shadow-lg flex items-center justify-center gap-2 min-h-[44px] touch-manipulation"
        >
          <span>{copied ? '✓' : '🔗'}</span>
          <span>{copied ? 'Link Copied!' : 'Share Warning'}</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="px-6 md:px-8 py-3 md:py-4 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors shadow-lg min-h-[44px] touch-manipulation"
        >
          Analyze Another Listing
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
