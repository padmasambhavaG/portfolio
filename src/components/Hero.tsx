import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Search, Menu, X, FileText, Code2, Globe, ExternalLink, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import heroPoster from '../assets/hero.png';
import { useBackgroundHlsVideo } from '../hooks/useBackgroundHlsVideo';

gsap.registerPlugin(ScrollTrigger);

const ROLES = ["Software Engineer", "Full Stack Developer", "Problem Solver", "Scholar"];

const navLinks = [
  { name: "Home", id: "home" },
  { name: "Work", id: "work" },
  { name: "Skills", id: "skills" },
  { name: "Journal", id: "resume" },
];

const quickLinks = [
  { name: "Download Resume", icon: FileText, href: "PadmaSambhava_Gopu.pdf", isExternal: true },
  { name: "GitHub Profile", icon: Code2, href: "https://github.com/padmasambhavaG", isExternal: true },
  { name: "LinkedIn", icon: Globe, href: "https://www.linkedin.com/in/padmasambhavagopu", isExternal: true }
];

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 1000], [0, 300]);

  const [activeSection, setActiveSection] = useState('home');
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, toggleTheme } = useTheme();

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  useBackgroundHlsVideo(videoRef);

  useEffect(() => {
    const roleInterval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }, 2000);

    return () => {
      clearInterval(roleInterval);
    };
  }, []);

  useEffect(() => {
    // GSAP Entrance Animations
    gsap.fromTo('.blur-in',
      { opacity: 0, filter: "blur(10px)", y: 20 },
      { opacity: 1, filter: "blur(0px)", y: 0, duration: 1, stagger: 0.1, delay: 0.3, ease: "power3.out" }
    );

    const handleScroll = () => {
      if (navRef.current) {
        if (window.scrollY > 100) {
          navRef.current.classList.add('backdrop-blur-2xl');
        } else {
          navRef.current.classList.remove('backdrop-blur-2xl');
        }
      }

      const sections = ['home', 'work', 'skills', 'resume', 'testimonials', 'stats', 'insights', 'contact'];
      let current = 'home';
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2) {
            current = id;
          }
        }
      }
      setActiveSection(current);
    };
    
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when modals are open
  useEffect(() => {
    if (isMobileMenuOpen || isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen, isSearchOpen]);



  // Dynamic Tinting
  const getNavTint = () => {
    switch (activeSection) {
      case 'work': return 'bg-black/60 border-[#4E85BF]/30 shadow-[0_4px_30px_rgba(78,133,191,0.25)] text-white';
      case 'skills': return 'bg-black/60 border-orange-500/30 shadow-[0_4px_30px_rgba(249,115,22,0.25)] text-white';
      case 'resume': return 'bg-black/60 border-purple-500/30 shadow-[0_4px_30px_rgba(168,85,247,0.25)] text-white';
      case 'testimonials': return 'bg-black/60 border-yellow-500/30 shadow-[0_4px_30px_rgba(234,179,8,0.25)] text-white';
      case 'stats': return 'bg-black/60 border-blue-500/30 shadow-[0_4px_30px_rgba(59,130,246,0.25)] text-white';
      case 'insights': return 'bg-black/60 border-rose-500/30 shadow-[0_4px_30px_rgba(244,63,94,0.25)] text-white';
      case 'contact': return 'bg-black/60 border-emerald-500/30 shadow-[0_4px_30px_rgba(16,185,129,0.25)] text-white';
      default: return 'bg-black/60 border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)] text-white';
    }
  };

  return (
    <section id="home" className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* Background Video */}
      <motion.div className="absolute inset-0 z-0" style={{ y: backgroundY }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={heroPoster}
          className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2 scale-110"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-0 left-0 right-0 h-20 md:h-32 bg-gradient-to-t from-bg to-transparent" />
      </motion.div>

      {/* Floating Navbar */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4 pointer-events-none"
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      >
        <div 
          ref={navRef}
          className={`inline-flex items-center rounded-full backdrop-blur-xl border px-2 py-2 transition-all duration-500 pointer-events-auto hover:border-glass-20 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] ${getNavTint()}`}
        >
          {/* Logo */}
          <div className="w-9 h-9 rounded-full flex items-center justify-center group relative overflow-hidden shrink-0">
            <div className="absolute inset-0 accent-gradient group-hover:rotate-180 transition-transform duration-700 ease-in-out" />
            <div className="absolute inset-[1px] bg-zinc-950 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <span className="font-display italic text-[13px] text-white">PG</span>
            </div>
          </div>

          <div className="w-px h-5 bg-white/10 mx-1 hidden md:block" />

          {/* Desktop Nav Links */}
          <div 
            className="hidden md:flex items-center"
            onMouseLeave={() => setHoveredSection(null)}
          >
            {navLinks.map((item) => {
              const isPillActive = (hoveredSection || activeSection) === item.id;
              const isTextActive = activeSection === item.id;
              return (
                <a 
                  key={item.id}
                  href={`#${item.id}`}
                  onMouseEnter={() => setHoveredSection(item.id)}
                  className={`relative text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-colors group/link ${
                    isTextActive ? 'text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {isPillActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white/10 rounded-full"
                      style={{ zIndex: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 group-hover/link:after:scale-x-100 after:content-[''] after:absolute after:-bottom-0.5 after:left-0 after:w-full after:h-px after:bg-white after:scale-x-0 after:origin-left after:transition-transform after:duration-300">
                    {item.name}
                  </span>
                </a>
              );
            })}
          </div>

          <div className="w-px h-5 bg-white/10 mx-1" />

          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className="w-9 h-9 relative before:absolute before:-inset-3 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors mx-0.5"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Search Button */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="w-9 h-9 relative before:absolute before:-inset-3 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors mx-0.5"
            aria-label="Quick Links"
          >
            <Search size={16} />
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="w-9 h-9 relative before:absolute before:-inset-3 flex md:hidden items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors mx-0.5"
            aria-label="Menu"
          >
            <Menu size={18} />
          </button>

          {/* Say Hi Button (Hidden on very small screens to save space) */}
          <a href="#contact" className="hidden sm:inline-flex relative group rounded-full text-xs sm:text-sm ml-1">
            <span className={`absolute -inset-[2px] rounded-full accent-gradient transition-opacity duration-500 animate-gradient-shift ${activeSection === 'contact' ? 'opacity-100 blur-sm' : 'opacity-0 group-hover:opacity-100 group-hover:blur-md'}`} />
            <div className={`relative flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-md shadow-lg shadow-black/5 dark:shadow-black/20 text-white transition-all duration-500 border border-white/10 ${activeSection === 'contact' ? 'bg-white/20 shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-transparent hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]'}`}>
              Say hi <ArrowUpRight size={14} />
            </div>
          </a>
        </div>
      </motion.nav>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mt-12">
        <motion.h1 
          className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-display italic leading-[0.9] tracking-tight mb-6 md:whitespace-nowrap mt-12 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } }
          }}
        >
          {['PadmaSambhava', 'Gopu'].map((word, i) => (
             <motion.span 
               key={i} 
               variants={{ hidden: { opacity: 0, y: 50, filter: "blur(10px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1, ease: "easeOut" } } }}
               className="mr-3 md:mr-6 hero-name-gradient-text animate-gradient-shift"
             >
               {word}
             </motion.span>
          ))}
        </motion.h1>
        
        <motion.div layout className="blur-in text-xl md:text-3xl text-white mb-6 flex flex-wrap justify-center items-center gap-x-2 drop-shadow-md">
          <motion.span layout>A</motion.span>
          <div className="relative flex justify-center items-center">
            <AnimatePresence mode="popLayout">
              <motion.span 
                key={roleIndex}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="font-display italic text-white whitespace-nowrap text-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
              >
                {ROLES[roleIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
          <motion.span layout>lives in Tirupati.</motion.span>
        </motion.div>
        
        <motion.p 
          className="text-sm md:text-base text-white/60 max-w-md mx-auto mb-12 h-12 md:h-auto"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.02, delayChildren: 1 } }
          }}
        >
          {"Proactive problem-solver committed to writing clean, maintainable code and building real-world products.".split("").map((char, i) => (
             <motion.span key={i} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
               {char}
             </motion.span>
          ))}
        </motion.p>
        
        <div className="blur-in flex items-center gap-4">
          <motion.a whileTap={{ scale: 0.95 }} href="#work" className="group relative inline-flex items-center justify-center rounded-full text-sm px-7 py-3.5 bg-text-primary text-bg hover:bg-bg hover:text-text-primary transition-colors hover:scale-105 duration-300">
            <span className="absolute inset-0 rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            <span className="absolute inset-[2px] bg-bg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            See Works
          </motion.a>
          
          <motion.a 
            whileTap={{ scale: 0.95 }}
            href="PadmaSambhava_Gopu.pdf"
            download="PadmaSambhava_Gopu.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center rounded-full text-sm px-7 py-3.5 border-2 border-stroke bg-bg text-text-primary hover:border-transparent transition-colors hover:scale-105 duration-300"
          >
            <span className="absolute inset-0 rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            <span className="absolute inset-[2px] bg-bg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            Download Resume
          </motion.a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
        <span className="text-[10px] text-white/60 uppercase tracking-[0.2em]">Scroll</span>
        <div className="w-px h-10 bg-white/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-white animate-scroll-down" />
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* Mobile Menu Modal */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-lg shadow-xl shadow-black/5 dark:shadow-black/20"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-glass-10 backdrop-blur-2xl border border-glass-20 rounded-3xl p-6 shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-glass-10 flex items-center justify-center hover:bg-glass-20 transition-colors"
              >
                <X size={16} />
              </button>
              
              <h3 className="text-xl font-display italic text-text-primary mb-6">Navigation</h3>
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-glass-10 transition-colors text-text-primary"
                  >
                    <span className="text-lg">{link.name}</span>
                    <ArrowUpRight size={16} className="opacity-50" />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quick Links / Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
              onClick={closeSearch}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="relative w-full max-w-lg bg-[#121212]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden animate-role-fade-in text-white"
            >
              <div className="flex items-center gap-3 pb-4 mb-4 border-b border-white/10">
                <Search size={20} className="text-white/40" />
                <input 
                  type="text" 
                  placeholder="Quick Links..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/5 border border-white/10 outline-none text-white w-full placeholder:text-white/40 text-base px-4 py-2 rounded-xl focus:ring-2 focus:ring-[#89AACC]/50 focus:bg-white/10 transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
                />
                <button 
                  onClick={closeSearch}
                  className="w-8 h-8 shrink-0 rounded-full bg-white/10 text-white/80 flex items-center justify-center hover:bg-white/20 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-1">
                {quickLinks
                  .filter((link) => link.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      target={link.isExternal ? "_blank" : "_self"}
                      rel={link.isExternal ? "noopener noreferrer" : ""}
                      onClick={() => {
                        closeSearch();
                      }}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300 group-hover:scale-110 shadow-sm text-white/80">
                        <link.icon size={18} className="group-hover:animate-pulse" />
                      </div>
                      <span className="flex-1 text-white font-medium">{link.name}</span>
                      {link.isExternal && <ExternalLink size={14} className="text-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />}
                    </a>
                  ))}
                {quickLinks.filter((link) => link.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                  <div className="text-center py-8 text-white/40 text-sm italic">
                    No matching links found
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
