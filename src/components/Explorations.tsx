import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ExternalLink, Award, ChevronLeft, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const certifications = [
  {
    title: "IIT Madras - Data Science",
    image: "iitm-cert.png",
    link: "https://drive.google.com/file/d/1qJz9X473QVIDkSOBSf9cmfcy0vu7TTQ5/view?usp=sharing"
  },
  {
    title: "Infosys Springboard - Internship 6.0 (TaxPal)",
    image: "infosys-springboard-cert.png",
    link: "https://drive.google.com/file/d/19ptDfICdEwu6X9iYybyla1u3jGaEeyMv/view?usp=drive_link"
  },
  {
    title: "STEP Plus English Proficiency Test",
    image: "step-cert.png",
    link: "https://drive.google.com/file/d/1DdBFPwxWSOfOzBDlsBqn2h8WOgrAqNT_/view?usp=sharing"
  },
  {
    title: "ServiceNow Certified System Administrator (CSA)",
    image: "servicenow-cert.png",
    link: "https://drive.google.com/file/d/1MDl9rXClVaSy8Kp7P-vlrR7XWOWNM4gT/view?usp=sharing",
    position: "left"
  },
  {
    title: "ServiceNow Certified Application Developer (CAD)",
    image: "servicenow-cad-cert.png",
    link: "https://drive.google.com/file/d/1wy1th9R_naZ3BW9fnfGaYa-7Jke7ZJpe/view?usp=sharing",
    position: "left"
  }
];

