import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import { Share2, RefreshCw, ChevronRight } from "lucide-react";

interface Question {
  id: number;
  kk: string;
  ru: string;
  options: { kk: string; ru: string; score: Record<string, number> }[];
}

const questions: Question[] = [
  {
    id: 1,
    kk: "Сіздің тайпаңызда/IT-компанияңызда алауыздық туындады. Не істейсіз?",
    ru: "В вашем коллективе конфликт. Как вы действуете?",
    options: [
      { kk: "Барлығын бір дастарханға жинап, бітімге келемін", ru: "Собираю всех за одним столом и ищу компромисс", score: { biy: 2 } },
      { kk: "Беделіммен шешемін — бас иілмегенді жеңдім", ru: "Решаю авторитетом — кто не согласен, уходит", score: { batyr: 2 } },
      { kk: "Жаңа ережелер мен процестерді енгіземін", ru: "Внедряю новые правила и процессы", score: { tech: 2 } },
      { kk: "Оқу бағдарламасы мен семинарлар ұйымдастырамын", ru: "Организую обучение и воркшопы для роста команды", score: { aghar: 2 } },
    ]
  },
  {
    id: 2,
    kk: "Жаңа технологияны енгізу керек, бірақ кеңес мүшелері қарсы. Не істейсіз?",
    ru: "Нужно внедрить инновацию, но совет против. Ваши действия?",
    options: [
      { kk: "Ата-баба дәстүрін мысалға келтіріп, оларды сендіремін", ru: "Убеждаю, апеллируя к проверенному опыту и традициям", score: { biy: 2 } },
      { kk: "Шешімді өзім қабылдап, жауапкершілікті өз мойныма аламын", ru: "Принимаю решение сам и беру ответственность на себя", score: { batyr: 2 } },
      { kk: "Пилоттық жоба жасап, нәтижелерді цифрмен дәлелдеймін", ru: "Запускаю пилот и доказываю результатами, данными", score: { tech: 2 } },
      { kk: "Командамды оқытып, олар арқылы кеңесті сендіремін", ru: "Обучаю команду, и через них меняю мнение совета", score: { aghar: 2 } },
    ]
  },
  {
    id: 3,
    kk: "Табысты қалай өлшейсіз?",
    ru: "Как вы измеряете успех?",
    options: [
      { kk: "Адамдардың бақыты мен ынтымағы", ru: "Гармония и счастье людей вокруг", score: { biy: 2 } },
      { kk: "Мақсатқа жетіп, жаумен тайталасқан соң", ru: "Достижение цели несмотря на препятствия и врагов", score: { batyr: 2 } },
      { kk: "KPI, өсу жылдамдығы, нарық үлесі", ru: "KPI, скорость роста, доля рынка", score: { tech: 2 } },
      { kk: "Менен кейін қалған білімді адамдар саны", ru: "Количество людей, которых ты обучил и вдохновил", score: { aghar: 2 } },
    ]
  },
  {
    id: 4,
    kk: "Сіздің ең күшті қасиетіңіз не?",
    ru: "Ваша самая сильная черта?",
    options: [
      { kk: "Даналық пен адамдарды тыңдай білу", ru: "Мудрость и умение слышать людей", score: { biy: 2 } },
      { kk: "Батылдық пен табандылық", ru: "Смелость и несгибаемая воля", score: { batyr: 2 } },
      { kk: "Аналитикалық ойлау мен жүйелілік", ru: "Аналитическое мышление и системный подход", score: { tech: 2 } },
      { kk: "Адамдарды оқытып, жандандыра білу", ru: "Способность учить и вдохновлять других", score: { aghar: 2 } },
    ]
  },
  {
    id: 5,
    kk: "Дағдарыс кезінде алдымен не жасайсыз?",
    ru: "В кризисной ситуации ваш первый шаг?",
    options: [
      { kk: "Барлық тараптарды тыңдап, бірге шешім іздеймін", ru: "Выслушиваю все стороны, ищем решение вместе", score: { biy: 2 } },
      { kk: "Жылдам іс-қимыл жасаймын — кідіру жеңілісті білдіреді", ru: "Действую быстро — медлить значит проигрывать", score: { batyr: 2 } },
      { kk: "Мәліметтерді жинап, алгоритм бойынша шешемін", ru: "Собираю данные, анализирую и действую по алгоритму", score: { tech: 2 } },
      { kk: "Командамды оқытып, олардың потенциалын ашамын", ru: "Обучаю команду работать автономно в кризис", score: { aghar: 2 } },
    ]
  },
  {
    id: 6,
    kk: "Тарихта сізге ең жақын тұлға кім?",
    ru: "Кто из исторических деятелей вам ближе всего?",
    options: [
      { kk: "Төле би — дала данышпаны мен бітімгер", ru: "Толе би — мудрец и миротворец степи", score: { biy: 3 } },
      { kk: "Кенесары хан — ел бостандығы үшін жаны пида", ru: "Кенесары хан — герой, отдавший жизнь за свободу народа", score: { batyr: 3 } },
      { kk: "Нұрсұлтан Назарбаев — мемлекет аңшысы", ru: "Нурсултан Назарбаев — архитектор государственности", score: { tech: 3 } },
      { kk: "Абай Құнанбайұлы — ойшыл және ағартушы", ru: "Абай Кунанбаев — мыслитель и просветитель народа", score: { aghar: 3 } },
    ]
  },
  {
    id: 7,
    kk: "Жаңа жобаны бастаған кезде алдымен не жасайсыз?",
    ru: "Начиная новый проект, что делаете в первую очередь?",
    options: [
      { kk: "Ақсақалдардың/тәжірибелілердің кеңесін сұраймын", ru: "Советуюсь с опытными наставниками", score: { biy: 2 } },
      { kk: "Мақсатты айқындап, команданы шайқасқа шақырамын", ru: "Ставлю цель и поднимаю команду в атаку", score: { batyr: 2 } },
      { kk: "Зерттеу жүргізіп, жол картасын құрамын", ru: "Провожу исследование и составляю дорожную карту", score: { tech: 2 } },
      { kk: "Командаға не білу керектігін үйретіп, дайындаймын", ru: "Обучаю и готовлю команду к выполнению задачи", score: { aghar: 2 } },
    ]
  },
  {
    id: 8,
    kk: "Сіздің өмірлік ұстанымыңыз қандай?",
    ru: "Ваш жизненный принцип?",
    options: [
      { kk: "«Бір ауыз сөз мыңды жығар» — сөз — ең күшті қару", ru: "«Слово сильнее тысячи мечей» — дипломатия прежде всего", score: { biy: 2 } },
      { kk: "«Жер үшін, ел үшін» — бастыны байлауға болмайды", ru: "«За землю, за народ» — свободу не отдают", score: { batyr: 2 } },
      { kk: "«Деректер жалған айтпайды» — сан грамнан артық", ru: "«Данные не лгут» — цифры важнее мнений", score: { tech: 2 } },
      { kk: "«Бір шәкірт мыңға тең» — білімді тарату — басты мақсат", ru: "«Один ученик стоит тысячи» — знание важнее власти", score: { aghar: 2 } },
    ]
  },
  {
    id: 9,
    kk: "Команданы ынталандыру үшін не жасайсыз?",
    ru: "Как вы мотивируете свою команду?",
    options: [
      { kk: "Бірлік пен ортақ мақсат туралы сөйлеймін", ru: "Говорю о единстве и общей миссии", score: { biy: 2 } },
      { kk: "Өз мысалыммен, алдыңнан жүрумен шабыттандырамын", ru: "Вдохновляю личным примером, иду впереди", score: { batyr: 2 } },
      { kk: "Бонустар, KPI, өсу жолдарын ұсынамын", ru: "Предлагаю бонусы, KPI и чёткие пути роста", score: { tech: 2 } },
      { kk: "Жаңа дағдылар мен мүмкіндіктер беремін", ru: "Даю новые навыки и возможности для развития", score: { aghar: 2 } },
    ]
  },
  {
    id: 10,
    kk: "Сіз үшін лидерлік дегеніміз не?",
    ru: "Что для вас означает лидерство?",
    options: [
      { kk: "Халықтың даусын есіту және бірлік сақтау", ru: "Слышать людей и сохранять единство", score: { biy: 3 } },
      { kk: "Кедергілерді жеңіп, жеңіске жету", ru: "Преодолевать препятствия и побеждать", score: { batyr: 3 } },
      { kk: "Болашақты жоспарлап, жүйені оңтайландыру", ru: "Планировать будущее и оптимизировать систему", score: { tech: 3 } },
      { kk: "Келесі ұрпаққа білім мен рух беру", ru: "Передавать знания и дух следующему поколению", score: { aghar: 3 } },
    ]
  }
];

