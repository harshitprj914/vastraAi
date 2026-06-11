"use client";

import { useEffect, useState } from "react";
import { Heart, ExternalLink } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { ProductImage } from "@/components/ProductImage";


function ProfilePage() {
  const { user, isGuest } = useAuth();
  const [favs, setFavs] = useState<any[]>([]);
  const [profile, setProfile] = useState<Record<string, string>>({});

  useEffect(() => {
    try { setProfile(JSON.parse(localStorage.getItem("vastra:profile") ?? "{}")); } catch {}
    if (user) {
      supabase.from("favorites").select("product").eq("user_id", user.id).then(({ data }) => {
        setFavs((data ?? []).map((r: any) => r.product));
      });
    } else {
      try { setFavs(JSON.parse(localStorage.getItem("vastra:favs") ?? "[]")); } catch {}
    }
  }, [user]);

  const entries = [
  ["Gender", profile.gender],
  ["Style", profile.style],
  ["Occasion", profile.occasion],
  ["Body Type", profile.bodyType],
  ["Budget", profile.budget],
  ["Season", profile.season],
   ].filter(([, v]) => v);

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-6 py-10 lg:py-12 space-y-12">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full gradient-luxe flex items-center justify-center font-display text-3xl">
            {(user?.email || "Guest")[0].toUpperCase()}
          </div>
          <div>
            <h1 className="font-display text-4xl">{user?.email || "Guest"}</h1>
            <p className="text-muted-foreground text-sm">{isGuest ? "Guest atelier" : user?.email}</p>
          </div>
        </div>

        <section className="grid lg:grid-cols-3 gap-8">
          <div className="rounded-3xl bg-card border p-6 lg:col-span-1">
            <h2 className="font-display text-2xl mb-4">Preferences</h2>
            {entries.length === 0
              ? <p className="text-sm text-muted-foreground">No preferences yet.</p>
              : <dl className="space-y-2 text-sm">{entries.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3 border-b last:border-0 py-1.5">
                    <dt className="text-muted-foreground capitalize">{k}</dt><dd className="text-right">{v}</dd>
                  </div>
                ))}</dl>}
          </div>
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl mb-4 flex items-center gap-2"><Heart className="w-5 h-5" />Saved outfits</h2>
            {favs.length === 0
              ? <div className="rounded-3xl border bg-card p-10 text-center text-muted-foreground">No saved outfits yet.</div>
              : (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {favs.map((p: any) => (
                    <div key={p.id} className="rounded-2xl border bg-card overflow-hidden shadow-soft">
                      <div className="aspect-[3/4]"><ProductImage src={p.image_url} alt={p.name} /></div>
                      <div className="p-3">
                        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{p.category}</div>
                        <div className="font-medium text-sm line-clamp-1">{p.name}</div>
                        <div className="mt-1 flex items-center justify-between">
                          <div className="text-sm">{p.price}</div>
                          <a href={p.buy_url} target="_blank" rel="noreferrer" className="text-xs inline-flex items-center gap-1 hover:underline">View <ExternalLink className="w-3 h-3" /></a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

export default ProfilePage;
