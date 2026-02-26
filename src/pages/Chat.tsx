import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { searchLegalQA, addChatEntry } from "@/lib/supabase-helpers";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Loader2, Database, Cpu, Scale } from "lucide-react";
import { toast } from "sonner";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  sourceType?: string;
  confidence?: number;
}

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "வணக்கம்! நான் NyayaVidya சட்ட உதவியாளர். உங்கள் சட்ட கேள்விகளைக் கேளுங்கள்.\n\nHello! I'm NyayaVidya Legal Assistant. Ask me about your legal rights in Tamil Nadu.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const question = input.trim();
    if (!question || !user) return;

    setInput("");
    setMessages(prev => [...prev, { role: "user", content: question }]);
    setLoading(true);

    try {
      const result = await searchLegalQA(question);

      let answer: string;
      let sourceType: string;
      let confidence: number;

      if (result && result.confidence > 30) {
        const qa = result.match;
        answer = `${qa.answer_tamil}\n\n📝 English: ${qa.answer_english}\n\n⚖️ This is for educational purposes only. Not legal advice. Call 15100 for official legal aid.`;
        sourceType = "database";
        confidence = result.confidence;
      } else {
        answer = "மன்னிக்கவும், இந்தக் கேள்விக்கு எனக்கு உறுதியான பதில் தெரியவில்லை. தயவுசெய்து 15100 எண்ணில் அழைத்து சட்ட உதவி பெறுங்கள்.\n\nSorry, I'm not certain about this question. Please call 15100 for official legal aid.\n\n💡 Tip: Try asking about topics like fake job scams, wage theft, consumer fraud, cybercrime, or free legal aid.\n\n⚖️ This is for educational purposes only. Not legal advice.";
        sourceType = "fallback";
        confidence = 0;
      }

      setMessages(prev => [...prev, { role: "assistant", content: answer, sourceType, confidence }]);
      await addChatEntry(user.id, question, answer, sourceType, confidence);
    } catch {
      toast.error("Failed to process question");
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "போலி வேலை மோசடி என்றால் என்ன?",
    "How to get free legal aid?",
    "Consumer fraud complaint",
    "Cybercrime report",
    "Workplace harassment",
  ];

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl h-[calc(100vh-10rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-xl hero-gradient flex items-center justify-center">
          <Scale className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold">Legal Chat Assistant</h1>
          <p className="text-xs text-muted-foreground">சட்ட அரட்டை உதவியாளர் • Tamil & English</p>
        </div>
      </div>

      {/* Messages */}
      <Card className="flex-1 overflow-hidden border-border/50 card-shadow">
        <CardContent className="p-4 h-full overflow-y-auto space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""} animate-fade-in`}>
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                msg.role === "user" ? "bg-primary/10" : "hero-gradient"
              }`}>
                {msg.role === "user" ? <User className="h-4 w-4 text-primary" /> : <Bot className="h-4 w-4 text-primary-foreground" />}
              </div>
              <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.sourceType && (
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/30 text-xs opacity-70">
                    {msg.sourceType === "database" ? <Database className="h-3 w-3" /> : <Cpu className="h-3 w-3" />}
                    <span>Source: {msg.sourceType}</span>
                    {msg.confidence ? <span>• {Math.round(msg.confidence)}% confidence</span> : null}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 animate-fade-in">
              <div className="h-8 w-8 rounded-lg hero-gradient flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="bg-muted rounded-xl px-4 py-3">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </CardContent>
      </Card>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {suggestions.map(s => (
            <button
              key={s}
              onClick={() => { setInput(s); }}
              className="text-xs px-3 py-1.5 rounded-full bg-accent text-accent-foreground hover:bg-primary/10 hover:text-primary transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2 mt-3">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Ask a legal question... சட்ட கேள்வி கேளுங்கள்..."
          disabled={loading}
          className="flex-1"
          maxLength={500}
        />
        <Button onClick={handleSend} disabled={loading || !input.trim()} className="hero-gradient text-primary-foreground">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
