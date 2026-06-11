"use client";

// RecommendationCard.tsx
// Displays a single AI-recommended product in a card layout.
// Used in the dashboard's product grid (the "More Picks" section).
// Props:
//   product    — the recommendation to display
//   isFav      — whether the user has saved this product
//   onToggleFav — called when the user clicks the save button

import { motion } from "framer-motion";
import { Heart, ExternalLink } from "lucide-react";
import { ProductImage } from "./ProductImage";
import type { RecommendationProduct } from "@/lib/recommendations";

type Props = {
  product: RecommendationProduct;
  isFav: boolean;
  onToggleFav: () => void;
};

export function RecommendationCard({ product, isFav, onToggleFav }: Props) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="rounded-2xl bg-card border overflow-hidden shadow-soft"
    >
      {/* Product image with save button overlay */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <ProductImage src={product.image_url} alt={product.name} />
        <button
          onClick={onToggleFav}
          aria-label={isFav ? "Unsave product" : "Save product"}
          className="absolute top-3 right-3 glass p-2 rounded-full z-10 transition-transform hover:scale-110"
        >
          <Heart className={`w-4 h-4 transition-all ${isFav ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Product info */}
      <div className="p-4">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
          {product.category} · {product.store}
        </div>
        <div className="font-medium leading-tight mt-1 line-clamp-2">{product.name}</div>
        <div className="mt-2 flex items-center justify-between">
          <div className="font-display text-lg">{product.price}</div>
          <a
            href={product.buy_url}
            target="_blank"
            rel="noreferrer"
            className="text-xs inline-flex items-center gap-1 hover:underline text-muted-foreground hover:text-foreground"
          >
            View <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}
