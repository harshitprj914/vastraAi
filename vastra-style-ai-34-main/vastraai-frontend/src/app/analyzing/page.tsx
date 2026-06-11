"use client";

import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";


const lines = [
  "Reading your silhouette…",
  "Mapping season & weather…",
  "Curating fabric palette…",
  "Sourcing premium picks…",
  "Composing your dashboard…",
];

function Analyzing() {
  const nav = useRouter();
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => Math.min(i + 1, lines.length - 1)), 700);
    const go = setTimeout(() => nav.push("/dashboard"), 4000);
    return () => { clearInterval(t); clearTimeout(go); };
  }, [nav]);

  return (
    <AppShell>
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="relative mx-auto w-32 h-32 mb-10">
            <motion.div className="absolute inset-0 rounded-full gradient-luxe" animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
            <motion.div className="absolute inset-3 rounded-full bg-background" />
            <motion.div className="absolute inset-6 rounded-full gradient-luxe opacity-50" animate={{ scale: [1, .8, 1] }} transition={{ duration: 2, repeat: Infinity }} />
          </div>
          <h1 className="font-display text-4xl mb-3">Analyzing your fashion profile…</h1>
          <motion.p key={idx} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-muted-foreground">
            {lines[idx]}
          </motion.p>
        </div>
      </div>
    </AppShell>
  );
}

export default Analyzing;