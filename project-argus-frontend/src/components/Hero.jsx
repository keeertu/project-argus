import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center py-8 md:py-12 px-4"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="inline-block mb-4"
      >
        <div className="text-5xl md:text-6xl mb-2">🛡️</div>
      </motion.div>
      
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
        Project <span className="text-accent">Argus</span>
      </h1>
      
      <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-3 font-medium">
        AI-Powered Protection for India's Renters
      </p>
      
      <p className="text-base md:text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
        Analyze any rental listing for scam signals before you pay
      </p>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="flex flex-wrap justify-center gap-4 md:gap-6 text-xs md:text-sm text-gray-400 border-t border-gray-700 pt-6 max-w-4xl mx-auto"
      >
        <div className="flex items-center gap-2">
          <span className="text-status-scam text-lg md:text-xl">⚠️</span>
          <span className="whitespace-nowrap">15M+ renters at risk</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-status-suspicious text-lg md:text-xl">💰</span>
          <span className="whitespace-nowrap">₹500Cr lost annually</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-status-genuine text-lg md:text-xl">📊</span>
          <span className="whitespace-nowrap">1 in 4 listings suspicious</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