export default function Explorations() {
  const containerRef = useRef<HTMLDivElement>(null);
  const row1ContainerRef = useRef<HTMLDivElement>(null);
  const row2ContainerRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const [selectedCert, setSelectedCert] = useState<typeof certifications[0] | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Triple the array elements to allow endless looping in both directions
  const baseTopRow = [
    certifications[4], // 5
    certifications[0], // 1
    certifications[1], // 2
    certifications[2], // 3
    certifications[3]  // 4
  ];

  const baseBottomRow = [
    certifications[2], // 3
    certifications[3], // 4
    certifications[4], // 5
    certifications[0], // 1
    certifications[1]  // 2
  ];

  const topRowCerts = [...baseTopRow, ...baseTopRow, ...baseTopRow];
  const bottomRowCerts = [...baseBottomRow, ...baseBottomRow, ...baseBottomRow];

  const handleSelectCert = (cert: typeof certifications[0] | null) => {
    setImageLoaded(false);
    setSelectedCert(cert);
  };

  const scrollRow1 = (direction: 'left' | 'right') => {
    const container = row1ContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRow2 = (direction: 'left' | 'right') => {
    const container = row2ContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Infinite manual scroll loop logic
  const handleScrollLoop = (ref: React.RefObject<HTMLDivElement | null>) => {
    return () => {
      const container = ref.current;
      if (!container) return;

      const isMobile = window.innerWidth < 768;
      const cardWidth = isMobile ? (240 + 16) : (380 + 24);
      const totalWidthOneCopy = cardWidth * 5;

      // If scrolled close to the start, wrap around to the middle copy
      if (container.scrollLeft < cardWidth) {
        container.scrollLeft += totalWidthOneCopy;
      }
      // If scrolled past the middle copy, wrap back to the middle copy
      else if (container.scrollLeft >= totalWidthOneCopy * 2) {
        container.scrollLeft -= totalWidthOneCopy;
      }
    };
  };

  // Center scroll position on the middle copy initially
  useEffect(() => {
    const r1 = row1ContainerRef.current;
    const r2 = row2ContainerRef.current;
    
    const initScroll = () => {
      const isMobile = window.innerWidth < 768;
      const cardWidth = isMobile ? (240 + 16) : (380 + 24);
      const middleOffset = cardWidth * 5;
      if (r1) r1.scrollLeft = middleOffset;
      if (r2) r2.scrollLeft = middleOffset;
    };

    initScroll();
    
    // Add scroll listeners for infinite looping
    const listener1 = handleScrollLoop(row1ContainerRef);
    const listener2 = handleScrollLoop(row2ContainerRef);

    if (r1) r1.addEventListener('scroll', listener1);
    if (r2) r2.addEventListener('scroll', listener2);

    window.addEventListener('resize', initScroll);

    return () => {
      if (r1) r1.removeEventListener('scroll', listener1);
      if (r2) r2.removeEventListener('scroll', listener2);
      window.removeEventListener('resize', initScroll);
    };
  }, []);

  // Handle ESC key and lock body scroll while modal is active
  useEffect(() => {
    if (selectedCert) {
      document.body.style.overflow = 'hidden';
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleSelectCert(null);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      }; 
    }
  }, [selectedCert]);

  // Page Scroll GSAP animation for parallax horizontal drift
  useEffect(() => {
    const ctx = gsap.context(() => {
      const container = containerRef.current;
      const row1 = row1Ref.current;
      const row2 = row2Ref.current;
      if (!container || !row1 || !row2) return;

      const isMobile = window.innerWidth < 768;
      const moveDistance = isMobile ? "-450px" : "-950px";
      const startOffset = isMobile ? "-450px" : "-950px";

      // Row 1: moves left on scroll down (translating inner track directly)
      gsap.fromTo(row1,
        { x: "0px" },
        {
          x: moveDistance,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
          }
        }
      );

      // Row 2: moves right on scroll down (translating inner track directly)
      gsap.fromTo(row2,
        { x: startOffset },
        {
          x: "0px",
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
          }
        }
      );

    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={containerRef} className="relative bg-bg py-20 md:py-32 overflow-hidden">
      
      {/* Title Header */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 mb-12 md:mb-16">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-8 h-px bg-stroke" />
          <span className="text-xs text-muted uppercase tracking-[0.3em]">Credentials</span>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl text-text-primary tracking-tight">
          Featured <span className="font-display italic">Certifications</span>
        </h2>
      </div>

      {/* Horizontal Scrolling Tracks Wrapper */}
      <div className="flex flex-col gap-6 md:gap-8 w-full py-4 pointer-events-auto relative">
        
        {/* Row 1 Container */}
        <div className="relative group/row1 w-full">
          {/* Scroll Left Button */}
          <button 
            onClick={() => scrollRow1('left')}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 text-white hidden md:flex items-center justify-center backdrop-blur-md transition-all active:scale-90 shadow-lg cursor-pointer md:opacity-0 md:group-hover/row1:opacity-100 duration-300"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div 
            ref={row1ContainerRef}
            className="overflow-x-auto no-scrollbar scroll-smooth w-full"
          >
            <div 
              ref={row1Ref}
              className="flex gap-4 md:gap-6 px-6 md:px-16 w-max transition-transform duration-100 will-change-transform"
            >
              {topRowCerts.map((cert, i) => (
                <button 
                  onClick={() => handleSelectCert(cert)}
                  key={`row1-${i}`}
                  className="group relative w-[240px] md:w-[380px] aspect-square rounded-3xl overflow-hidden border border-glass-10 dark:border-white/10 shadow-2xl cursor-pointer block text-left shrink-0 transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <img 
                    src={cert.image} 
                    alt={cert.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    style={{ objectPosition: cert.position || 'center' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent flex flex-col justify-end p-5 md:p-8">
                    <span className="text-[10px] md:text-xs text-white/70 uppercase tracking-wider mb-1 font-mono truncate max-w-full">
                      {cert.title}
                    </span>
                    <span className="font-display text-white text-lg md:text-2xl">
                      View Certificate
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Scroll Right Button */}
          <button 
            onClick={() => scrollRow1('right')}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 text-white hidden md:flex items-center justify-center backdrop-blur-md transition-all active:scale-90 shadow-lg cursor-pointer md:opacity-0 md:group-hover/row1:opacity-100 duration-300"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Row 2 Container */}
        <div className="relative group/row2 w-full">
          {/* Scroll Left Button */}
          <button 
            onClick={() => scrollRow2('left')}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 text-white hidden md:flex items-center justify-center backdrop-blur-md transition-all active:scale-90 shadow-lg cursor-pointer md:opacity-0 md:group-hover/row2:opacity-100 duration-300"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div 
            ref={row2ContainerRef}
            className="overflow-x-auto no-scrollbar scroll-smooth w-full"
          >
            <div 
              ref={row2Ref}
              className="flex gap-4 md:gap-6 px-6 md:px-16 w-max transition-transform duration-100 will-change-transform"
            >
              {bottomRowCerts.map((cert, i) => (
                <button 
                  onClick={() => handleSelectCert(cert)}
                  key={`row2-${i}`}
                  className="group relative w-[240px] md:w-[380px] aspect-square rounded-3xl overflow-hidden border border-glass-10 dark:border-white/10 shadow-2xl cursor-pointer block text-left shrink-0 transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <img 
                    src={cert.image} 
                    alt={cert.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    style={{ objectPosition: cert.position || 'center' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent flex flex-col justify-end p-5 md:p-8">
                    <span className="text-[10px] md:text-xs text-white/70 uppercase tracking-wider mb-1 font-mono truncate max-w-full">
                      {cert.title}
                    </span>
                    <span className="font-display text-white text-lg md:text-2xl">
                      View Certificate
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Scroll Right Button */}
          <button 
            onClick={() => scrollRow2('right')}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 text-white hidden md:flex items-center justify-center backdrop-blur-md transition-all active:scale-90 shadow-lg cursor-pointer md:opacity-0 md:group-hover/row2:opacity-100 duration-300"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Modal Popup Overlay */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => handleSelectCert(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 md:p-10 pointer-events-auto"
          >
            {/* Modal Container */}
            <motion.div
              key="modal-container"
              initial={{ opacity: 0, scale: 0.93, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 25 }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-glass-5 border border-glass-10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Close Button Top Right */}
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelectCert(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 border border-glass-10 flex items-center justify-center text-text-primary hover:bg-text-primary hover:text-bg transition-colors duration-300 cursor-pointer shadow-lg"
              >
                <X size={18} />
              </motion.button>

              {/* Certificate Image Frame */}
              <div className="flex-1 overflow-auto bg-black/20 p-2 sm:p-4 flex items-center justify-center min-h-[220px]">
                <div className="relative w-full flex items-center justify-center min-h-[200px]">
                  {/* Elegant Loading spinner */}
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 border-[3px] border-glass-10 border-t-text-primary rounded-full animate-spin" />
                    </div>
                  )}
                  <motion.img 
                    src={selectedCert.image}
                    alt={selectedCert.title}
                    onLoad={() => setImageLoaded(true)}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: imageLoaded ? 1 : 0, scale: imageLoaded ? 1 : 0.98 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="w-full h-auto max-h-[70vh] object-contain rounded-2xl shadow-xl"
                  />
                </div>
              </div>

              {/* Details and Actions footer */}
              <div className="p-5 sm:p-6 bg-surface/80 border-t border-glass-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-text-primary/5 flex items-center justify-center text-text-primary border border-glass-10">
                    <Award size={20} />
                  </div>
                  <div>
                    <h4 className="text-md sm:text-lg font-medium text-text-primary leading-tight">{selectedCert.title}</h4>
                    <p className="text-xs text-muted font-mono mt-0.5">Verified Credentials</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {selectedCert.link && (
                    <motion.a 
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      href={selectedCert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex group relative items-center justify-center rounded-full text-xs px-5 py-2.5 border border-stroke bg-bg/50 text-text-primary hover:border-transparent transition-all cursor-pointer"
                    >
                      <span className="absolute inset-0 rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                      <span className="absolute inset-[1px] bg-bg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                      <span className="flex items-center gap-2">Verify Online <ExternalLink size={14} /></span>
                    </motion.a>
                  )}
                  <motion.button 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectCert(null)}
                    className="px-5 py-2.5 rounded-full border border-stroke text-xs hover:bg-text-primary hover:text-bg hover:border-transparent transition-all font-medium cursor-pointer"
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
