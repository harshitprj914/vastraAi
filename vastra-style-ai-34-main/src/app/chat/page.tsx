"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { sendChatMessage } from "@/lib/chat";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

const QUICK = [
  "Outfit for a Mumbai monsoon date night",
  "Office capsule wardrobe under ₹10,000",
  "Festive ethnic for a winter wedding",
  "Streetwear for tall slim build",
];

function Chat() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", content: "Hello, I'm your VastraAI stylist. Ask me anything — outfits, occasions, fabrics, palettes." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, busy]);

  async function ask(text?: string) {
    const content = (text ?? input).trim();
    if (!content || busy) return;
    setInput("");
    const next = [...msgs, { role: "user" as const, content }];
    setMsgs(next);
    setBusy(true);
    try {
      const profile = JSON.parse(localStorage.getItem("vastra:profile") ?? "{}");
      const { reply } = await sendChatMessage(next, profile);
      setMsgs(m => [...m, { role: "assistant", content: reply }]);
    } catch (e: any) {
      setMsgs(m => [...m, { role: "assistant", content: "Sorry, I couldn't reach the studio. Please try again." }]);
    } finally { setBusy(false); }
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-6 py-10 lg:py-12">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2 inline-flex items-center gap-2"><Sparkles className="w-3 h-3" /> Stylist chat</p>
        <h1 className="font-display text-4xl">Talk to your stylist.</h1>

        <div className="mt-8 rounded-3xl border bg-card overflow-hidden flex flex-col h-[68vh]">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {msgs.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl whitespace-pre-wrap leading-relaxed ${
                    m.role === "user"
                      ? "bg-foreground text-background"
                      : "bg-secondary"
                  }`}
                >
                  {m.role === "assistant" ? (
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  ) : (
                    m.content
                  )}
                </div>
              </motion.div>
            ))}
            {busy && <div className="text-sm text-muted-foreground">Stylist is composing…</div>}
            <div ref={endRef} />
          </div>

          <div className="p-4 border-t space-y-3">
            <div className="flex flex-wrap gap-2">
              {QUICK.map(q => (
                <button key={q} onClick={() => ask(q)} className="text-xs px-3 py-1.5 rounded-full border hover:bg-secondary">{q}</button>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && ask()}
                placeholder="What should I wear to…"
                className="flex-1 h-12 rounded-xl border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              <Button onClick={() => ask()} disabled={busy || !input.trim()} className="h-12 rounded-xl bg-foreground text-background hover:opacity-90"><Send className="w-4 h-4" /></Button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default Chat;
