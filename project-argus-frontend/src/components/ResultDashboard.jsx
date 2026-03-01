import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ResultDashboard({ result }) {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const getScoreColor = (score) => {
    if (score <= 30) return '#10b981';
    if (score <= 65) return '#f59e0b';
    return '#ef4444';
  };

  const handleShareWarning = () => {
    const url = `${window.location.origin}?listing=${result.listing_id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const circumference = 2 * Math.PI * 90;
  const offset = circumference - (result.risk_score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-5xl mx-auto space-y-6"
    >
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center justify-center">
            <div className="w-64 h-64 mx-auto relative mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="128" cy="128" r="90" stroke="#1f2937" strokeWidth="16" fill="none" />
                <motion.circle
                  cx="128" cy="128" r="90"
                  stroke={getScoreColor(result.risk_score)}
                  strokeWidth="16" fill="none" strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  style={{ filter: `drop-shadow(0 0 8px ${getScoreColor(result.risk_score)}40)` }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: "spring" }} className="text-center">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-6xl font-bold" style={{ color: getScoreColor(result.risk_score) }}>{result.risk_score}</span>
                    <span className="text-xl text-gray-400">/100</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">Risk Score</div>
                </motion.div>
              </div>
            </div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} className="text-center">
              <div className="text-2xl font-bold mb-2" style={{ color: getScoreColor(result.risk_score) }}>{result.verdict}</div>
              <p className="text-gray-400 text-sm max-w-xs">
                {result.risk_score <= 30 && 'This listing appears safe to proceed with normal caution'}
                {result.risk_score > 30 && result.risk_score <= 65 && 'Exercise caution - verify details before proceeding'}
                {result.risk_score > 65 && 'High risk detected - strongly recommend avoiding this listing'}
              </p>
            </motion.div>
          </div>
          <div className="flex flex-col gap-4">
            {result.scraped_data && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Source</h3>
                  {result.scrape_method === 'mock' && <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">Demo Mode</span>}
                </div>
                <div className="text-white font-medium mb-1 capitalize">{result.scraped_data.platform}</div>
                <div className="text-gray-400 text-sm line-clamp-2">{result.scraped_data.title}</div>
              </motion.div>
            )}
            {result.text_analysis?.reasoning && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">AI Analysis</h3>
                <p className="text-gray-300 text-sm italic leading-relaxed">{result.text_analysis.reasoning}</p>
              </motion.div>
            )}
            {result.text_analysis?.flags && result.text_analysis.flags.length > 0 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Red Flags Detected</h3>
                <div className="space-y-3">
                  {result.text_analysis.flags.map((flag, index) => (
                    <motion.div key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + index * 0.1 }} className="bg-gray-800/50 p-4 rounded-xl border-l-4 border-red-500 flex items-start gap-3">
                      <span className="text-red-500 text-lg flex-shrink-0">⚠️</span>
                      <span className="text-gray-300 text-sm">{flag}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            {result.price_analysis?.market_median && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Price Analysis</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Market Median:</span>
                    <span className="text-white font-semibold">₹{result.price_analysis.market_median.toLocaleString()}</span>
                  </div>
                  {result.price_analysis.percentage_below_market !== null && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Price Difference:</span>
                      <span className={result.price_analysis.percentage_below_market > 0 ? 'text-red-400 font-semibold' : 'text-green-400 font-semibold'}>
                        {result.price_analysis.percentage_below_market > 0 ? '-' : '+'}{Math.abs(result.price_analysis.percentage_below_market).toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="text-center mt-8 pt-6 border-t border-gray-800">
          <span className="text-gray-500 text-xs">Analysis ID: </span>
          <span className="text-gray-400 text-xs font-mono">{result.listing_id}</span>
        </motion.div>
      </div>
      {result.recommendations && result.recommendations.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-4xl">💡</span>
            <span>Recommendations</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.recommendations.map((rec, index) => (
              <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 + index * 0.1 }} className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 flex items-start gap-3">
                <span className="text-accent text-xl font-bold flex-shrink-0">→</span>
                <span className="text-gray-300 text-sm leading-relaxed">{rec}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }} className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleShareWarning} className="px-8 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/80 transition-colors shadow-lg flex items-center justify-center gap-2">
          <span>{copied ? '✓' : '🔗'}</span>
          <span>{copied ? 'Link Copied!' : 'Share Warning'}</span>
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => window.location.reload()} className="px-8 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors shadow-lg">
          Analyze Another Listing
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
