import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import { Share2, RefreshCw } from "lucide-react";

const questions = [
  {
    id: 1,
    text: "В вашем племени/IT-компании раздор. Вы пойдете на переговоры или решите вопрос силой авторитета?",
    options: [
      { text: "Пойду на переговоры", score: { biy: 2, tech: 0 } },
      { text: "Решу силой авторитета", score: { biy: 0, tech: 2 } }
    ]
  },
  {
    id: 2,
    text: "Нужно внедрить новую технологию, но старейшины/совет директоров против. Ваши действия?",
    options: [
      { text: "Убедить их через традиции и уважение", score: { biy: 2, tech: 0 } },
      { text: "Внедрить пилотный проект и показать цифры", score: { biy: 0, tech: 2 } }
    ]
  },
  {
    id: 3,
    text: "Как вы оцениваете успех?",
    options: [
      { text: "По гармонии и благополучию людей", score: { biy: 2, tech: 0 } },
      { text: "По KPI и скорости роста", score: { biy: 0, tech: 2 } }
    ]
  }
];

export function Quest() {
  const { t } = useTranslation();
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState({ biy: 0, tech: 0 });
  const [finished, setFinished] = useState(false);

  const handleAnswer = (score: { biy: number, tech: number }) => {
    setScores(prev => ({ biy: prev.biy + score.biy, tech: prev.tech + score.tech }));
    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1);
    } else {
      setFinished(true);
    }
  };

  const reset = () => {
    setStarted(false);
    setCurrentQ(0);
    setScores({ biy: 0, tech: 0 });
    setFinished(false);
  };

  const getResult = () => {
    if (scores.biy > scores.tech) return { title: "Бий (Мудрец)", desc: "Вы опираетесь на опыт, эмпатию и умение находить компромиссы. Ваш стиль — объединять людей.", type: 'past' };
    return { title: "Технократ-новатор", desc: "Вы смотрите в будущее, опираетесь на данные и не боитесь ломать устаревшие системы.", type: 'future' };
  };

  return (
    <section className="min-h-screen py-24 bg-[#0A0F1C] relative flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#2C1E16] to-[#0A0F1C] opacity-50" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay" />

      <div className="relative z-10 w-full max-w-3xl mx-auto px-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl text-center">
          
          <AnimatePresence mode="wait">
            {!started && !finished && (
              <motion.div
                key="start"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D2B48C] to-cyan-400">
                  {t('quest.title')}
                </h2>
                <p className="text-gray-300 text-lg max-w-xl mx-auto">
                  Узнайте, какой стиль лидерства вам ближе: мудрость предков или инновации будущего.
                </p>
                <button 
                  onClick={() => setStarted(true)}
                  className="px-8 py-4 bg-gradient-to-r from-[#8B5A2B] to-cyan-600 text-white rounded-full font-semibold text-lg hover:scale-105 transition-transform shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                >
                  {t('quest.start')}
                </button>
              </motion.div>
            )}

            {started && !finished && (
              <motion.div
                key="question"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-10"
              >
                <div className="flex justify-between items-center text-sm text-gray-400 mb-8">
                  <span>Вопрос {currentQ + 1} из {questions.length}</span>
                  <div className="flex gap-1">
                    {questions.map((_, i) => (
                      <div key={i} className={`h-1 w-8 rounded-full ${i <= currentQ ? 'bg-cyan-400' : 'bg-gray-700'}`} />
                    ))}
                  </div>
                </div>

                <h3 className="text-2xl md:text-3xl text-white font-medium leading-relaxed">
                  {questions[currentQ].text}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {questions[currentQ].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(opt.score)}
                      className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-left transition-all hover:border-cyan-400/50 group"
                    >
                      <span className="text-gray-200 group-hover:text-white text-lg">{opt.text}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {finished && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                <div className={`inline-block p-1 rounded-3xl bg-gradient-to-br ${getResult().type === 'past' ? 'from-[#8B5A2B] to-[#D2B48C]' : 'from-cyan-400 to-blue-600'}`}>
                  <div className="bg-[#0A0F1C] rounded-[22px] p-8 md:p-12">
                    <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-4">Ваш архетип</h3>
                    <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${getResult().type === 'past' ? 'text-[#D2B48C] font-serif' : 'text-cyan-400 font-sans'}`}>
                      {getResult().title}
                    </h2>
                    <p className="text-gray-300 text-lg max-w-md mx-auto leading-relaxed">
                      {getResult().desc}
                    </p>
                  </div>
                </div>

                <div className="flex justify-center gap-4 pt-8">
                  <button 
                    onClick={reset}
                    className="p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10"
                    title="Пройти заново"
                  >
                    <RefreshCw className="w-6 h-6" />
                  </button>
                  <button className="flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors">
                    <Share2 className="w-5 h-5" />
                    Поделиться
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </section>
  );
}