const archetypes = {
  biy: {
    kk: { title: "Би — Дала Данышпаны", desc: "Сіз даналыққа, эмпатия мен бітімгершілікке сүйенесіз. Дауларды сөзбен шешіп, халықты ынтымақтастыруды мақсат тұтасыз. Төле, Қазыбек, Әйтеке билердің ізбасарысыз." },
    ru: { title: "Бий — Мудрец Степи", desc: "Вы опираетесь на мудрость, эмпатию и умение находить компромиссы. Решаете споры словом и стремитесь объединять людей. Вы — наследник Толе, Казыбек и Айтеке биев." },
    gradient: "from-amber-700 to-yellow-500", color: "text-yellow-400"
  },
  batyr: {
    kk: { title: "Батыр — Рух Пен Ерлік", desc: "Сіз батылдықпен, табандылықпен және ел алдындағы жауапкершілікпен ерекшеленесіз. Кенесары хан, Қабанбай батырдың рухын жалғастырасыз." },
    ru: { title: "Батыр — Дух и Доблесть", desc: "Вы отличаетесь смелостью, несгибаемой волей и ответственностью перед народом. Вы продолжаете дух Кенесары хана и батыра Кабанбая." },
    gradient: "from-red-800 to-orange-500", color: "text-orange-400"
  },
  aghar: {
    kk: { title: "Ағартушы — Білім Шамшырағы", desc: "Сіздің күшіңіз — білімде. Адамдарды оқытып, олардың санасын ашу арқылы қоғамды өзгертесіз. Абай мен Ыбырайдың жолымен жүресіз." },
    ru: { title: "Просветитель — Светоч Знания", desc: "Ваша сила — в знании. Вы меняете общество через образование и пробуждение сознания. Вы идёте путём Абая Кунанбаева и Ибрая Алтынсарина." },
    gradient: "from-emerald-700 to-teal-400", color: "text-teal-300"
  },
  tech: {
    kk: { title: "Технократ-Инноватор", desc: "Сіз болашаққа бағдарланасыз: деректерге, жүйелерге және новацияға сүйенесіз. Ескі жүйелерді сындырып, жаңасын құрудан қорықпайсыз." },
    ru: { title: "Технократ-Инноватор", desc: "Вы ориентированы на будущее: опираетесь на данные, системы и инновации. Не боитесь ломать устаревшие системы и строить новые." },
    gradient: "from-cyan-700 to-blue-500", color: "text-cyan-300"
  }
};

