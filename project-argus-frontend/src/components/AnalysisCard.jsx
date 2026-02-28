import { motion } from 'framer-motion';

export default function AnalysisCard({ title, icon, data, delay = 0 }) {
  const getColor = () => {
    const score = data.score || 0;
    if (score <= 30) return '#10b981';
    if (score <= 65) return '#f59e0b';
    return '#ef4444';
  };

  const getBorderColor = () => {
    const score = data.score || 0;
    if (score <= 30) return 'border-status-genuine';
    if (score <= 65) return 'border-status-suspicious';
    return 'border-status-scam';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, type: "spring", stiffness: 100 }}
      className={`bg-dark-card rounded-xl p-6 shadow-xl border-l-4 ${getBorderColor()} relative overflow-hidden`}
    >
      {/* Subtle background glow */}
      <div 
        className="absolute top-0 left-0 w-full h-1 opacity-50"
        style={{ backgroundColor: getColor() }}
      />
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{icon}</span>
          <h3 className="text-lg font-bold text-white">{title}</h3>
        </div>
        
        {/* Score badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.3, type: "spring" }}
          className="px-3 py-1 rounded-full text-sm font-bold"
          style={{ 
            backgroundColor: `${getColor()}20`,
            color: getColor(),
            border: `1px solid ${getColor()}40`
          }}
        >
          {data.score}
        </motion.div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-gray-700">
          <span className="text-gray-400 text-sm">Verdict</span>
          <span className="text-white font-medium text-sm">{data.verdict}</span>
        </div>
        
        {data.flags && data.flags.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.4 }}
            className="mt-4"
          >
            <div className="text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wide">Red Flags</div>
            <ul className="space-y-2">
              {data.flags.map((flag, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: delay + 0.5 + index * 0.1 }}
                  className="text-status-scam text-sm flex items-start gap-2 bg-status-scam/5 p-2 rounded"
                >
                  <span className="text-base">⚠️</span>
                  <span className="flex-1">{flag}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
        
        {data.reasoning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.6 }}
            className="mt-4 pt-4 border-t border-gray-700"
          >
            <div className="text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wide">Analysis</div>
            <p className="text-gray-300 text-sm italic leading-relaxed">{data.reasoning}</p>
          </motion.div>
        )}
        
        {data.market_median && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.7 }}
            className="mt-4 pt-4 border-t border-gray-700"
          >
            <div className="text-gray-400 text-xs font-semibold mb-3 uppercase tracking-wide">Market Data</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center bg-gray-800/50 p-2 rounded">
                <span className="text-gray-400">Market Median</span>
                <span className="text-white font-semibold">₹{data.market_median.toLocaleString()}</span>
              </div>
              {data.percentage_below_market !== null && (
                <div className="flex justify-between items-center bg-gray-800/50 p-2 rounded">
                  <span className="text-gray-400">Price Difference</span>
                  <span 
                    className={`font-semibold ${data.percentage_below_market > 0 ? 'text-status-scam' : 'text-status-genuine'}`}
                  >
                    {data.percentage_below_market > 0 ? '-' : '+'}{Math.abs(data.percentage_below_market).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
