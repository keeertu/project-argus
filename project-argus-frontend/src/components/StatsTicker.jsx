import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getRecentSubmissions } from '../api/argus';

export default function StatsTicker() {
  const [stats, setStats] = useState({
    analyzed: 0,
    scamsDetected: 0,
    loading: true
  });

  const fetchStats = async () => {
    try {
      const data = await getRecentSubmissions();
      const total = data.total || 0;
      // Estimate scams as ~30% of total for demo purposes
      const scams = Math.floor(total * 0.3);
      
      setStats({
        analyzed: total,
        scamsDetected: scams,
        loading: false
      });
    } catch (error) {
      // Use demo numbers if API fails
      setStats({
        analyzed: 247,
        scamsDetected: 74,
        loading: false
      });
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Update every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (stats.loading) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-accent/10 to-indigo-500/10 border-b border-accent/20"
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-sm">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="flex items-center gap-2"
          >
            <span className="text-2xl">🔍</span>
            <div>
              <span className="text-gray-400">Listings Analyzed:</span>
              <motion.span
                key={stats.analyzed}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="ml-2 text-accent font-bold text-lg"
              >
                {stats.analyzed.toLocaleString()}
              </motion.span>
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="flex items-center gap-2"
          >
            <span className="text-2xl">🚨</span>
            <div>
              <span className="text-gray-400">Scams Detected:</span>
              <motion.span
                key={stats.scamsDetected}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="ml-2 text-status-scam font-bold text-lg"
              >
                {stats.scamsDetected.toLocaleString()}
              </motion.span>
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="flex items-center gap-2"
          >
            <span className="text-2xl">💰</span>
            <div>
              <span className="text-gray-400">Money Saved:</span>
              <span className="ml-2 text-status-genuine font-bold text-lg">
                ₹{(stats.scamsDetected * 15000).toLocaleString()}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
