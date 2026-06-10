import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const words = ["Design", "Create", "Inspire"];

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    // Word rotation
    const wordInterval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 900);

    // Counter animation
    const startTime = performance.now();
    const duration = 2700;

    const animateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setCount(Math.floor(progress * 100));

      if (progress < 1) {
        requestAnimationFrame(animateCounter);
      } else {
        setTimeout(() => {
          onComplete();
        }, 400);
      }
    };

    requestAnimationFrame(animateCounter);

    return () => {
      clearInterval(wordInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-bg flex flex-col justify-between p-6 md:p-10">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-xs text-muted uppercase tracking-[0.3em]"
      >
        Portfolio
      </motion.div>

      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={wordIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-4xl md:text-6xl lg:text-7xl font-display italic text-text-primary/80"
          >
            {words[wordIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-end justify-between w-full">
        <div className="w-full max-w-[200px] sm:max-w-xs md:max-w-sm lg:max-w-md">
          <div className="h-[3px] w-full bg-stroke/50 rounded-full overflow-hidden origin-left relative">
            <div 
              className="absolute inset-0 origin-left accent-gradient shadow-[0_0_8px_rgba(137,170,204,0.35)]"
              style={{ transform: `scaleX(${count / 100})` }}
            />
          </div>
        </div>
        
        <div className="text-6xl md:text-8xl lg:text-9xl font-display text-text-primary tabular-nums leading-none">
          {String(count).padStart(3, "0")}
        </div>
      </div>
    </div>
  );
}
