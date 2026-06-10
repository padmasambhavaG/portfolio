import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { ArrowRight, Code2, ExternalLink, X } from 'lucide-react';

type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  image: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  colSpan: string;
};

const projects: Project[] = [
  {
    id: "taxpal",
    title: "TaxPal",
    category: "Fullstack",
    description: "Finance & Tax Estimator",
    longDescription: "A comprehensive MERN stack application designed to help individuals and small businesses estimate their taxes accurately. Features include dynamic tax bracket calculations, expense tracking, and real-time dashboard analytics.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    techStack: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    githubUrl: "https://github.com/padmasambhavaG/TaxPal_Project.git",
    colSpan: "md:col-span-6 min-h-[350px] lg:min-h-[450px]"
  },
  {
    id: "fairride",
    title: "FairRide",
    category: "Fullstack",
    description: "Intelligent Campus Ride-booking Platform",
    longDescription: "A full-stack ride-booking web application designed to help college students coordinate campus rides. Built using Vanilla HTML/JS and Tailwind CSS on the frontend, and Express, Prisma ORM, and PostgreSQL on the backend.",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop",
    techStack: ["HTML5", "Tailwind CSS", "Node.js", "Express", "Prisma", "PostgreSQL"],
    githubUrl: "https://github.com/padmasambhavaG/fairride-mbu",
    liveUrl: "https://fairride-mbu.vercel.app/",
    colSpan: "md:col-span-6 min-h-[350px] lg:min-h-[450px]"
  }
];

const categories = ["All", "Fullstack", "Frontend"];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 80, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const } }
};

// --- Lazy Load Image Component ---
function ImageWithSkeleton({ src, alt, layoutId, className }: { src: string, alt: string, layoutId: string, className?: string }) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Generate srcSet for Unsplash images to optimize mobile bandwidth
  const generateSrcSet = (url: string) => {
    if (!url.includes('unsplash.com')) return undefined;
    const baseUrl = url.replace(/&w=\d+/, '');
    return `${baseUrl}&w=600 600w, ${baseUrl}&w=1200 1200w, ${baseUrl}&w=2000 2000w`;
  };

  return (
    <div className="absolute inset-0 w-full h-full">
      {/* Skeleton Shimmer */}
      <div 
        className={`absolute inset-0 bg-glass-5 animate-pulse transition-opacity duration-500 ${isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      />
      {/* Actual Image */}
      <motion.img 
        layoutId={layoutId}
        src={src} 
        srcSet={generateSrcSet(src)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        alt={alt} 
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:blur-sm ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className || ''}`}
      />
    </div>
  );
}

