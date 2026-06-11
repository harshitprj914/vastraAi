"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";


const TABS = ["All","Streetwear","Ethnic","Formal","Casual","Luxury","Seasonal"];

const FEED: { tag: string; image: string; title: string }[] = [
  { tag: "Streetwear", title: "Tokyo layered grunge", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80" },
  { tag: "Ethnic", title: "Banarasi modernism", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80" },
  { tag: "Formal", title: "Charcoal tailoring", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80" },
  { tag: "Casual", title: "Linen mornings", image: "https://images.unsplash.com/photo-1485518882345-15568b007407?w=800&q=80" },
  { tag: "Luxury", title: "Quiet luxury edit", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80" },
  { tag: "Seasonal", title: "Monsoon palette", image: "https://images.unsplash.com/photo-1514995669114-6081e934b693?w=800&q=80" },
  { tag: "Streetwear", title: "Off-duty oversized", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80" },
  { tag: "Luxury", title: "Slip dress, gold trim", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80" },
  { tag: "Ethnic", title: "Pastel kurta sets", image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80" },
  { tag: "Casual", title: "Beige denim duo", image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80" },
  { tag: "Formal", title: "Power blazer, soft tee", image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80" },
  { tag: "Seasonal", title: "Autumn knits", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80" },
];

function Trends() {
  const [tab, setTab] = useState("All");
  const list = tab === "All" ? FEED : FEED.filter(f => f.tag === tab);
  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-6 py-10 lg:py-12">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Editorial</p>
        <h1 className="font-display text-4xl md:text-5xl">Trends, in motion.</h1>
        <div className="mt-6 flex flex-wrap gap-2">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-full border text-sm ${tab === t ? "bg-foreground text-background border-foreground" : "hover:bg-secondary"}`}>{t}</button>
          ))}
        </div>
        <div className="mt-8 columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
          {list.map((f, i) => (
            <figure key={i} className="mb-4 break-inside-avoid rounded-2xl overflow-hidden border bg-card shadow-soft hover-lift">
              <img src={f.image} alt={f.title} className="w-full" loading="lazy" />
              <figcaption className="p-3 flex items-center justify-between text-sm">
                <span>{f.title}</span><span className="text-xs text-muted-foreground">{f.tag}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

export default Trends;
