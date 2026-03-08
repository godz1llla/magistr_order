import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, MapPin } from "lucide-react";
import { cn } from "../lib/utils";
import kazakhstanMap from "../assets/kazakhstan_map.png";

interface ExploreViewProps {
  onBack: () => void;
}

interface Leader {
  id: string;
  year: string;
  name: string;
  leaders: string;
  desc: string;
  region: string;
}

const regionCoordinates: Record<string, { top: string; left: string }> = {
  'Астана': { top: '32%', left: '54%' },
  'Алматы': { top: '75%', left: '76%' },
  'Жетісу': { top: '75%', left: '76%' },
  'Жетысу': { top: '75%', left: '76%' },
  'Семей': { top: '28%', left: '80%' },
  'Түркістан': { top: '78%', left: '44%' },
  'Туркестан': { top: '78%', left: '44%' },
  'Арқа': { top: '48%', left: '50%' },
  'Арка': { top: '48%', left: '50%' },
  'Бурабай': { top: '25%', left: '52%' },
  'Ұлытау': { top: '52%', left: '40%' },
  'Улытау': { top: '52%', left: '40%' },
};

export function ExploreView({ onBack }: ExploreViewProps) {
  const { t } = useTranslation();
  const leaders = t('explore.leaders', { returnObjects: true }) as Leader[];
  const [activeId, setActiveId] = useState<string>(leaders[0].id);
  const activeLeader = leaders.find(l => l.id === activeId) || leaders[0];

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

        {/* ── LEFT: Map ── */}
        <div className="lg:w-1/2 flex flex-col">
          <h3 className="text-xl font-sans font-light text-cyan-400 mb-6 uppercase tracking-widest">
            {t('explore.mapTitle')}
          </h3>

          {/* Map container */}
          <div className="relative w-full aspect-[4/3] bg-[#0d1424] rounded-3xl border border-cyan-900/40 overflow-hidden shadow-2xl">
            <img
              src={kazakhstanMap}
              alt="Kazakhstan Map"
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C]/60 via-transparent to-transparent" />

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
                  <div className="relative group cursor-pointer" onClick={() => setActiveId(leader.id)}>
                    {isActive && (
                      <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping opacity-50 w-6 h-6 -ml-1 -mt-1" />
                    )}
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 relative z-10 transition-colors",
                      isActive
                        ? "bg-cyan-400 border-white scale-150 shadow-[0_0_15px_rgba(6,182,212,0.8)]"
                        : "bg-[#8B5A2B] border-[#D2B48C] hover:bg-[#D2B48C]"
                    )} />
                    <div className={cn(
                      "absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold tracking-wider px-2 py-1 rounded bg-black/80 backdrop-blur-sm border transition-opacity",
                      isActive
                        ? "opacity-100 border-cyan-500/50 text-cyan-300"
                        : "opacity-0 group-hover:opacity-100 border-white/10 text-gray-300"
                    )}>
                      {leader.region}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT: Year buttons + Info Card ── */}
        <div className="lg:w-1/2 flex flex-col">

          {/* Year buttons grid — 5 columns, always fully visible */}
          <div className="grid grid-cols-5 gap-2 mb-8">
            {leaders.map((leader) => (
              <button
                key={`timeline-${leader.id}`}
                onClick={() => setActiveId(leader.id)}
                title={leader.name}
                className={cn(
                  "py-3 rounded-2xl border transition-all text-center",
                  activeLeader.id === leader.id
                    ? "bg-cyan-900/40 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white hover:border-white/25"
                )}
              >
                <span className="font-mono text-sm font-semibold">{leader.year}</span>
              </button>
            ))}
          </div>

          {/* Active Leader Info Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLeader.id}
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              transition={{ duration: 0.4 }}
              className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md flex flex-col shadow-2xl"
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

              <div className="flex items-center gap-2 text-cyan-400 mb-6 text-sm uppercase tracking-widest font-semibold">
                <MapPin className="w-4 h-4" />
                {activeLeader.region}
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.4em] text-cyan-400 mb-3 font-black opacity-60">
                    {t('explore.leadersTitle')}
                  </h4>
                  <p className="text-xl md:text-2xl text-white font-serif leading-snug">
                    {activeLeader.leaders}
                  </p>
                </div>

                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.4em] text-cyan-400 mb-3 font-black opacity-60">
                    {t('explore.missionTitle')}
                  </h4>
                  <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-light italic border-l-2 border-white/10 pl-6 py-1">
                    {activeLeader.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>
        {/* ── END RIGHT ── */}

      </div>
    </div>
  );
}
