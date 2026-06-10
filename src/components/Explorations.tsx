import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ExternalLink, Award } from 'lucide-react';

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
  const contentRef = useRef<HTMLDivElement>(null);
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);
  const [selectedCert, setSelectedCert] = useState<typeof certifications[0] | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleSelectCert = (cert: typeof certifications[0] | null) => {
    setImageLoaded(false);
    setSelectedCert(cert);
  };

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

  useEffect(() => {
    const ctx = gsap.context(() => {
      const container = containerRef.current;
      const content = contentRef.current;
      const col1 = col1Ref.current;
      const col2 = col2Ref.current;

      if (!container || !content || !col1 || !col2) return;

      // Make the parallax translations responsive to prevent layout overlap on smaller viewports
      const isMobile = window.innerWidth < 768;
      const y1Val = isMobile ? "-12%" : "-30%";
      const y2Val = isMobile ? "-25%" : "-60%";

      // Pin the center content
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        pin: content,
        pinSpacing: false,
      });

      // Animate title from top to middle
      const titleBox = container.querySelector('.cert-title-box');
      if (titleBox) {
        gsap.fromTo(titleBox,
          { y: "-48vh", opacity: 0.3 },
          {
            y: "0px",
            opacity: 1,
            ease: "power1.out",
            scrollTrigger: {
              trigger: container,
              start: "top bottom",
              end: "top top",
              scrub: true,
            }
          }
        );
      }

      // Parallax for columns
      gsap.to(col1, {
        y: y1Val,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      });

      gsap.to(col2, {
        y: y2Val,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-[120vh] bg-bg overflow-hidden">
      
      {/* Layer 1: Pinned Center (Behind Cards) */}
      <div 
        ref={contentRef}
        className="absolute top-0 left-0 w-full h-screen z-0 flex flex-col items-center justify-center pointer-events-none px-4"
      >
        <div className="cert-title-box bg-bg/80 backdrop-blur-md shadow-lg shadow-black/5 dark:shadow-black/20 px-6 py-8 md:px-12 md:py-10 rounded-3xl border border-glass-5 text-text-primary text-center shadow-2xl pointer-events-auto max-w-2xl w-full">
          <h2 className="text-4xl md:text-5xl lg:text-7xl text-text-primary tracking-tight mb-4">
            <span className="font-display italic">Certifications</span>
          </h2>
        </div>
      </div>

      {/* Layer 2: Parallax Columns (Above Text) */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 h-full pt-[22vh] pointer-events-none">
        <div className="grid grid-cols-2 gap-4 md:gap-40 justify-items-center pointer-events-auto">
          
          {/* Column 1 */}
          <div ref={col1Ref} className="flex flex-col gap-6 md:gap-16 mt-12 md:mt-24 w-full items-center">
            {certifications.slice(0, 3).map((cert, i) => (
              <button 
                onClick={() => handleSelectCert(cert)}
                key={`col1-${i}`}
                className="group relative w-full max-w-[320px] aspect-square rounded-3xl overflow-hidden border border-glass-10 dark:border-white/20 shadow-xl cursor-pointer hover:rotate-2 transition-all duration-500 block text-left"
              >
                <img 
                  src={cert.image} 
                  alt={cert.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  style={{ objectPosition: cert.position || 'center' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                  <span className="text-[10px] text-muted uppercase tracking-wider mb-1 font-mono">{cert.title}</span>
                  <span className="font-display text-text-primary text-lg">View Certificate</span>
                </div>
              </button>
            ))}
          </div>

          {/* Column 2 */}
          <div ref={col2Ref} className="flex flex-col gap-8 md:gap-16 mt-32 md:mt-48">
            {certifications.slice(3, 5).map((cert, i) => (
              <button 
                onClick={() => handleSelectCert(cert)}
                key={`col2-${i}`}
                className="group relative w-full max-w-[320px] aspect-square rounded-3xl overflow-hidden border border-glass-10 dark:border-white/20 shadow-xl cursor-pointer hover:-rotate-2 transition-all duration-500 block text-left"
              >
                <img 
                  src={cert.image} 
                  alt={cert.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  style={{ objectPosition: cert.position || 'center' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                  <span className="text-[10px] text-muted uppercase tracking-wider mb-1 font-mono">{cert.title}</span>
                  <span className="font-display text-text-primary text-lg">View Certificate</span>
                </div>
              </button>
            ))}
          </div>
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