export function Quest() {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'kk' ? 'kk' : 'ru';

  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({ biy: 0, batyr: 0, aghar: 0, tech: 0 });
  const [finished, setFinished] = useState(false);

  const handleAnswer = (score: Record<string, number>) => {
    setScores(prev => {
      const next = { ...prev };
      for (const key in score) next[key] = (next[key] || 0) + score[key];
      return next;
    });
    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1);
    } else {
      setFinished(true);
    }
  };

  const reset = () => {
    setStarted(false);
    setCurrentQ(0);
    setScores({ biy: 0, batyr: 0, aghar: 0, tech: 0 });
    setFinished(false);
  };

  const getResult = () => {
    const top = Object.entries(scores).reduce((a, b) => (b[1] > a[1] ? b : a));
    return archetypes[top[0] as keyof typeof archetypes];
  };

  const progress = ((currentQ) / questions.length) * 100;

  const titles = { kk: "Көшбасшы жолы", ru: "Путь Лидера" };
  const subtitles = {
    kk: "Hanды архетипті аша: дала данышпаны ма, батыр ма, ағартушы ма, әлде инноватор ма?",
    ru: "Узнайте свой архетип: мудрец, воин, просветитель или инноватор?"
  };
  const startLabels = { kk: "Тестті бастау", ru: "Начать тест" };
  const questionOf = { kk: `Сұрақ ${currentQ + 1} / ${questions.length}`, ru: `Вопрос ${currentQ + 1} из ${questions.length}` };
  const archetypeLabel = { kk: "Сіздің архетипіңіз", ru: "Ваш архетип" };
  const restartLabel = { kk: "Қайталау", ru: "Пройти заново" };
  const shareLabel = { kk: "Бөлісу", ru: "Поделиться" };

  const result = getResult();

  return (
    <section className="min-h-screen py-24 bg-[#0A0F1C] relative flex items-center justify-center overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#2C1E16]/50 to-[#0A0F1C] opacity-60" />
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
                  {titles[lang]}
                </h2>
                <p className="text-gray-300 text-lg max-w-xl mx-auto leading-relaxed">
                  {subtitles[lang]}
                </p>
                <div className="flex justify-center gap-4 flex-wrap text-sm text-gray-500">
                  <span className="px-3 py-1 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">🧠 Би</span>
                  <span className="px-3 py-1 rounded-full bg-orange-400/10 text-orange-400 border border-orange-400/20">⚔️ Батыр</span>
                  <span className="px-3 py-1 rounded-full bg-teal-400/10 text-teal-400 border border-teal-400/20">📚 Ағартушы</span>
                  <span className="px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">🚀 Технократ</span>
                </div>
                <button
                  onClick={() => setStarted(true)}
                  className="px-8 py-4 bg-gradient-to-r from-[#8B5A2B] to-cyan-600 text-white rounded-full font-semibold text-lg hover:scale-105 transition-transform shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                >
                  {startLabels[lang]}
                </button>
              </motion.div>
            )}

            {started && !finished && (
              <motion.div
                key={`question-${currentQ}`}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Progress */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <span>{questionOf[lang]}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#8B5A2B] to-cyan-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>

                <h3 className="text-2xl md:text-3xl text-white font-medium leading-relaxed min-h-[80px]">
                  {questions[currentQ][lang]}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  {questions[currentQ].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(opt.score)}
                      className="p-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyan-400/50 transition-all group flex items-start gap-3"
                    >
                      <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-white/10 text-xs flex items-center justify-center text-gray-400 group-hover:bg-cyan-400/20 group-hover:text-cyan-300 transition-colors font-mono">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-gray-200 group-hover:text-white text-base leading-snug">{opt[lang]}</span>
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
                <div className={`inline-block p-[2px] rounded-3xl bg-gradient-to-br ${result[lang] ? result.gradient : 'from-cyan-400 to-blue-600'}`}>
                  <div className="bg-[#0A0F1C] rounded-[22px] px-8 py-10 md:px-12 space-y-4">
                    <h3 className="text-xs uppercase tracking-[0.3em] text-gray-500">{archetypeLabel[lang]}</h3>
                    <h2 className={`text-4xl md:text-5xl font-bold ${result.color} font-serif`}>
                      {result[lang].title}
                    </h2>
                    <p className="text-gray-300 text-lg max-w-md mx-auto leading-relaxed">
                      {result[lang].desc}
                    </p>
                  </div>
                </div>

                {/* Score breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  {[
                    { key: 'biy', label: 'Би', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
                    { key: 'batyr', label: 'Батыр', color: 'text-orange-400', bg: 'bg-orange-400/10' },
                    { key: 'aghar', label: lang === 'kk' ? 'Ағартушы' : 'Просветитель', color: 'text-teal-400', bg: 'bg-teal-400/10' },
                    { key: 'tech', label: lang === 'kk' ? 'Технократ' : 'Технократ', color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
                  ].map(({ key, label, color, bg }) => (
                    <div key={key} className={`rounded-2xl ${bg} p-3 border border-white/5`}>
                      <div className={`text-2xl font-bold ${color}`}>{scores[key]}</div>
                      <div className="text-gray-400">{label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center gap-4 pt-2">
                  <button
                    onClick={reset}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10"
                    title={restartLabel[lang]}
                  >
                    <RefreshCw className="w-5 h-5" />
                    <span>{restartLabel[lang]}</span>
                  </button>
                  <button className="flex items-center gap-2 px-8 py-3 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors">
                    <Share2 className="w-5 h-5" />
                    {shareLabel[lang]}
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
