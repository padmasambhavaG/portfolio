import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Loader2, Check, Clock } from 'lucide-react';
import { useBackgroundHlsVideo } from '../hooks/useBackgroundHlsVideo';

export default function ContactFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  const [shouldLoadVideo, setShouldLoadVideo] = useState(
    () => typeof window !== 'undefined' && !('IntersectionObserver' in window),
  );
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });

  useBackgroundHlsVideo(videoRef, { enabled: shouldLoadVideo });

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer || shouldLoadVideo) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadVideo(true);
          observer.disconnect();
        }
      },
      { rootMargin: '600px 0px' },
    );

    observer.observe(footer);

    return () => {
      observer.disconnect();
    };
  }, [shouldLoadVideo]);

  // --- Marquee Setup ---
  useEffect(() => {
    if (marqueeRef.current) {
      gsap.to(marqueeRef.current, {
        xPercent: -50,
        duration: 40,
        ease: "none",
        repeat: -1
      });
    }
  }, []);
  const marqueeText = "BUILDING THE FUTURE • ".repeat(10);

  // --- Handlers ---

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: '', email: '', message: '' };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Valid email is required";
      valid = false;
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message cannot be empty";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Formspree endpoint — replace YOUR_FORM_ID with your actual ID from formspree.io
      const response = await fetch('https://formspree.io/f/maqzyyrn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        alert('Something went wrong. Please email me directly at gopupadmasambhava@gmail.com');
      }
    } catch {
      alert('Network error. Please email me directly at gopupadmasambhava@gmail.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer ref={footerRef} id="contact" className="relative bg-bg pt-16 md:pt-20 pb-8 md:pb-12 overflow-hidden border-t border-stroke">
      {/* Background Video */}
      <div className="absolute inset-0 z-0 opacity-40">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload={shouldLoadVideo ? "auto" : "none"}
          className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2 scale-y-[-1]"
        />
        <div className="absolute inset-0 bg-bg/80 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10">
        {/* GSAP Marquee */}
        <div className="w-full overflow-hidden whitespace-nowrap mb-16 pointer-events-none border-y border-stroke/30 py-4 bg-surface/20 backdrop-blur-sm">
          <div ref={marqueeRef} className="inline-block">
            <span className="text-4xl md:text-6xl lg:text-8xl font-display italic text-text-primary/10 tracking-wider">
              {marqueeText}
            </span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            
            {/* Left Column: Pitch & CTAs */}
            <div className="flex flex-col items-start justify-center">
              
              <h2 className="text-5xl md:text-6xl lg:text-7xl text-text-primary font-display italic mb-6 leading-tight">
                Let's build something <br />
                <span className="accent-gradient-text">P </span>rodi<span className="accent-gradient-text">G</span>ious.
              </h2>


              <div className="flex flex-wrap items-center gap-4 w-full">
                {/* Email Link */}
                <motion.a
                  whileTap={{ scale: 0.95 }}
                  href="mailto:gopupadmasambhava@gmail.com"
                  className="group relative flex-1 min-w-[200px] flex items-center justify-center gap-3 rounded-2xl text-sm px-6 py-4 bg-glass-5 border border-glass-10 text-text-primary hover:bg-glass-10 transition-colors"
                >
                  <Mail size={18} />
                  <span className="font-medium">gopupadmasambhava@gmail.com</span>
                </motion.a>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="bg-glass-5 backdrop-blur-xl border border-glass-10 shadow-2xl rounded-3xl p-6 md:p-8 relative overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#89AACC]/10 blur-[100px] rounded-full pointer-events-none" />
              
              <h3 className="text-2xl font-medium text-text-primary mb-6">Send a message</h3>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">
                <div>
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={`w-full bg-glass-5 border ${errors.name ? 'border-red-500/50' : 'border-glass-10'} outline-none text-text-primary placeholder:text-muted px-5 py-4 rounded-xl focus:ring-2 focus:ring-[#89AACC]/50 focus:bg-glass-10 transition-all`}
                  />
                  {errors.name && <span className="text-red-400 text-xs mt-1 ml-2">{errors.name}</span>}
                </div>

                <div>
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={`w-full bg-glass-5 border ${errors.email ? 'border-red-500/50' : 'border-glass-10'} outline-none text-text-primary placeholder:text-muted px-5 py-4 rounded-xl focus:ring-2 focus:ring-[#89AACC]/50 focus:bg-glass-10 transition-all`}
                  />
                  {errors.email && <span className="text-red-400 text-xs mt-1 ml-2">{errors.email}</span>}
                </div>

                <div>
                  <textarea 
                    placeholder="Tell me about your project..." 
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className={`w-full bg-glass-5 border ${errors.message ? 'border-red-500/50' : 'border-glass-10'} outline-none text-text-primary placeholder:text-muted px-5 py-4 rounded-xl focus:ring-2 focus:ring-[#89AACC]/50 focus:bg-glass-10 transition-all resize-none`}
                  />
                  {errors.message && <span className="text-red-400 text-xs mt-1 ml-2">{errors.message}</span>}
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting || submitSuccess}
                  className="w-full flex items-center justify-center gap-2 rounded-xl text-sm font-medium px-6 py-4 bg-text-primary text-bg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100 mt-2"
                >
                  {isSubmitting ? (
                    <><Loader2 size={18} className="animate-spin" /> Sending...</>
                  ) : submitSuccess ? (
                    <><Check size={18} className="text-green-500" /> Message Sent</>
                  ) : (
                    <>Send Message <ArrowRight size={18} /></>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 mt-2 text-xs text-muted">
                  <Clock size={14} className="text-[#89AACC]" />
                  <span>Usually responds within 24 hours</span>
                </div>
              </form>
            </div>

          </div>
        </div>

        {/* Footer Bar */}
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-stroke">
            
            {/* Social Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted">
              <a href="https://linkedin.com/in/padmasambhavagopu" target="_blank" rel="noreferrer" className="hover:text-text-primary transition-colors">LinkedIn</a>
              <a href="https://github.com/padmasambhavaG" target="_blank" rel="noreferrer" className="hover:text-text-primary transition-colors">GitHub</a>
              <a href="https://codolio.com/profile/padmasambhava" target="_blank" rel="noreferrer" className="hover:text-text-primary transition-colors">Codolio</a>
              <a href="https://leetcode.com/u/padmasambhava/" target="_blank" rel="noreferrer" className="hover:text-text-primary transition-colors">LeetCode</a>
            </div>

            {/* Availability — centered */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-glass-5 border border-glass-10 mx-auto md:mx-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs text-text-primary font-medium tracking-wide">Available for internships</span>
            </div>

            {/* Copyright */}
            <div className="text-xs text-muted">
              © {new Date().getFullYear()} PadmaSambhava Gopu
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
