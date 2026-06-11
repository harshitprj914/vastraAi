"use client";

import Link from "next/link";

import { motion } from "framer-motion";
import { Camera, ListChecks, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";


function Mode() {
  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-6 py-12 lg:py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Step 01</p>
          <h1 className="font-display text-4xl md:text-5xl">How would you like to be styled?</h1>
          <p className="text-muted-foreground mt-3">Choose how VastraAI gets to know you.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            { to: "/scan", Icon: Camera, title: "AI Scan Mode", desc: "Upload your photo and let AI analyze your body type, posture and tone.", img: "https://images.unsplash.com/photo-1521336575822-6da63fb45455?w=900&q=80" },
            { to: "/manual", Icon: ListChecks, title: "Manual Preference Mode", desc: "Enter your preferences manually for fully tailored recommendations.", img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=900&q=80" },
          ].map(({ to, Icon, title, desc, img }, i) => (
            <motion.div key={to} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .1 }}>
              <Link href={to} className="group block rounded-3xl overflow-hidden border bg-card hover-lift">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />
                  <div className="absolute top-5 left-5 w-12 h-12 rounded-full glass flex items-center justify-center"><Icon className="w-5 h-5" /></div>
                </div>
                <div className="p-7">
                  <h2 className="font-display text-3xl mb-2">{title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium">Begin <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

export default Mode;