import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import OpenAI from "openai"; // Используем стандарт OpenAI для Groq
import { Send, Loader2 } from "lucide-react";
import { motion } from "motion/react";

export function AIChat() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Очистка ключа Groq
    const apiKey = import.meta.env.VITE_GROQ_API_KEY?.trim();

    if (!apiKey) {
      alert("Groq API key not found!");
      return;
    }

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setIsLoading(true);

    try {
      // Инициализируем клиент OpenAI, но направляем его на сервер Groq
      const groq = new OpenAI({
        apiKey: apiKey,
        baseURL: "https://api.groq.com/openai/v1", // Прокси на Groq
        dangerouslyAllowBrowser: true
      });

      const systemPrompt = t('chat.systemPrompt') || "Сен қазақтың дана жырауысың. Даналықпен жауап бер.";

      // Вызываем модель Llama 3 (одна из самых умных и бесплатных на Groq)
      const response = await groq.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
          { role: "user", content: userMsg }
        ],
        model: "llama-3.3-70b-versatile", // Мощная модель, которая понимает казахский
        temperature: 0.7,
        max_tokens: 1024,
      });

      const reply = response.choices[0]?.message?.content;

      if (reply) {
        setMessages(prev => [...prev, { role: "assistant", content: reply }]);
      }
    } catch (error: any) {
      console.error("Groq Error:", error);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Кешіріңіз, жырау абыз үнсіз қалды... (Ошибка Groq)" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen py-16 bg-[#2C1E16] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-[#F5DEB3] rounded-3xl border-4 border-[#8B5A2B] flex flex-col h-[600px] shadow-2xl overflow-hidden relative">
        <div className="bg-[#8B5A2B] text-[#F5DEB3] p-5 text-center font-serif text-2xl uppercase tracking-widest shadow-lg">
          {t('chat.title') || "Ақылманмен сұхбат (Groq Speed)"}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/parchment.png')]">
          {messages.length === 0 && (
            <div className="text-center text-[#8B5A2B]/40 py-20 italic font-serif text-xl">
              Ой-толғауыңызды ортаға салыңыз...
            </div>
          )}

          {messages.map((m, i) => (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-2xl max-w-[85%] font-serif text-lg leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-[#5C3A21] text-[#F5DEB3] rounded-br-none' : 'bg-[#E6C280] text-[#3E2723] rounded-bl-none border border-[#8B5A2B]/20'
                }`}>
                {m.content}
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 text-[#8B5A2B] font-serif italic animate-pulse">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Жырау жауап беруде...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-[#E6C280] flex gap-2 border-t-2 border-[#8B5A2B]/20">
          <input className="flex-1 p-3 rounded-xl border-2 border-[#8B5A2B]/30 bg-[#F5DEB3] outline-none text-[#3E2723] font-serif shadow-inner"
            value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
            placeholder="Сауал..." />
          <button onClick={handleSend} disabled={isLoading || !input.trim()}
            className="bg-[#8B5A2B] text-[#F5DEB3] p-3 rounded-xl hover:bg-[#5C3A21] transition-all disabled:opacity-50">
            <Send size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}