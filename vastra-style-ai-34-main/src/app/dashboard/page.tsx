"use client";

// dashboard/page.tsx
// The main Recommendation-First dashboard.
//
// Layout (top to bottom):
//   1. Header — greeting + refresh button
//   2. AI Scan CTA — always visible; shows scan result if a scan was done,
//      otherwise prompts the user to scan their outfit
//   3. Style Profile Summary — shows saved preferences, links to /manual
//   4. AI Recommended Outfit — the first (hero) recommendation
//   5. More Picks — the remaining recommended products
//   6. AI Stylist CTA — teaser linking to the /chat page

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  Sparkles,
  MessageCircleHeart,
  Loader2,
  RefreshCcw,
  ArrowRight,
  Heart,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/ProductImage";
import { RecommendationCard } from "@/components/RecommendationCard";
import { StyleSummaryCard } from "@/components/StyleSummaryCard";
import { useRecommendations } from "@/hooks/useRecommendations";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/lib/auth";

// Reads the stored AI scan result from localStorage.
// This is set by scan/page.tsx after a successful scan.
type ScanInfo = {
  style?: string;
  colors?: string[];
  clothing_type?: string;
  occasion?: string;
  recommendations_context?: string;
};

function getScanInfo(): ScanInfo | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("vastra:scan-result");
    return raw ? (JSON.parse(raw) as ScanInfo) : null;
  } catch {
    return null;
  }
}

// Checks if the user has completed a scan in this browser session.
function hasScanResult(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem("vastra:scan") === "1";
}

