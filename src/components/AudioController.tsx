import { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useScroll } from "motion/react";

export function AudioController() {
  const [isMuted, setIsMuted] = useState(true);
  const { scrollYProgress } = useScroll();
  const [mix, setMix] = useState(0); // 0 = past, 1 = future

  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      // Simple logic: top half is past, bottom half is future
      // In a real app, we'd adjust volume of two audio elements based on this mix
      setMix(latest);
    });
  }, [scrollYProgress]);

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-center gap-4">
      
      {/* Visualizer / Indicator */}
      {!isMuted && (
        <div className="flex gap-1 items-end h-8 w-12 opacity-50">
          <div className="w-1 bg-[#D2B48C] rounded-t-sm animate-[bounce_1s_infinite]" style={{ height: `${(1-mix)*100}%` }} />
          <div className="w-1 bg-[#D2B48C] rounded-t-sm animate-[bounce_1.2s_infinite]" style={{ height: `${(1-mix)*80}%` }} />
          <div className="w-1 bg-cyan-400 rounded-t-sm animate-[bounce_0.8s_infinite]" style={{ height: `${mix*100}%` }} />
          <div className="w-1 bg-cyan-400 rounded-t-sm animate-[bounce_1.1s_infinite]" style={{ height: `${mix*90}%` }} />
        </div>
      )}

      <button
        onClick={() => setIsMuted(!isMuted)}
        className="p-4 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition-all shadow-xl group"
        title={isMuted ? "Включить звук" : "Выключить звук"}
      >
        {isMuted ? (
          <VolumeX className="w-6 h-6 opacity-50 group-hover:opacity-100" />
        ) : (
          <Volume2 className="w-6 h-6 text-cyan-400" />
        )}
      </button>
    </div>
  );
}
