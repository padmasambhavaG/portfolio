import { motion } from 'framer-motion';
import { Terminal, Globe, Layers, Database, Settings, BookOpen } from 'lucide-react';

type Category = {
  title: string;
  icon: React.ElementType;
  color: string;
  skills: string[];
  hoverBorder: string;
  hoverShadow: string;
  hoverBg: string;
};

const skillData: Category[] = [
  {
    title: "Programming Languages",
    icon: Terminal,
    color: "from-cyan-500/20 to-blue-500/20",
    skills: ["Java", "Python", "C"],
    hoverBorder: "rgba(6, 182, 212, 0.3)",
    hoverShadow: "0 0 35px -5px rgba(6, 182, 212, 0.15)",
    hoverBg: "rgba(6, 182, 212, 0.04)"
  },
  {
    title: "Web Technologies",
    icon: Globe,
    color: "from-purple-500/20 to-pink-500/20",
    skills: ["HTML", "CSS", "JavaScript"],
    hoverBorder: "rgba(168, 85, 247, 0.3)",
    hoverShadow: "0 0 35px -5px rgba(168, 85, 247, 0.15)",
    hoverBg: "rgba(168, 85, 247, 0.04)"
  },
  {
    title: "Frameworks",
    icon: Layers,
    color: "from-rose-500/20 to-orange-500/20",
    skills: ["Flask (Basics)"],
    hoverBorder: "rgba(244, 63, 94, 0.3)",
    hoverShadow: "0 0 35px -5px rgba(244, 63, 94, 0.15)",
    hoverBg: "rgba(244, 63, 94, 0.04)"
  },
  {
    title: "Databases",
    icon: Database,
    color: "from-green-500/20 to-emerald-500/20",
    skills: ["MySQL", "SQLite"],
    hoverBorder: "rgba(16, 185, 129, 0.3)",
    hoverShadow: "0 0 35px -5px rgba(16, 185, 129, 0.15)",
    hoverBg: "rgba(16, 185, 129, 0.04)"
  },
  {
    title: "Tools",
    icon: Settings,
    color: "from-amber-500/20 to-orange-500/20",
    skills: ["Git", "GitHub", "VS Code"],
    hoverBorder: "rgba(245, 158, 11, 0.3)",
    hoverShadow: "0 0 35px -5px rgba(245, 158, 11, 0.15)",
    hoverBg: "rgba(245, 158, 11, 0.04)"
  },
  {
    title: "Core CS",
    icon: BookOpen,
    color: "from-blue-500/20 to-indigo-500/20",
    skills: ["Data Structures and Algorithms (DSA)", "Problem Solving", "DBMS", "OOPS"],
    hoverBorder: "rgba(99, 102, 241, 0.3)",
    hoverShadow: "0 0 35px -5px rgba(99, 102, 241, 0.15)",
    hoverBg: "rgba(99, 102, 241, 0.04)"
  }
];

export default function Skills() {
  return (
    <section id="skills" className="bg-bg py-20 relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-px bg-stroke" />
            <span className="text-xs text-muted uppercase tracking-[0.3em] font-mono">Capabilities</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-text-primary tracking-tight">
            Technical <span className="font-display italic">arsenal</span>
          </h2>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {skillData.map((category, catIdx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: catIdx * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.3, ease: [0.25, 1, 0.5, 1] } }}
              style={{
                '--hover-border': category.hoverBorder,
                '--hover-shadow': category.hoverShadow,
                '--hover-bg': category.hoverBg,
              } as React.CSSProperties}
              className="group relative bg-glass-5 backdrop-blur-lg border border-glass-10 rounded-3xl p-5 sm:p-6 flex flex-col h-full hover:bg-glass-10 hover:border-[var(--hover-border)] hover:shadow-[var(--hover-shadow)] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden"
            >
              {/* Subtle hover gradient background shine */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--hover-bg),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Card Header: Icon + Title */}
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-text-primary border border-glass-10 group-hover:scale-105 group-hover:border-[var(--hover-border)] transition-all duration-300`}>
                  <category.icon size={18} />
                </div>
                <h3 className="text-lg font-medium text-text-primary tracking-wide">{category.title}</h3>
              </div>

              {/* Skills Tags List */}
              <div className="flex flex-wrap gap-2.5 relative z-10">
                {category.skills.map((skill) => (
                  <span 
                    key={skill} 
                    className="text-xs px-3.5 py-2 rounded-xl bg-glass-5 border border-glass-10 text-text-primary hover:bg-text-primary hover:text-bg transition-colors duration-300 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
