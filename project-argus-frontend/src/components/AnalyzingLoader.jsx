import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function AnalyzingLoader({ isURLMode = false, platform = '' }) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const urlSteps = [
    { icon: '🌐', text: `Fetching listing from ${platform || 'platform'}...` },
    { icon: '🔍', text: 'Checking price against market benchmarks...' },
    { icon: '🧠', text: 'Running cross-signal AI analysis...' },
    { icon: '📊', text: 'Calculating final risk score...' }
  ];
  
  const manualSteps = [
    { icon: '🔍', text: 'Checking price against market data...' },
    { icon: '📝', text: 'Analyzing description for scam patterns...' },
    { icon: '🖼️', text: 'Examining listing images...' },
    { icon: '🧠', text: 'Calculating risk score...' }
  ];
  
  const steps = isURLMode ? urlSteps : manualSteps;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-dark-bg/95 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="max-w-md w-full mx-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-dark-card rounded-2xl p-8 shadow-2xl border border-gray-800"
        >
          {/* Animated Icon */}
          <div className="text-center mb-6">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-6xl mb-4"
            >
              🛡️
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Analyzing Listing
            </h3>
            <p className="text-gray-400 text-sm">
              AI-powered scam detection in progress
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-accent to-indigo-400"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Current Step */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3 text-gray-300"
            >
              <span className="text-3xl">{steps[currentStep].icon}</span>
              <span className="text-base">{steps[currentStep].text}</span>
            </motion.div>
          </AnimatePresence>

          {/* Loading Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-accent rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
