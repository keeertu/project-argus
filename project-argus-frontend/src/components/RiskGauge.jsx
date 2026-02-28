import { motion } from 'framer-motion';

export default function RiskGauge({ score, verdict }) {
  const getColor = () => {
    if (score <= 30) return '#10b981';
    if (score <= 65) return '#f59e0b';
    return '#ef4444';
  };

  const getGradientId = () => {
    if (score <= 30) return 'greenGradient';
    if (score <= 65) return 'yellowGradient';
    return 'redGradient';
  };

  const getRotation = () => {
    return (score / 100) * 180 - 90;
  };

  return (
    <div className="flex flex-col items-center py-6 md:py-8">
      <div className="relative w-64 md:w-80 h-32 md:h-40 mb-6">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          <defs>
            <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="yellowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="1" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Background arc */}
          <path
            d="M 10 90 A 80 80 0 0 1 190 90"
            fill="none"
            stroke="#1f2937"
            strokeWidth="18"
            strokeLinecap="round"
          />
          
          {/* Animated colored arc */}
          <motion.path
            d="M 10 90 A 80 80 0 0 1 190 90"
            fill="none"
            stroke={`url(#${getGradientId()})`}
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray="251.2"
            initial={{ strokeDashoffset: 251.2 }}
            animate={{ strokeDashoffset: 251.2 - (score / 100) * 251.2 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            filter="url(#glow)"
          />
          
          {/* Needle */}
          <motion.line
            x1="100"
            y1="90"
            x2="100"
            y2="25"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ rotate: -90 }}
            animate={{ rotate: getRotation() }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ transformOrigin: '100px 90px' }}
            filter="url(#glow)"
          />
          
          {/* Center circle */}
          <circle cx="100" cy="90" r="6" fill="white" />
        </svg>
        
        {/* Score display */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
          className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
        >
          <div className="flex items-baseline justify-center">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-4xl md:text-6xl font-bold text-white"
              style={{ 
                textShadow: `0 0 20px ${getColor()}40`,
                color: getColor()
              }}
            >
              {score}
            </motion.span>
            <span className="text-xl md:text-2xl text-gray-500 ml-1">/100</span>
          </div>
        </motion.div>
      </div>
      
      {/* Pulsing glow effect */}
      <motion.div
        animate={{
          boxShadow: [
            `0 0 20px ${getColor()}40`,
            `0 0 40px ${getColor()}60`,
            `0 0 20px ${getColor()}40`
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-80 h-40 rounded-full pointer-events-none"
        style={{ filter: 'blur(30px)', opacity: 0.3 }}
      />
      
      {/* Verdict */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="text-center"
      >
        <div className="text-3xl font-bold mb-2" style={{ color: getColor() }}>
          {verdict}
        </div>
        <div className="text-base text-gray-400 max-w-md">
          {score <= 30 && 'This listing appears safe to proceed with normal caution'}
          {score > 30 && score <= 65 && 'Exercise caution - verify details before proceeding'}
          {score > 65 && 'High risk detected - strongly recommend avoiding this listing'}
        </div>
      </motion.div>
    </div>
  );
}
