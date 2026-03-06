import { useState } from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { cn } from "../lib/utils";

export function MapSection() {
  const { t } = useTranslation();
  const [hoveredRegion, setHoveredRegion] = useState<"past" | "future" | null>(null);

  return (
    <section className="relative min-h-screen py-24 flex flex-col items-center justify-center overflow-hidden bg-[#1A1A1A]">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-serif text-center text-[#D2B48C] mb-16">
          {t('map.title')}
        </h2>

        {/* Map Container */}
        <div 
          className={cn(
            "relative w-full aspect-[16/9] rounded-3xl overflow-hidden border-2 transition-all duration-700",
            hoveredRegion === 'future' ? "border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.2)] bg-[#0A0F1C]" : "border-[#8B5A2B]/50 shadow-[0_0_50px_rgba(139,90,43,0.2)] bg-[#2C1E16]"
          )}
        >
          {/* Background Map Image (Stylized) */}
          <div 
            className={cn(
              "absolute inset-0 bg-cover bg-center transition-opacity duration-700",
              hoveredRegion === 'future' ? "opacity-0" : "opacity-40"
            )}
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1600')" }}
          />
          <div 
            className={cn(
              "absolute inset-0 bg-cover bg-center transition-opacity duration-700 mix-blend-screen",
              hoveredRegion === 'future' ? "opacity-30" : "opacity-0"
            )}
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1600')" }}
          />

          {/* Hotspot: Turkestan (Past) */}
          <div 
            className="absolute top-[60%] left-[30%] group cursor-pointer"
            onMouseEnter={() => setHoveredRegion('past')}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            <div className="relative">
              <div className="w-6 h-6 rounded-full bg-[#D2B48C] animate-ping absolute inset-0 opacity-75" />
              <div className="w-6 h-6 rounded-full bg-[#8B5A2B] border-2 border-[#D2B48C] relative z-10" />
            </div>
            
            {/* Tooltip */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-64 bg-[#3E2723] border border-[#D2B48C]/30 p-4 rounded-xl shadow-2xl z-20 pointer-events-none"
            >
              <h3 className="text-[#D2B48C] font-serif text-lg mb-2">{t('map.turkestan')}</h3>
              <p className="text-[#F5DEB3]/80 text-sm">{t('map.turkestan_desc')}</p>
            </motion.div>
          </div>

          {/* Hotspot: Almaty/Astana (Future) */}
          <div 
            className="absolute top-[40%] left-[70%] group cursor-pointer"
            onMouseEnter={() => setHoveredRegion('future')}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            <div className="relative">
              <div className="w-6 h-6 rounded-full bg-cyan-400 animate-ping absolute inset-0 opacity-75" />
              <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-cyan-300 relative z-10" />
            </div>
            
            {/* Tooltip */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-64 bg-[#0A0F1C]/90 backdrop-blur-md border border-cyan-500/30 p-4 rounded-xl shadow-[0_0_30px_rgba(6,182,212,0.3)] z-20 pointer-events-none"
            >
              <h3 className="text-cyan-400 font-sans tracking-wide text-lg mb-2">{t('map.almaty')}</h3>
              <p className="text-cyan-100/80 text-sm font-light">{t('map.almaty_desc')}</p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
