import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

interface LandingViewProps {
  onStart: () => void;
}

export function LandingView({ onStart }: LandingViewProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#0A0F1C]">
      {/* Background Video/Image Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#8B5A2B]/40 to-cyan-900/40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-transparent to-transparent" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D2B48C] via-white to-cyan-400 mb-6 drop-shadow-2xl">
            {t('landing.title')}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="space-y-8"
        >
          <p className="text-lg md:text-2xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
            {t('landing.subtitle')}
          </p>
          <div className="bg-black/30 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl max-w-3xl mx-auto">
            <p className="text-md md:text-2xl text-[#D2B48C] font-serif italic leading-relaxed border-l-4 border-[#8B5A2B] pl-6 text-left">
              {t('landing.powerQuote')}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12"
        >
          <button
            onClick={onStart}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#8B5A2B] to-cyan-700 rounded-full text-white font-semibold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(6,182,212,0.4)]"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
            <span className="relative z-10">{t('landing.startBtn')}</span>
            <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Footer Info inside main container to avoid overlap */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-12 pt-8 border-t border-white/5"
        >
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <p className="text-[10px] md:text-xs text-white/30 uppercase tracking-widest max-w-2xl font-light leading-relaxed">
              {t('landing.footer.school')}
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[9px] md:text-xs text-[#D2B48C]/40 uppercase tracking-widest">
              <span>{t('landing.footer.section')}</span>
              <span>{t('landing.footer.subject')}</span>
              <span className="text-white/40">{t('landing.footer.author')}</span>
              <span className="text-white/40">{t('landing.footer.mentor')}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
