"use client";

// ScanResultCard.tsx
// Displays the result of an AI scan (valid / invalid / unclear).
// Used in the /scan page after the user submits an image for analysis.
// Props:
//   verdict — the ScanVerdict returned by validateScanImage()

import { CheckCircle2, AlertTriangle } from "lucide-react";
import type { ScanVerdict } from "@/lib/scan";

type Props = {
  verdict: ScanVerdict;
};

export function ScanResultCard({ verdict }: Props) {
  const isValid = verdict.status === "valid";

  return (
    <div
      className={`rounded-3xl border p-6 ${
        isValid
          ? "bg-secondary"
          : "bg-destructive/10 border-destructive/30"
      }`}
    >
      {/* Status header */}
      <div className="flex items-center gap-2 font-medium">
        {isValid ? (
          <>
            <CheckCircle2 className="w-5 h-5" />
            Image accepted
          </>
        ) : (
          <>
            <AlertTriangle className="w-5 h-5" />
            {verdict.status === "invalid"
              ? "Invalid image. Please upload a clear single-person fashion photo."
              : "Image unclear. Please upload a clearer photo."}
          </>
        )}
      </div>

      {/* Reason text (shown for all statuses) */}
      {verdict.reason && (
        <p className="text-xs text-muted-foreground mt-2">{verdict.reason}</p>
      )}

      {/* Analysis details (shown only when valid) */}
      {isValid && (
        <div className="text-xs text-muted-foreground mt-3 space-y-1">
          {verdict.style && <p>Style: {verdict.style}</p>}
          {verdict.colors?.length ? (
            <p>Colors: {verdict.colors.join(", ")}</p>
          ) : null}
          {verdict.clothing_type && <p>Clothing: {verdict.clothing_type}</p>}
          {verdict.occasion && <p>Occasion: {verdict.occasion}</p>}
        </div>
      )}
    </div>
  );
}