export default function SelectedWorks() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredProjects = projects.filter(p => 
    activeFilter === "All" ? true : p.category === activeFilter
  );

  const selectedProject = projects.find(p => p.id === selectedId);

  useEffect(() => {
    if (selectedId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedId]);

  return (
    <section id="work" className="bg-bg py-12 md:py-16 relative">
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
              <span className="text-xs text-muted uppercase tracking-[0.3em]">Selected Work</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-text-primary tracking-tight mb-6">
              Featured <span className="font-display italic">projects</span>
            </h2>
            
            {/* Filter Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  className={`px-5 py-2 rounded-full text-sm transition-all whitespace-nowrap ${
                    activeFilter === category 
                      ? 'bg-text-primary text-bg' 
                      : 'bg-surface border border-stroke text-muted hover:text-text-primary hover:border-stroke/80'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <button className="inline-flex group relative items-center justify-center rounded-full text-sm px-6 py-3 border-2 border-stroke bg-transparent text-text-primary hover:border-transparent transition-all w-fit">
            <span className="absolute inset-0 rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            <span className="absolute inset-[2px] bg-bg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            <span className="flex items-center gap-2">View all work <ArrowRight size={16} /></span>
          </button>
        </motion.div>

        {/* Masonry Bento Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-12 auto-rows-min gap-5 md:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layoutId={`card-${project.id}`}
                key={project.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                onClick={() => setSelectedId(project.id)}
                className={`group relative overflow-hidden rounded-3xl bg-glass-5 backdrop-blur-lg shadow-xl shadow-black/5 dark:shadow-black/20 border border-glass-10 hover:border-glass-20 hover:shadow-[0_0_50px_rgba(255,255,255,0.2)] transition-all duration-500 cursor-pointer ${project.colSpan}`}
              >
                {/* Background Image with Lazy Loading Skeleton */}
                <ImageWithSkeleton 
                  src={project.image} 
                  alt={project.title} 
                  layoutId={`image-${project.id}`} 
                />
                
                {/* Glass Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                
                {/* Top Badges */}
                <div className="absolute top-6 left-6 pointer-events-none z-10">
                  <span className="text-[10px] md:text-xs px-3 py-1.5 rounded-full border border-glass-20 bg-black/40 text-white backdrop-blur-md shadow-lg shadow-black/5 dark:shadow-black/20 font-medium tracking-wide">
                    {project.category}
                  </span>
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end pointer-events-none z-10">
                  <motion.div layoutId={`title-container-${project.id}`} className="relative">
                    <h3 className="text-3xl md:text-4xl font-display italic text-white mb-2 drop-shadow-lg transform group-hover:-translate-y-2 transition-transform duration-500">{project.title}</h3>
                    
                    {/* Hover Reveal Content */}
                    <div className="md:h-0 md:opacity-0 md:group-hover:h-auto md:group-hover:opacity-100 transition-all duration-500 ease-out md:translate-y-8 md:group-hover:translate-y-0">
                      <p className="text-white/80 line-clamp-2 mt-2 drop-shadow-sm">
                        {project.description}
                      </p>
                      
                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {project.techStack.slice(0, 3).map(tech => (
                          <span key={tech} className="text-[10px] px-2 py-1 rounded-full border border-glass-20 bg-glass-10 text-white backdrop-blur-md shadow-lg shadow-black/5 dark:shadow-black/20 shadow-sm">
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 3 && (
                          <span className="text-[10px] px-2 py-1 rounded-full border border-glass-20 bg-glass-10 text-white backdrop-blur-md shadow-lg shadow-black/5 dark:shadow-black/20 shadow-sm">
                            +{project.techStack.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Expanded Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 pointer-events-none">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-2xl pointer-events-auto"
              onClick={() => setSelectedId(null)}
            />
            
            {/* Modal Content */}
            <motion.div 
              layoutId={`card-${selectedProject.id}`}
              className="relative w-full max-w-[1000px] h-[90vh] md:h-[80vh] bg-glass-5 backdrop-blur-3xl border border-glass-10 rounded-[2rem] overflow-hidden flex flex-col pointer-events-auto shadow-[0_0_80px_rgba(255,255,255,0.15)]"
            >
              {/* Close Button with expanded tap target */}
              <button 
                onClick={() => setSelectedId(null)}
                className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors backdrop-blur-md shadow-lg shadow-black/5 dark:shadow-black/20 border border-glass-20 before:absolute before:-inset-3 cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="w-full h-[40%] md:h-[50%] relative shrink-0">
                <motion.img 
                  layoutId={`image-${selectedProject.id}`}
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-6 left-6 flex items-center gap-4 z-10">
                   <span className="text-xs px-4 py-2 rounded-full border border-glass-20 bg-black/40 text-white backdrop-blur-md shadow-lg shadow-black/5 dark:shadow-black/20 font-medium tracking-wide">
                    {selectedProject.category}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
              </div>

              <div className="p-6 md:p-12 flex flex-col md:flex-row gap-8 md:gap-10 overflow-y-auto relative z-10 overscroll-contain">
                <div className="flex-1">
                  <motion.div layoutId={`title-container-${selectedProject.id}`}>
                    <h2 className="text-4xl md:text-5xl font-display italic text-text-primary mb-6">{selectedProject.title}</h2>
                  </motion.div>
                  <p className="text-muted text-base md:text-lg leading-relaxed mb-8">
                    {selectedProject.longDescription}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 mt-auto">
                    {selectedProject.liveUrl && (
                      <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-text-primary text-bg rounded-full text-sm hover:scale-105 transition-transform">
                        <ExternalLink size={16} /> Live Preview
                      </a>
                    )}
                    {selectedProject.githubUrl && (
                      <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 border border-stroke bg-transparent text-text-primary hover:bg-stroke/50 rounded-full text-sm hover:scale-105 transition-all">
                        <Code2 size={16} /> Source Code
                      </a>
                    )}
                  </div>
                </div>
                
                <div className="w-full md:w-[300px] shrink-0">
                  <h4 className="text-text-primary font-medium mb-4 flex items-center gap-2">
                    <div className="w-4 h-px bg-stroke" />
                    Tech Stack
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {selectedProject.techStack.map(tech => (
                      <span key={tech} className="text-xs px-3 py-1.5 rounded-full border border-stroke bg-bg text-muted">
                        {tech}
                      </span>
                    ))}
                  </div>


                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
