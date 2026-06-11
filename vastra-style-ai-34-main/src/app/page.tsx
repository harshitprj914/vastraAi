"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Wand2, Camera, Shirt } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function Landing() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    
    console.log("loading =", loading);
    console.log("user =", user);

    if (!loading && user) {

      console.log("REDIRECT TO MODE");
      router.replace("/mode");
    }
  }, [user, loading, router]);

  if (!loading && user) {
    return null;
  }

  return (
    //  EXISTING JSX 
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-30 glass border-b">
        <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full gradient-luxe" />
            <span className="font-display text-2xl tracking-wide">VastraAI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#how" className="hover:text-foreground">How it works</a>
            <a href="#editorial" className="hover:text-foreground">Editorial</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth?mode=login" className="text-sm hover:opacity-70">Login</Link>
            <Link href="/auth?mode=signup" className="text-sm rounded-full bg-foreground text-background px-5 py-2 hover:opacity-90">Sign up</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-24 lg:pt-44 lg:pb-32 px-6">
        <div className="absolute inset-0 -z-10 gradient-editorial" />
        <div className="absolute top-32 right-[-10%] w-[40rem] h-[40rem] rounded-full blur-3xl opacity-60 gradient-luxe" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs uppercase tracking-[0.2em] text-muted-foreground mb-8">
              <Sparkles className="w-3 h-3" /> Premium AI Stylist
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-balance">
              Your Personal <em className="italic">AI Fashion</em> Stylist
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
              Fashion tailored to your body, weather, and personality. Curated outfits, real product picks, and editorial intelligence — all in one elegant assistant.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/auth?mode=signup" className="group inline-flex items-center gap-2 rounded-full bg-foreground text-background px-7 py-3.5 text-sm font-medium hover:opacity-90 shadow-soft">
                Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/auth?mode=login" className="rounded-full border px-7 py-3.5 text-sm hover:bg-secondary">Login</Link>
              <Link href="/auth?mode=signup" className="rounded-full border px-7 py-3.5 text-sm hover:bg-secondary">Sign Up</Link>
            </div>
            <div className="mt-12 flex items-center gap-6 text-xs text-muted-foreground">
              <div><span className="block font-display text-2xl text-foreground">12k+</span>looks generated</div>
              <div className="w-px h-8 bg-border" />
              <div><span className="block font-display text-2xl text-foreground">4.9★</span>style rating</div>
              <div className="w-px h-8 bg-border" />
              <div><span className="block font-display text-2xl text-foreground">120+</span>occasions</div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: .15 }} className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80" alt="Editorial fashion" className="w-full aspect-[3/4] object-cover rounded-3xl shadow-elegant" />
                <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80" alt="Streetwear look" className="w-full aspect-square object-cover rounded-3xl shadow-soft" />
              </div>
              <div className="space-y-4 pt-12">
                <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80" alt="Minimal style" className="w-full aspect-square object-cover rounded-3xl shadow-soft" />
                <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80" alt="Premium outfit" className="w-full aspect-[3/4] object-cover rounded-3xl shadow-elegant" />
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 glass rounded-2xl px-5 py-3 shadow-soft hidden md:flex items-center gap-3">
              <div className="w-8 h-8 rounded-full gradient-luxe" />
              <div className="text-xs"><div className="font-medium">Today's pick</div><div className="text-muted-foreground">Linen co-ord · 22°C breeze</div></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-secondary/40">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-14">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">The studio</p>
            <h2 className="font-display text-4xl md:text-5xl">Where intuition meets intelligence.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { Icon: Camera, t: "AI Body Scan", d: "Upload a photo and let our model read your silhouette, posture and tone." },
              { Icon: Wand2, t: "Personal Preferences", d: "Tell us your city, season, occasion and budget — we tailor every pick." },
              { Icon: Shirt, t: "Curated Real Picks", d: "Live recommendations from premium fashion houses, refreshed daily." },
            ].map(({ Icon, t, d }) => (
              <div key={t} className="rounded-3xl bg-card p-8 hover-lift border">
                <Icon className="w-6 h-6 mb-6" />
                <h3 className="font-display text-2xl mb-2">{t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How */}
      <section id="how" className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&q=80" alt="Atelier" className="w-full aspect-[4/5] object-cover rounded-3xl shadow-elegant" />
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">The flow</p>
            <h2 className="font-display text-4xl md:text-5xl mb-10">Four refined steps to your wardrobe.</h2>
            <ol className="space-y-6">
              {["Sign in to your atelier","Choose AI scan or manual mode","Share your style profile","Receive a personal dashboard"].map((s,i) => (
                <li key={s} className="flex gap-4 items-start">
                  <span className="font-display text-3xl w-12 shrink-0 text-accent">{String(i+1).padStart(2,"0")}</span>
                  <div className="pt-2"><div className="font-medium">{s}</div></div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="editorial" className="py-24 px-6">
        <div className="max-w-5xl mx-auto rounded-3xl gradient-luxe p-12 md:p-20 text-center shadow-elegant">
          <h2 className="font-display text-4xl md:text-6xl text-balance">Style is personal.<br/>Make yours intelligent.</h2>
          <Link href="/auth?mode=signup" className="mt-10 inline-flex items-center gap-2 rounded-full bg-foreground text-background px-8 py-4 text-sm">
            Begin your atelier <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <footer className="py-10 px-6 border-t text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>© {new Date().getFullYear()} VastraAI · Couture intelligence</div>
          <div className="flex gap-6"><a href="#" className="hover:text-foreground">Privacy</a><a href="#" className="hover:text-foreground">Terms</a></div>
        </div>
      </footer>
    </div>
  );
}
