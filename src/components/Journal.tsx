import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const journalEntries = [
  {
    title: "IIT Madras",
    role: "BS in Data Science",
    date: "2024 - Ongoing",
    image: "iitm-logo.png",
    info: "CGPA: 8.84 / 10",
    link: "https://app.onlinedegree.iitm.ac.in/student/24F2003436"
  },
  {
    title: "Mohan Babu University",
    role: "B.Tech CSE",
    date: "2023 - 2027",
    image: "mbu-logo.jpg",
    info: "CGPA: 9.29 / 10",
  },
  {
    title: "Infosys Springboard 6.0",
    role: "Virtual Internship",
    date: "2025",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop",
    info: "Developed TaxPal MERN app",
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -30, y: 10 },
  visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

export default function Journal() {
  return (
    <section id="resume" className="bg-bg py-16 md:py-24 relative">
      {/* Background decoration for parallax feel */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface/20 pointer-events-none" />
      
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-px bg-stroke" />
              <span className="text-xs text-muted uppercase tracking-[0.3em]">Timeline</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-text-primary tracking-tight">
              Recent <span className="font-display italic">experiences</span>
            </h2>
            <p className="text-muted mt-4 max-w-md text-sm md:text-base">
              A brief timeline of my education, internships, and achievements.
            </p>
          </div>
          
          <a href="PadmaSambhava_Gopu.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex group relative items-center justify-center rounded-full text-sm px-6 py-3 border-2 border-stroke bg-transparent text-text-primary hover:border-transparent transition-all w-fit">
            <span className="absolute inset-0 rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            <span className="absolute inset-[2px] bg-bg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            <span className="flex items-center gap-2">View full resume <ArrowRight size={16} /></span>
          </a>
        </motion.div>

        {/* Entries */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col gap-4"
        >
          {journalEntries.map((entry) => {
            const isClickable = !!entry.link;

            return (
              <motion.a
                key={entry.title}
                href={entry.link}
                target={entry.link ? "_blank" : undefined}
                rel={entry.link ? "noopener noreferrer" : undefined}
                variants={itemVariants}
                className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 rounded-3xl sm:rounded-full bg-glass-5 hover:bg-glass-8 border border-glass-10 hover:border-glass-15 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] cursor-pointer transition-all duration-500"
              >
                {/* Image */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-full overflow-hidden">
                  <img 
                    src={entry.image} 
                    alt={entry.title}
                    className="w-full h-full object-cover transition-all duration-500 md:grayscale md:group-hover:grayscale-0 md:group-hover:scale-105"
                  />
                </div>
                
                {/* Content */}
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full px-2">
                  <div className="flex flex-col items-start gap-1.5">
                    <h3 className="text-lg md:text-xl text-text-primary font-medium mb-0.5 transition-all group-hover-accent-gradient-text">
                      {entry.title}
                    </h3>
                    <p className="text-sm text-muted">{entry.role}</p>
                    <span className="py-0.5 px-2.5 rounded-full border border-stroke/30 bg-bg/30 text-[10px] sm:text-xs text-muted uppercase tracking-wider truncate max-w-full">
                      {entry.info}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 sm:gap-8 text-xs sm:text-sm text-muted uppercase tracking-wider mt-2 sm:mt-0">
                    <span>{entry.date}</span>
                    {isClickable && (
                      <div className="w-8 h-8 rounded-full border border-stroke flex items-center justify-center group-hover:bg-text-primary group-hover:text-bg group-hover:border-transparent transition-colors">
                        <ArrowRight size={14} />
                      </div>
                    )}
                  </div>
                </div>
              </motion.a>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
