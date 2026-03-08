import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import OpenAI from "openai";
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

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setIsLoading(true);

    try {
      const client = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY || "",
        dangerouslyAllowBrowser: true,
      });

      // Build conversation history for context
      const history = messages.map(m => ({
        role: m.role === "user" ? "user" as const : "assistant" as const,
        content: m.content
      }));

      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: t('chat.systemPrompt') },
          ...history,
          { role: "user", content: userMsg },
        ],
        temperature: 0.7,
        max_tokens: 800,
      });

      const reply = response.choices[0]?.message?.content;
      if (reply) {
        setMessages(prev => [...prev, { role: "sage", content: reply }]);
      }
    } catch (error) {
      console.error("OpenAI error:", error);
      setMessages(prev => [
        ...prev,
        { role: "sage", content: "Кешіріңіз, қазір жауап бере алмаймын. (Ошибка связи с мудрецом)" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen py-24 bg-[#2C1E16] relative overflow-hidden flex items-center justify-center">
      {/* Scroll Texture */}
      <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4">
        <div className="bg-[#F5DEB3] rounded-3xl shadow-2xl overflow-hidden border-4 border-[#8B5A2B] flex flex-col h-[600px]">

          {/* Header */}
          <div className="bg-[#8B5A2B] text-[#F5DEB3] p-6 text-center border-b-4 border-[#5C3A21]">
            <h2 className="text-3xl font-serif">{t('chat.title')}</h2>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/parchment.png')]">
            {messages.length === 0 && (
              <div className="text-center text-[#5C3A21]/60 italic mt-20">
                {t('chat.placeholder')}...
              </div>
            )}

            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl whitespace-pre-wrap ${msg.role === 'user'
                      ? 'bg-[#5C3A21] text-[#F5DEB3] rounded-br-none'
                      : 'bg-[#E6C280] text-[#3E2723] rounded-bl-none border border-[#8B5A2B]/20 font-serif'
                    }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#E6C280] text-[#3E2723] p-4 rounded-2xl rounded-bl-none flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="font-serif italic">Мудрец думает...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-[#E6C280] border-t-2 border-[#8B5A2B]/30">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                placeholder={t('chat.placeholder')}
                className="flex-1 bg-[#F5DEB3] border-2 border-[#8B5A2B]/50 rounded-xl px-4 py-3 text-[#3E2723] placeholder:text-[#8B5A2B]/50 focus:outline-none focus:border-[#5C3A21] font-serif"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-[#8B5A2B] hover:bg-[#5C3A21] text-[#F5DEB3] px-6 py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                <span className="hidden sm:inline">{t('chat.send')}</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
