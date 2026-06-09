// useRecommendations.ts
// Fetches AI-powered product recommendations based on the user's saved profile.
// Wraps the fetchRecommendationProducts API call with loading and error state.
// Usage: const { products, loading, error, profile, refresh } = useRecommendations();

import { useState, useEffect } from "react";
import { fetchRecommendationProducts, type RecommendationProduct } from "@/lib/recommendations";

// Reads the stored style profile from localStorage.
// Returns an empty object if nothing is stored or parsing fails.
function getStoredProfile(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem("vastra:profile") ?? "{}");
  } catch {
    return {};
  }
}

export function useRecommendations() {
  const [products, setProducts] = useState<RecommendationProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Record<string, string>>({});

  // Fetches recommendations for a given profile.
  // Accepts an optional override so callers can pass a fresh profile before
  // the state update has re-rendered (e.g. on first mount).
  async function refresh(activeProfile: Record<string, string> = profile) {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchRecommendationProducts(activeProfile);
      setProducts(result);
    } catch (e: unknown) {
      setProducts([]);
      const message = e instanceof Error ? e.message : "Failed to load picks";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  // On mount: read the stored profile and immediately fetch recommendations.
  useEffect(() => {
    const storedProfile = getStoredProfile();
    setProfile(storedProfile);
    void refresh(storedProfile);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { products, loading, error, profile, refresh };
}
