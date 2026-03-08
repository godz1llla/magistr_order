import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Send, Loader2 } from "lucide-react";
import { motion } from "motion/react";

export function AIChat() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<{ role: "user" | "sage"; content: string }[]>([]);
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

    // Сверхнадежная очистка ключа (убирает пробелы, кавычки и скрытые символы)
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY?.replace(/['"\s]/g, "").trim();

    if (!apiKey) {
      setMessages(prev => [...prev, { role: "sage", content: "Қате: API кілті табылмады. (Ошибка: API ключ не найден в настройках Vercel)" }]);
      return;
    }

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);

      // ИСПОЛЬЗУЕМ МАКСИМАЛЬНО ПРОСТУЮ ИНИЦИАЛИЗАЦИЮ
      // Убираем принудительное "v1" или "v1beta", пусть SDK решит само
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const systemPrompt = t('chat.systemPrompt') || "Сен — қазақтың дана жырауысың. Даналықпен жауап бер.";

      // Вместо startChat используем простой generateContent (он надежнее при плохом соединении)
      const chatContext = messages.map(m =>
        `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`
      ).join("\n");

      const finalPrompt = `${systemPrompt}\n\nКонтекст беседы:\n${chatContext}\n\nUser: ${userMsg}\nAssistant:`;

      const result = await model.generateContent(finalPrompt);
      const text = result.response.text();

      if (text) {
        setMessages(prev => [...prev, { role: "sage", content: text }]);
      }
    } catch (error: any) {
      console.error("Critical Gemini Error:", error);

      // ПОПЫТКА №2: Если первая модель упала, пробуем gemini-pro (классическая стабильная)
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const fallbackModel = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await fallbackModel.generateContent(userMsg);
        const text = result.response.text();
        if (text) {
          setMessages(prev => [...prev, { role: "sage", content: text }]);
          setIsLoading(false);
          return;
        }
      } catch (e) {
        console.error("Fallback also failed:", e);
      }

      setMessages(prev => [
        ...prev,
        { role: "sage", content: "Кешіріңіз, ақылман қазір терең ойда (404/Connection Error). Тағы да көріңіз." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-[70vh] py-16 bg-[#2C1E16] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-[#F5DEB3] rounded-3xl shadow-2xl border-4 border-[#8B5A2B] flex flex-col h-[600px] overflow-hidden">
        <div className="bg-[#8B5A2B] text-[#F5DEB3] p-5 text-center font-serif text-2xl shadow-md">
          {t('chat.title') || "Ақылманмен сұхбат"}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/parchment.png')]">
          {messages.map((m, i) => (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={i}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-2xl max-w-[85%] font-serif ${m.role === 'user' ? 'bg-[#8B5A2B] text-white rounded-br-none' : 'bg-[#E6C280] text-black rounded-bl-none shadow-md'
                }`}>
                {m.content}
              </div>
            </motion.div>
          ))}
          {isLoading && <div className="text-[#8B5A2B] animate-pulse italic">Ақылман толғануда...</div>}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-[#E6C280] flex gap-2 border-t-2 border-[#8B5A2B]/20">
          <input className="flex-1 p-3 rounded-xl border-2 border-[#8B5A2B] bg-[#F5DEB3] outline-none"
            value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Сауалыңызды жолдаңыз..." />
          <button onClick={handleSend} disabled={isLoading}
            className="bg-[#8B5A2B] text-white p-3 rounded-xl hover:brightness-110 active:scale-95 disabled:opacity-50">
            <Send size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}