export default function Dashboard() {
  const { isGuest } = useAuth();
  const { products, loading, error, profile, refresh } = useRecommendations();
  const { favIds, toggleFav } = useFavorites();

  // Scan state — read from storage after mount (client-only)
  const [scanDone, setScanDone] = useState(false);
  const [scanInfo, setScanInfo] = useState<ScanInfo | null>(null);

  useEffect(() => {
    setScanDone(hasScanResult());
    setScanInfo(getScanInfo());
  }, []);

  // Show toast when error changes
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // Split into hero (first result) and the rest
  const heroProduct = products[0] ?? null;
  const moreProducts = products.slice(1);

  // Greeting based on saved name or guest status
  const greeting = profile.name
    ? `Welcome, ${profile.name}`
    : isGuest
      ? "Welcome, Guest"
      : "Welcome back";

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-6 py-10 lg:py-12 space-y-10">

        {/* ── 1. Header ─────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
              Your atelier
            </p>
            <h1 className="font-display text-4xl md:text-5xl">{greeting}.</h1>
            {(profile.city || profile.season || profile.occasion) && (
              <p className="text-muted-foreground mt-2">
                Curated for {profile.city || "your city"} ·{" "}
                {profile.season || "this season"} ·{" "}
                {profile.occasion || "today"}
              </p>
            )}
          </div>
          <Button
            variant="outline"
            onClick={() => refresh()}
            disabled={loading}
            className="rounded-full"
          >
            <RefreshCcw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh picks
          </Button>
        </div>

        {/* ── 2. AI Scan CTA — always visible ───────────────────────── */}
        <div className="rounded-3xl border bg-card overflow-hidden">
          {scanDone && scanInfo ? (
            // Scan was completed — show the analysis result
            <div className="p-6 grid md:grid-cols-[1fr_auto] gap-6 items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3 inline-flex items-center gap-2">
                  <Camera className="w-3 h-3" /> AI Scan Result
                </p>
                <div className="flex flex-wrap gap-2">
                  {scanInfo.style && (
                    <span className="px-3 py-1 rounded-full bg-secondary text-sm">
                      Style: {scanInfo.style}
                    </span>
                  )}
                  {scanInfo.clothing_type && (
                    <span className="px-3 py-1 rounded-full bg-secondary text-sm">
                      Type: {scanInfo.clothing_type}
                    </span>
                  )}
                  {scanInfo.occasion && (
                    <span className="px-3 py-1 rounded-full bg-secondary text-sm">
                      Occasion: {scanInfo.occasion}
                    </span>
                  )}
                  {scanInfo.colors?.map((color) => (
                    <span
                      key={color}
                      className="px-3 py-1 rounded-full bg-secondary text-sm"
                    >
                      {color}
                    </span>
                  ))}
                </div>
                {scanInfo.recommendations_context && (
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-xl">
                    {scanInfo.recommendations_context}
                  </p>
                )}
              </div>
              <Link
                href="/scan"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <Camera className="w-4 h-4" /> Re-scan{" "}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            // No scan yet — prompt the user to scan their outfit
            <div className="p-8 flex flex-col md:flex-row items-center gap-6">
              <div className="w-14 h-14 rounded-full gradient-luxe flex items-center justify-center shrink-0">
                <Camera className="w-6 h-6" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="font-display text-2xl">
                  Get AI-Powered Outfit Picks
                </h2>
                <p className="text-muted-foreground text-sm mt-1 max-w-md">
                  Upload your photo and let our AI read your silhouette, style,
                  and tone for perfectly matched recommendations.
                </p>
              </div>
              <Link
                href="/scan"
                className="rounded-full bg-foreground text-background px-6 py-3 text-sm inline-flex items-center gap-2 hover:opacity-90 transition-opacity shrink-0"
              >
                Scan my outfit <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* ── 3. Style Profile Summary ───────────────────────────────── */}
        <StyleSummaryCard profile={profile} />

        {/* ── 4 + 5. Recommendations ────────────────────────────────── */}
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin" />
            Composing your AI picks…
          </div>
        ) : error ? (
          <div className="rounded-3xl border bg-card p-12 text-center">
            <p className="text-muted-foreground mb-4">
              Could not load recommendations.
            </p>
            <Button
              variant="outline"
              onClick={() => refresh()}
              className="rounded-full"
            >
              Try again
            </Button>
          </div>
        ) : !heroProduct ? (
          <div className="rounded-3xl border bg-card p-12 text-center text-muted-foreground">
            No products yet. Complete your style profile and try again.
          </div>
        ) : (
          <>
            {/* ── 4. AI Recommended Outfit (Hero) ───────────────────── */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 inline-flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> AI Recommended Outfit
              </p>
              <div className="grid lg:grid-cols-5 gap-8 rounded-3xl bg-card border overflow-hidden shadow-soft">
                {/* Product image */}
                <div className="lg:col-span-2 aspect-[4/5] lg:aspect-auto">
                  <ProductImage
                    src={heroProduct.image_url}
                    alt={heroProduct.name}
                    loading="eager"
                  />
                </div>

                {/* Product details */}
                <div className="lg:col-span-3 p-8 lg:p-12 flex flex-col justify-center">
                  <h2 className="font-display text-4xl md:text-5xl">
                    {heroProduct.name}
                  </h2>
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    {heroProduct.description}
                  </p>

                  {/* Attribute tags */}
                  <div className="mt-6 flex flex-wrap gap-2 text-xs">
                    {[
                      heroProduct.color,
                      heroProduct.fabric,
                      heroProduct.occasion,
                      heroProduct.category,
                    ]
                      .filter(Boolean)
                      .map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full bg-secondary"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>

                  {/* Price + actions */}
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <div className="font-display text-3xl">
                      {heroProduct.price}
                    </div>
                    <a
                      href={heroProduct.buy_url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-foreground text-background px-6 py-3 text-sm inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
                    >
                      View on {heroProduct.store}{" "}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <Button
                      variant="ghost"
                      onClick={() => toggleFav(heroProduct)}
                    >
                      <Heart
                        className={`w-4 h-4 mr-2 transition-all ${
                          favIds.has(heroProduct.id) ? "fill-current" : ""
                        }`}
                      />
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* ── 5. More Picks (remaining products) ────────────────── */}
            {moreProducts.length > 0 && (
              <section>
                <div className="mb-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
                    Recommended for you
                  </p>
                  <h2 className="font-display text-3xl">More Picks</h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {moreProducts.map((product) => (
                    <RecommendationCard
                      key={product.id}
                      product={product}
                      isFav={favIds.has(product.id)}
                      onToggleFav={() => toggleFav(product)}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* ── 6. AI Stylist CTA ─────────────────────────────────────── */}
        <div className="rounded-3xl border bg-card p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="w-14 h-14 rounded-full gradient-luxe flex items-center justify-center shrink-0">
            <MessageCircleHeart className="w-6 h-6" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="font-display text-2xl">Ask Your AI Stylist</h2>
            <p className="text-muted-foreground text-sm mt-1 max-w-md">
              Get personalised outfit advice, occasion-specific tips, fabric
              recommendations, and more — just ask.
            </p>
          </div>
          <Link
            href="/chat"
            className="rounded-full bg-foreground text-background px-6 py-3 text-sm inline-flex items-center gap-2 hover:opacity-90 transition-opacity shrink-0"
          >
            Chat with stylist <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </AppShell>
  );
}
