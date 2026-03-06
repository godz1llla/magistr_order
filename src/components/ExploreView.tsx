import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, MapPin } from "lucide-react";
import { cn } from "../lib/utils";

interface ExploreViewProps {
  onBack: () => void;
}

interface Leader {
  id: string;
  year: string;
  name: string;
  desc: string;
  region: string;
}

// Approximate coordinates for regions on our stylized map
const regionCoordinates: Record<string, { top: string; left: string }> = {
  'Жетісу': { top: '75%', left: '75%' },
  'Жетысу': { top: '75%', left: '75%' },
  
  'Бурабай': { top: '15%', left: '55%' },
  
  'Ұлытау': { top: '50%', left: '45%' },
  'Улытау': { top: '50%', left: '45%' },
  
  'Семей': { top: '35%', left: '85%' },
  
  'Алматы': { top: '80%', left: '78%' },
  
  'Астана': { top: '30%', left: '55%' }
};

export function ExploreView({ onBack }: ExploreViewProps) {
  const { t } = useTranslation();
  const leaders = t('explore.leaders', { returnObjects: true }) as Leader[];
  const [activeLeader, setActiveLeader] = useState<Leader>(leaders[0]);

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white flex flex-col pt-24 pb-12 px-4 md:px-8 relative overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

      {/* Header */}
      <div className="relative z-20 max-w-7xl mx-auto w-full flex justify-between items-center mb-12">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm uppercase tracking-wider text-gray-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('explore.back')}
        </button>
        <h2 className="text-2xl md:text-4xl font-serif text-[#D2B48C]">
          {t('explore.timelineTitle')}
        </h2>
      </div>

      {/* Main Content: Split Layout */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-8 lg:gap-16 flex-1">
        
        {/* Left: Map */}
        <div className="flex-1 lg:w-1/2 flex flex-col">
          <h3 className="text-xl font-sans font-light text-cyan-400 mb-6 uppercase tracking-widest">
            {t('explore.mapTitle')}
          </h3>
          <div className="relative w-full aspect-[4/3] bg-[#1A1A1A] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
            {/* Map Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1600')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] to-transparent opacity-80" />

            {/* Map Points */}
            {leaders.map((leader) => {
              const coords = regionCoordinates[leader.region];
              if (!coords) return null;
              
              const isActive = activeLeader.id === leader.id;

              return (
                <div 
                  key={`map-${leader.id}`}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                  style={{ top: coords.top, left: coords.left }}
                >
                  <div className="relative group cursor-pointer" onClick={() => setActiveLeader(leader)}>
                    {isActive && (
                      <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping opacity-50 w-6 h-6 -ml-1 -mt-1" />
                    )}
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 relative z-10 transition-colors",
                      isActive ? "bg-cyan-400 border-white scale-150 shadow-[0_0_15px_rgba(6,182,212,0.8)]" : "bg-[#8B5A2B] border-[#D2B48C] hover:bg-[#D2B48C]"
                    )} />
                    
                    {/* Region Label */}
                    <div className={cn(
                      "absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold tracking-wider px-2 py-1 rounded bg-black/80 backdrop-blur-sm border transition-opacity",
                      isActive ? "opacity-100 border-cyan-500/50 text-cyan-300" : "opacity-0 group-hover:opacity-100 border-white/10 text-gray-300"
                    )}>
                      {leader.region}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Timeline & Info */}
        <div className="flex-1 lg:w-1/2 flex flex-col">
          {/* Timeline Scroller */}
          <div className="flex overflow-x-auto pb-6 mb-8 scrollbar-hide gap-4 snap-x">
            {leaders.map((leader) => (
              <button
                key={`timeline-${leader.id}`}
                onClick={() => setActiveLeader(leader)}
                className={cn(
                  "snap-start shrink-0 px-6 py-3 rounded-full border transition-all whitespace-nowrap",
                  activeLeader.id === leader.id 
                    ? "bg-cyan-900/40 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.2)]" 
                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                )}
              >
                <span className="font-mono text-sm mr-2 opacity-70">{leader.year}</span>
                <span className="font-medium">{leader.name}</span>
              </button>
            ))}
          </div>

          {/* Active Leader Info Card */}
          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeLeader.id}
                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md flex flex-col"
              >
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-5xl md:text-7xl font-serif text-[#D2B48C] opacity-50">
                    {activeLeader.year}
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-[#D2B48C]/50 to-transparent" />
                </div>
                
                <h3 className="text-3xl md:text-5xl font-bold mb-4 text-white">
                  {activeLeader.name}
                </h3>
                
                <div className="flex items-center gap-2 text-cyan-400 mb-8 text-sm uppercase tracking-widest font-semibold">
                  <MapPin className="w-4 h-4" />
                  {activeLeader.region}
                </div>
                
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-light">
                  {activeLeader.desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
