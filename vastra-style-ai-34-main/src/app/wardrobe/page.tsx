"use client";

import { useRef, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";


type Item = { id: string; image: string; label: string };

function Wardrobe() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<Item[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem("vastra:wardrobe") ?? "[]"); } catch { return []; }
  });

  function persist(next: Item[]) { setItems(next); localStorage.setItem("vastra:wardrobe", JSON.stringify(next)); }

  function add(f: File) {
    const r = new FileReader();
    r.onload = () => persist([{ id: crypto.randomUUID(), image: r.result as string, label: f.name.split(".")[0] }, ...items]);
    r.readAsDataURL(f);
  }

  const combos = [
    { title: "Workwear capsule", desc: "Linen shirt + tailored trousers + loafers" },
    { title: "Weekend ease", desc: "Oversized tee + relaxed denim + white sneakers" },
    { title: "Date night", desc: "Silk slip dress + slim heel + minimal gold" },
    { title: "Festive evening", desc: "Embroidered kurta + churidar + juttis" },
  ];

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-6 py-10 lg:py-12 space-y-12">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Virtual wardrobe</p>
            <h1 className="font-display text-4xl md:text-5xl">Your closet, intelligently arranged.</h1>
          </div>
          <Button onClick={() => fileRef.current?.click()} className="rounded-full bg-foreground text-background"><Plus className="w-4 h-4 mr-2" />Add piece</Button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && add(e.target.files[0])} />
        </div>

        {items.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed bg-card p-16 text-center">
            <p className="font-display text-2xl">Your wardrobe is empty.</p>
            <p className="text-sm text-muted-foreground mt-2 mb-6">Upload photos of clothes you own to get smarter combinations.</p>
            <Button onClick={() => fileRef.current?.click()} className="rounded-full"><Plus className="w-4 h-4 mr-2" />Upload first piece</Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {items.map(it => (
              <div key={it.id} className="group relative rounded-2xl border bg-card overflow-hidden shadow-soft">
                <img src={it.image} alt={it.label} className="w-full aspect-square object-cover" />
                <div className="p-3 flex items-center justify-between">
                  <div className="text-xs truncate">{it.label}</div>
                  <button onClick={() => persist(items.filter(x => x.id !== it.id))} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        <section>
          <h2 className="font-display text-3xl mb-6">Outfit combination ideas</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {combos.map(c => (
              <div key={c.title} className="rounded-2xl border bg-card p-6 hover-lift">
                <div className="font-display text-xl">{c.title}</div>
                <p className="text-sm text-muted-foreground mt-2">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

export default Wardrobe;
