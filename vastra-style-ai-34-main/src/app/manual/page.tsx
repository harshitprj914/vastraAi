"use client";

import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


type Profile = Record<string, string>;
const STEPS: { title: string; fields: { key: string; label: string; type?: string; options?: string[] }[] }[] = [
 { title: "About you", fields: [
  { key: "gender", label: "Gender", options: ["Women","Men","Unisex"] },
]},

  { title: "Body & tone", fields: [
    { key: "bodyType", label: "Body type", options: ["Slim","Athletic","Average","Plus Size"] },
  ]},

  { title: "Style", fields: [
    { key: "style", label: "Style", options: ["Casual","Formal","Streetwear","Ethnic","Minimalist","Luxury"] },
    { key: "occasion", label: "Occasion", options: ["Daily Wear","Office","Party","Wedding","Travel","Festive"] },
  ]},

  { title: "Context", fields: [
    { key: "season", label: "Season", options: ["Summer","Monsoon","Winter"] },
    { key: "budget", label: "Budget", options: ["Under ₹1500","₹1500-3000","₹3000-6000","₹6000+"] },
  ]},
];

const SS_KEY = "vastra:onboarding";
const SS_STEP = "vastra:onboarding-step";

function Manual() {
  const nav = useRouter();
  // Always initialize with stable empty defaults to avoid SSR hydration
  // mismatches and controlled/uncontrolled warnings. Hydrate from storage
  // in an effect after mount.+
  const [profile, setProfile] = useState<Profile>({});
  const [step, setStep] = useState<number>(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const ss = sessionStorage.getItem(SS_KEY);
      if (ss) setProfile(JSON.parse(ss));
      else {
        const ls = localStorage.getItem("vastra:profile");
        if (ls) setProfile(JSON.parse(ls));
      }
      const s = sessionStorage.getItem(SS_STEP);
      if (s) setStep(Math.min(STEPS.length - 1, Math.max(0, parseInt(s, 10) || 0)));
    } catch {}
    setHydrated(true);
  }, []);

  // Auto-save on every change (only after hydration to avoid clobbering storage)
  useEffect(() => {
    if (!hydrated) return;
    try { sessionStorage.setItem(SS_KEY, JSON.stringify(profile)); } catch {}
  }, [profile, hydrated]);
  useEffect(() => {
    if (!hydrated) return;
    try { sessionStorage.setItem(SS_STEP, String(step)); } catch {}
  }, [step, hydrated]);

  const cur = STEPS[step];
  const isLast = step === STEPS.length - 1;

  function set(k: string, v: string) { setProfile(p => ({ ...p, [k]: v })); }
  function next() {
  if (isLast) {
    localStorage.setItem("vastra:profile", JSON.stringify(profile));

    localStorage.removeItem("vastra:scan-result");
    sessionStorage.removeItem("vastra:scan");

    sessionStorage.removeItem(SS_KEY);
    sessionStorage.removeItem(SS_STEP);

    nav.push("/analyzing");
  } else {
    setStep(step + 1);
  }
}

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-6 py-10 lg:py-16">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Step {String(step + 2).padStart(2, "0")}</p>
        <h1 className="font-display text-4xl md:text-5xl">{cur.title}</h1>

        <div className="mt-6 mb-10 flex items-center gap-2">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= step ? "bg-foreground" : "bg-border"}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .25 }}
            className="grid sm:grid-cols-2 gap-5">
            {cur.fields.map(f => (
              <div key={f.key} className={f.options && f.options.length > 4 ? "sm:col-span-2" : ""}>
                <Label className="mb-2 block">{f.label}</Label>
                {f.options ? (
                  <div className="flex flex-wrap gap-2">
                    {f.options.map(opt => (
                      <button key={opt} type="button" onClick={() => set(f.key, opt)}
                        className={`px-4 py-2 rounded-full border text-sm transition ${profile[f.key] === opt ? "bg-foreground text-background border-foreground" : "hover:bg-secondary"}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : (
                  <Input type={f.type ?? "text"} value={profile[f.key] ?? ""} onChange={e => set(f.key, e.target.value)} className="h-11 rounded-xl" />
                )}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 flex items-center justify-between">
          <Button variant="ghost" disabled={step === 0} onClick={() => setStep(step - 1)}><ArrowLeft className="w-4 h-4 mr-2" />Back</Button>
          <Button onClick={next} className="rounded-full bg-foreground text-background h-11 px-7 hover:opacity-90">
            {isLast ? "Analyze my style" : "Continue"} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </AppShell>
  );
}

export default Manual;