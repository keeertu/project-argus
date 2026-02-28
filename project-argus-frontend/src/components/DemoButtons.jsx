import { motion } from 'framer-motion';
import { demoListings } from '../data/demoListings';

export default function DemoButtons({ onSelectDemo }) {
  const demos = [
    {
      type: 'scam',
      emoji: '🚨',
      label: 'Try a Scam Listing',
      borderColor: 'border-status-scam',
      hoverColor: 'hover:bg-status-scam/10'
    },
    {
      type: 'suspicious',
      emoji: '⚠️',
      label: 'Try a Suspicious Listing',
      borderColor: 'border-status-suspicious',
      hoverColor: 'hover:bg-status-suspicious/10'
    },
    {
      type: 'genuine',
      emoji: '✅',
      label: 'Try a Genuine Listing',
      borderColor: 'border-status-genuine',
      hoverColor: 'hover:bg-status-genuine/10'
    }
  ];

  return (
    <div className="mb-8">
      <p className="text-center text-gray-400 mb-4 text-sm md:text-base">
        Try our demo listings to see how Argus works
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {demos.map((demo, index) => (
          <motion.button
            key={demo.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectDemo(demoListings[demo.type])}
            className={`p-4 md:p-6 rounded-lg border-2 ${demo.borderColor} ${demo.hoverColor} bg-dark-card transition-all duration-200 cursor-pointer min-h-[44px] touch-manipulation`}
          >
            <div className="text-3xl md:text-4xl mb-2">{demo.emoji}</div>
            <div className="text-white font-medium text-sm md:text-base">{demo.label}</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
