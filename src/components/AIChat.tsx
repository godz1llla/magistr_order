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

    // Очистка ключа от лишних символов
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY?.replace(/['"\s]/g, "");

    if (!apiKey) {
      console.error("Ключ API не найден!");
      return;
    }

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);

      // ИСПОЛЬЗУЕМ v1 - это исправляет ошибку 404 (Not Found)
      const model = genAI.getGenerativeModel(
        { model: "gemini-1.5-flash" },
        { apiVersion: "v1" }
      );

      const systemPrompt = t('chat.systemPrompt') || "Сен — қазақтың дана жырауысың. Даналықпен жауап бер.";

      // Формируем историю. 
      // Важно: в v1/v1beta история должна строго чередоваться user-model
      const chat = model.startChat({
        history: messages.map(m => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.content }],
        })),
      });

      // Если это первый вопрос, склеиваем его с системной ролью
      const fullPrompt = messages.length === 0
        ? `${systemPrompt}\n\nСұрақ: ${userMsg}`
        : userMsg;

      const result = await chat.sendMessage(fullPrompt);
      const text = result.response.text();

      if (text) {
        setMessages(prev => [...prev, { role: "sage", content: text }]);
      }
    } catch (error: any) {
      console.error("Ошибка ИИ:", error);
      setMessages(prev => [
        ...prev,
        { role: "sage", content: "Кешіріңіз, ақылман қазір ой үстінде (Ошибка доступа)." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-[80vh] py-12 bg-[#2C1E16] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-[#F5DEB3] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-[#8B5A2B] overflow-hidden flex flex-col h-[650px]">
        {/* Заголовок */}
        <div className="bg-[#8B5A2B] text-[#F5DEB3] p-5 text-center font-serif text-2xl border-b-4 border-[#5C3A21] shadow-lg">
          {t('chat.title') || "Ақылманмен сұхбат"}
        </div>

        {/* Сообщения */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/parchment.png')] bg-[#F5DEB3]">
          {messages.length === 0 && (
            <div className="text-center text-[#8B5A2B]/50 font-serif italic py-20 text-xl">
              Сұрақ қойыңыз, шырағым...
            </div>
          )}

          {messages.map((m, i) => (
            <motion.div
              initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              key={i}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`p-5 rounded-2xl max-w-[85%] shadow-md whitespace-pre-wrap font-serif text-lg leading-relaxed ${m.role === 'user'
                  ? 'bg-[#8B5A2B] text-[#F5DEB3] rounded-br-none'
                  : 'bg-[#E6C280] text-[#3E2723] border border-[#8B5A2B]/20 rounded-bl-none shadow-[inner_0_2px_4px_rgba(0,0,0,0.1)]'
                }`}>
                {m.content}
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 text-[#8B5A2B] font-serif italic px-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-lg">Жырау толғануда...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Поле ввода */}
        <div className="p-4 bg-[#E6C280] border-t-2 border-[#8B5A2B]/30 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
          <div className="flex gap-3 bg-[#F5DEB3] p-2 rounded-2xl border-2 border-[#8B5A2B]/40 focus-within:border-[#8B5A2B] transition-colors">
            <input
              className="flex-1 p-3 bg-transparent outline-none text-[#3E2723] font-serif text-xl placeholder-[#8B5A2B]/40"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
              placeholder="Өз сауалыңызды жолдаңыз..."
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-[#8B5A2B] text-[#F5DEB3] p-4 rounded-xl hover:bg-[#5C3A21] active:scale-95 transition-all shadow-md disabled:opacity-50"
            >
              <Send size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}