import React from 'react';
import { motion } from 'framer-motion';

export function AuthBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-sage-light/30 via-white to-bloom-pink/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 opacity-80 dark:opacity-95" />
      <FloatingCircles />
    </div>
  );
}

function FloatingCircles() {
  const circles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    size: 20 + Math.random() * 80,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 15 + Math.random() * 15,
    colorClass: i % 3 === 0 
      ? 'fill-sage/10 dark:fill-sage/5' 
      : i % 3 === 1 
        ? 'fill-bloom-coral/10 dark:fill-bloom-coral/5' 
        : 'fill-emerald-300/10 dark:fill-emerald-700/5'
  }));

  return (
    <svg 
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {circles.map((circle) => (
        <motion.circle
          key={circle.id}
          cx={circle.x}
          cy={circle.y}
          r={circle.size / 10}
          className={circle.colorClass}
          initial={{ scale: 0.8, opacity: 0.3 }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.3, 0.6, 0.3],
            cx: [circle.x, circle.x + (Math.random() * 10 - 5), circle.x],
            cy: [circle.y, circle.y + (Math.random() * 10 - 5), circle.y],
          }}
          transition={{
            duration: circle.duration,
            delay: circle.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </svg>
  );
}
