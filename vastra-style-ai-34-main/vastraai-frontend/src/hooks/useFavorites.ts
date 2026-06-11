// useFavorites.ts
// Manages saving and unsaving recommendation products.
// - Logged-in users: saves to Supabase "favorites" table.
// - Guests: saves to localStorage under "vastra:favs".
// Usage: const { favIds, toggleFav } = useFavorites();

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import type { RecommendationProduct } from "@/lib/recommendations";

export function useFavorites() {
  const { user } = useAuth();

  // favIds tracks which product IDs are currently saved in this session.
  const [favIds, setFavIds] = useState<Set<string>>(new Set());

  async function toggleFav(product: RecommendationProduct) {
    const currentSet = new Set(favIds);
    const alreadySaved = currentSet.has(product.id);

    if (!user) {
      // Guest path: read/write to localStorage
      alreadySaved ? currentSet.delete(product.id) : currentSet.add(product.id);
      setFavIds(currentSet);

      const stored: RecommendationProduct[] = JSON.parse(
        localStorage.getItem("vastra:favs") ?? "[]"
      );
      const updated = alreadySaved
        ? stored.filter((x) => x.id !== product.id)
        : [...stored, product];
      localStorage.setItem("vastra:favs", JSON.stringify(updated));
      return;
    }

    // Logged-in user path: sync with Supabase
    if (alreadySaved) {
      currentSet.delete(product.id);
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .contains("product", { id: product.id });
    } else {
      currentSet.add(product.id);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await supabase.from("favorites").insert({ user_id: user.id, product: product as any });
    }
    setFavIds(currentSet);
  }

  return { favIds, toggleFav };
}
