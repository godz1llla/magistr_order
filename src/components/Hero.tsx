import { motion, useScroll, useTransform } from "motion/react";
import { useTranslation } from "react-i18next";
import { useRef } from "react";

export function Hero() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // As we scroll, the split line could move, or the images could morph.
  // Let's do a simple effect where the left side (past) fades out or shrinks, and right side (future) takes over, or they just stay split but the content changes.
  const leftWidth = useTransform(scrollYProgress, [0, 1], ["50%", "0%"]);
  const rightWidth = useTransform(scrollYProgress, [0, 1], ["50%", "100%"]);
  
  const opacityPast = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const opacityFuture = useTransform(scrollYProgress, [0.5, 1], [0.5, 1]);

  return (
    <div ref={containerRef} className="h-[200vh] relative">
      <div className="sticky top-0 h-screen w-full flex overflow-hidden">
        {/* Left Side - Past */}
        <motion.div 
          style={{ width: leftWidth }}
          className="h-full bg-[#8B5A2B] relative flex items-center justify-center overflow-hidden border-r-2 border-[#D2B48C]/30"
        >
          {/* Texture overlay for old paper/nomadic feel */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/old-wall.png')]" />
          
          <motion.div style={{ opacity: opacityPast }} className="relative z-10 flex flex-col items-center text-[#F5DEB3] p-8 text-center">
            <h2 className="text-4xl md:text-6xl font-serif mb-4">{t('hero.past')}</h2>
            <img 
              src="https://images.unsplash.com/photo-1533558701576-23c65e0272fb?auto=format&fit=crop&q=80&w=800" 
              alt="Batyr" 
              className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-full border-4 border-[#D2B48C] shadow-2xl mb-6 filter sepia"
            />
            <p className="max-w-md text-lg italic opacity-80">
              "Күш — білімде, білім — кітапта."
            </p>
          </motion.div>
        </motion.div>

        {/* Right Side - Future */}
        <motion.div 
          style={{ width: rightWidth }}
          className="h-full bg-[#0A0F1C] relative flex items-center justify-center overflow-hidden"
        >
          {/* Glassmorphism/Neon overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-cyan-500/10 backdrop-blur-sm" />
          
          <motion.div style={{ opacity: opacityFuture }} className="relative z-10 flex flex-col items-center text-white p-8 text-center">
            <h2 className="text-4xl md:text-6xl font-sans font-light tracking-widest mb-4 text-cyan-400">{t('hero.future')}</h2>
            <img 
              src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800" 
              alt="Modern Leader" 
              className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-full border-4 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.5)] mb-6"
            />
            <p className="max-w-md text-lg font-light text-cyan-100/80">
              "Innovation distinguishes between a leader and a follower."
            </p>
          </motion.div>
        </motion.div>

        {/* Center Timeline */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/50 to-transparent -translate-x-1/2 z-20 flex flex-col justify-between py-24 items-center">
          <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-md border border-white/20">1725</span>
          <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-md border border-white/20">1845</span>
          <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-md border border-white/20">1917</span>
          <span className="bg-black/50 text-cyan-400 px-3 py-1 rounded-full text-sm backdrop-blur-md border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.5)]">2025</span>
        </div>

        {/* Title Overlay */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-30 text-center pointer-events-none">
          <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg tracking-tighter mix-blend-overlay">
            {t('hero.title')}
          </h1>
        </div>
      </div>
    </div>
  );
}
