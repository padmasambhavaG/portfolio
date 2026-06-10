import { motion, useInView, animate } from 'framer-motion';
import { useRef, useEffect, useState, useMemo } from 'react';
import { Award, Code2, GraduationCap, Terminal } from 'lucide-react';

// --- Subcomponents ---

function AnimatedValue({ target, suffix, decimals }: { target: number, suffix: string, decimals: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, target, {
        duration: 2.5,
        ease: "easeOut",
        onUpdate(val) {
          setValue(val);
        }
      });
      return () => controls.stop();
    }
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

function CircularProgress({ value, max, label, description }: { value: number, max: number, label: string, description: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / max) * circumference;

  return (
    <div className="flex flex-col items-center justify-center relative p-6 h-full" ref={ref}>
      <div className="relative w-40 h-40 flex items-center justify-center mb-4">
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle cx="80" cy="80" r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="transparent" />
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            stroke="url(#gradient)"
            strokeWidth="8"
            fill="transparent"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={isInView ? { strokeDashoffset } : { strokeDashoffset: circumference }}
            transition={{ duration: 2.5, ease: "easeOut", delay: 0.2 }}
            style={{ strokeDasharray: circumference }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e0e0e0" />
              <stop offset="100%" stopColor="#89AACC" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-display italic text-4xl text-text-primary"><AnimatedValue target={value} decimals={2} suffix="" /></span>
          <span className="text-xs text-muted">/ {max}</span>
        </div>
      </div>
      <h3 className="text-lg font-medium text-text-primary mb-1">{label}</h3>
      <p className="text-sm text-muted text-center max-w-[200px]">{description}</p>
    </div>
  );
}

function MiniProgressBar({ label, percent, delay }: { label: string, percent: number, delay: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div className="mb-4 last:mb-0" ref={ref}>
      <div className="flex justify-between text-sm mb-1 text-muted">
        <span>{label}</span>
        <span>{percent}%</span>
      </div>
      <div className="h-1.5 w-full bg-glass-10 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-[#89AACC] to-white rounded-full"
          initial={{ width: 0 }}
          animate={isInView ? { width: `${percent}%` } : { width: 0 }}
          transition={{ duration: 1.5, delay, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

// --- Heatmap Graph (GitHub/LeetCode Simulation) ---
function HeatmapGraph({ variant }: { variant: 'github' | 'leetcode' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [cols, setCols] = useState(35);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        setCols(16);
      } else if (window.innerWidth < 640) {
        setCols(24);
      } else {
        setCols(35);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const matrix = useMemo(() => {
    const baseSeed = variant === 'github' ? 12345 : 67890;
    const rows = 7;
    const data = [];

    // Pure deterministic 2D integer mix hash function to eliminate linear pattern bands
    const getHash = (c: number, r: number, seed: number) => {
      let h = (c * 15973347) ^ (r * 38120309) ^ (seed * 83204911);
      h = Math.imul(h ^ (h >>> 15), h | 1);
      h ^= h + Math.imul(h ^ (h >>> 7), h | 61);
      return ((h ^ (h >>> 14)) >>> 0) / 4294967296;
    };

    for (let c = 0; c < cols; c++) {
      const col = [];
      for (let r = 0; r < rows; r++) {
        // Different random distribution based on variant
        const baseChance = variant === 'github' ? 0.3 : 0.2;
        const activityChance = (c / cols) * 0.7 + baseChance;
        
        const rand1 = getHash(c, r, baseSeed);
        let level = 0;
        if (rand1 < activityChance) {
          const rand2 = getHash(c, r, baseSeed + 999);
          level = Math.floor(rand2 * 4) + 1; 
        }
        col.push(level);
      }
      data.push(col);
    }
    return data;
  }, [variant, cols]);

  const getColor = (level: number) => {
    if (variant === 'github') {
      // GitHub Greens
      switch (level) {
        case 0: return 'bg-glass-5 border border-glass-5';
        case 1: return 'bg-[#0e4429] border border-[#0e4429]';
        case 2: return 'bg-[#006d32] border border-[#006d32]';
        case 3: return 'bg-[#26a641] border border-[#26a641]';
        case 4: return 'bg-[#39d353] border border-[#39d353] shadow-[0_0_8px_rgba(57,211,83,0.4)]';
        default: return 'bg-glass-5 border border-glass-5';
      }
    } else {
      // LeetCode / Theme Blues
      switch (level) {
        case 0: return 'bg-glass-5 border border-glass-5';
        case 1: return 'bg-[#89AACC]/40 border border-[#89AACC]/20';
        case 2: return 'bg-[#89AACC]/60 border border-[#89AACC]/30';
        case 3: return 'bg-[#89AACC]/80 border border-[#89AACC]/40';
        case 4: return 'bg-text-primary border border-text-primary shadow-[0_0_10px_rgba(255,255,255,0.6)]';
        default: return 'bg-glass-5 border border-glass-5';
      }
    }
  };

  return (
    <div className="w-full overflow-hidden flex flex-col justify-end" ref={ref}>
      <div className="flex items-end gap-[3px] sm:gap-1 overflow-x-auto pb-2 custom-scrollbar">
        {matrix.map((col, cIdx) => (
          <div key={cIdx} className="flex flex-col gap-[3px] sm:gap-1 shrink-0">
            {col.map((level, rIdx) => (
              <motion.div
                key={`${cIdx}-${rIdx}-${variant}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3, delay: (cIdx * 0.015) + (rIdx * 0.01), ease: "backOut" }}
                className={`w-[10px] h-[10px] sm:w-[14px] sm:h-[14px] rounded-sm ${getColor(level)}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex justify-end items-center gap-2 mt-4 text-xs text-muted">
        <span>Less</span>
        <div className={`w-3 h-3 rounded-sm ${getColor(0)}`} />
        <div className={`w-3 h-3 rounded-sm ${getColor(1)}`} />
        <div className={`w-3 h-3 rounded-sm ${getColor(2)}`} />
        <div className={`w-3 h-3 rounded-sm ${getColor(3)}`} />
        <div className={`w-3 h-3 rounded-sm ${getColor(4)}`} />
        <span>More</span>
      </div>
    </div>
  );
}

// --- Main Component ---

export default function Stats() {
  return (
    <section id="stats" className="bg-bg pt-8 pb-16 md:pt-12 md:pb-24 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-px bg-stroke" />
            <span className="text-xs text-muted uppercase tracking-[0.3em]">Metrics</span>
          </div>
          <h2 className="text-4xl md:text-5xl text-text-primary tracking-tight">
            By the <span className="font-display italic">numbers</span>
          </h2>
        </motion.div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Contributions Dashboard (Spans 2 cols on tablet, 3 on desktop) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="md:col-span-2 lg:col-span-3 bg-glass-5 backdrop-blur-lg shadow-xl shadow-black/5 dark:shadow-black/20 border border-glass-10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <div className="flex items-center gap-2 text-muted mb-2">
                  <Code2 size={18} />
                  <span className="text-sm uppercase tracking-widest font-medium">Problem Solving</span>
                </div>
                <div className="font-display italic text-5xl md:text-6xl stats-number-gradient-text">
                  <AnimatedValue target={450} suffix="+" decimals={0} />
                </div>
                <p className="text-muted mt-2">
                  DSA problems solved across LeetCode & CodeChef
                </p>
              </div>
            </div>

            {/* The Animated Graph */}
            <div className="w-full">
              <HeatmapGraph variant="leetcode" />
            </div>
          </motion.div>

          {/* Card 2: CGPA (Spans 1 col) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-1 bg-glass-5 backdrop-blur-lg shadow-xl shadow-black/5 dark:shadow-black/20 border border-glass-10 rounded-3xl hover:bg-glass-10 transition-colors overflow-hidden relative"
          >
            <div className="absolute top-6 left-6 text-muted">
              <GraduationCap size={20} />
            </div>
            <CircularProgress value={9.29} max={10} label="B.Tech CGPA" description="Consistent academic excellence at MBU" />
          </motion.div>

          {/* Card 3: Languages & Tech */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}
            className="md:col-span-2 lg:col-span-2 bg-glass-5 backdrop-blur-lg shadow-xl shadow-black/5 dark:shadow-black/20 border border-glass-10 rounded-3xl p-8 hover:bg-glass-10 transition-colors"
          >
            <div className="flex items-center gap-2 text-muted mb-6">
              <Terminal size={18} />
              <span className="text-sm uppercase tracking-widest font-medium">Top Languages</span>
            </div>
            <div className="flex flex-col justify-center h-full gap-2">
              <MiniProgressBar label="Java" percent={85} delay={0.3} />
              <MiniProgressBar label="Python" percent={75} delay={0.4} />
            </div>
          </motion.div>

          {/* Card 4: Achievements (Spans 2 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }}
            className="md:col-span-1 lg:col-span-2 bg-glass-5 backdrop-blur-lg shadow-xl shadow-black/5 dark:shadow-black/20 border border-glass-10 rounded-3xl p-8 hover:bg-glass-10 transition-colors flex flex-col justify-center relative overflow-hidden group"
          >
            <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity rotate-12 pointer-events-none">
              <Award size={180} />
            </div>
            
            <div className="flex items-center gap-2 text-muted mb-6 relative z-10">
              <Award size={18} />
              <span className="text-sm uppercase tracking-widest font-medium">Achievements</span>
            </div>
            
            <div className="flex flex-col gap-5 relative z-10">
              {/* Achievement 1: GATE */}
              <div className="flex items-start gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-text-primary mt-2 shrink-0" />
                <div>
                  <h4 className="text-md font-medium text-text-primary">AIR 14386 — GATE 2026</h4>
                  <p className="text-xs text-muted mt-0.5">Secured All India Rank 14,386</p>
                </div>
              </div>
              
              {/* Achievement 2: Hackathon */}
              <div className="flex items-start gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-text-primary mt-2 shrink-0" />
                <div>
                  <h4 className="text-md font-medium text-text-primary">3rd Prize — Web Dev Hackathon</h4>
                  <p className="text-xs text-muted mt-0.5">Secured 3rd Prize in a college-level Web Development Hackathon among 100+ teams</p>
                </div>
              </div>
              
              {/* Achievement 3: IITM CGPA */}
              <div className="flex items-start gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-text-primary mt-2 shrink-0" />
                <div>
                  <h4 className="text-md font-medium text-text-primary">8.84 CGPA — IIT Madras</h4>
                  <p className="text-xs text-muted mt-0.5">BS in Data Science & Applications</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
