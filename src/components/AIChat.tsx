import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
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

    // Сверхнадежная очистка ключа (убираем всё лишнее)
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY?.replace(/['"\s]/g, "").trim();

    if (!apiKey) {
      alert("API KEY MISSING IN ENV");
      return;
    }

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setIsLoading(true);

    try {
      const systemPrompt = t('chat.systemPrompt') || "Ты — мудрый казахский жырау.";

      // ФОРМИРУЕМ ЗАПРОС НАПРЯМУЮ ЧЕРЕЗ FETCH (без библиотек)
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nСұрақ: ${userMsg}\nДаналықпен жауап бер:`
            }]
          }],
          generationConfig: {
            maxOutputTokens: 800,
            temperature: 0.8
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || `HTTP error ${response.status}`);
      }

      // Достаем текст ответа из структуры Google JSON
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (reply) {
        setMessages(prev => [...prev, { role: "sage", content: reply }]);
      } else {
        throw new Error("Пустой ответ от ИИ");
      }

    } catch (error: any) {
      console.error("Critical Chat Error:", error);

      // Понятное сообщение для пользователя
      let displayError = "Ақылман үнсіз қалды. ";
      if (error.message.includes("404")) displayError += "(Сервис недоступен или неверная модель)";
      if (error.message.includes("API_KEY_INVALID")) displayError += "(Ошибка ключа)";

      setMessages(prev => [
        ...prev,
        { role: "sage", content: displayError }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen py-16 bg-[#2C1E16] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-[#F5DEB3] rounded-3xl shadow-2xl border-4 border-[#8B5A2B] flex flex-col h-[650px] overflow-hidden">
        {/* Header */}
        <div className="bg-[#8B5A2B] text-[#F5DEB3] p-5 text-center font-serif text-2xl border-b-2 border-[#5C3A21]">
          {t('chat.title') || "Ақылман жыраумен сұхбат"}
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/parchment.png')]">
          {messages.length === 0 && (
            <div className="text-center text-[#8B5A2B]/40 py-20 italic text-xl font-serif">
              Ой-толғауыңызды ортаға салыңыз...
            </div>
          )}

          {messages.map((m, i) => (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={i}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-2xl max-w-[85%] font-serif text-lg leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-[#5C3A21] text-white rounded-br-none' : 'bg-[#E6C280] text-[#3E2723] rounded-bl-none border border-[#8B5A2B]/20'
                }`}>
                {m.content}
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 text-[#8B5A2B] font-serif animate-pulse">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Жырау абыз толғанып отыр...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Footer / Input */}
        <div className="p-4 bg-[#E6C280] flex gap-2 border-t-2 border-[#8B5A2B]/30">
          <input
            className="flex-1 p-3 rounded-xl border-2 border-[#8B5A2B]/30 bg-[#F5DEB3] focus:border-[#8B5A2B] outline-none text-[#3E2723] font-serif shadow-inner"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
            placeholder="Сауал жолдау..."
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-[#8B5A2B] text-[#F5DEB3] p-3 rounded-xl hover:bg-[#5C3A21] transition-all disabled:opacity-50"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}