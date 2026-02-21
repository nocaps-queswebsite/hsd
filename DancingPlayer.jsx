import React from 'react';
import { motion } from 'framer-motion';

export default function DancingPlayer({ message = "You got this! 🎉" }) {
  return (
    <div className="absolute bottom-4 left-4 z-40 flex flex-col items-center">
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [-5, 5, -5],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="text-4xl"
      >
        🕺
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-1 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-white whitespace-nowrap"
      >
        {message}
      </motion.div>
    </div>
  );
}