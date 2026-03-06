/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { LandingView } from "./components/LandingView";
import { ExploreView } from "./components/ExploreView";
import { AIChat } from "./components/AIChat";
import { Quest } from "./components/Quest";
import { AudioController } from "./components/AudioController";
import { useTranslation } from "react-i18next";
import "./i18n";

export default function App() {
  const { i18n } = useTranslation();
  const [view, setView] = useState<'landing' | 'explore'>('landing');

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'ru' ? 'kk' : 'ru');
  };

  return (
    <div className="font-sans bg-[#0A0F1C] text-white overflow-x-hidden selection:bg-cyan-500/30">
      {/* Language Switcher */}
      <div className="fixed top-8 right-8 z-50">
        <button 
          onClick={toggleLang}
          className="px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors uppercase tracking-wider shadow-xl"
        >
          {i18n.language === 'ru' ? 'ҚАЗ' : 'РУС'}
        </button>
      </div>

      <main>
        {view === 'landing' ? (
          <LandingView onStart={() => setView('explore')} />
        ) : (
          <>
            <ExploreView onBack={() => setView('landing')} />
            <AIChat />
            <Quest />
          </>
        )}
      </main>

      <AudioController />
    </div>
  );
}
