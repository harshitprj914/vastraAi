"use client";


// StyleSummaryCard.tsx
// Shows the user's current style preferences at a glance.
// Reads from the profile object (which comes from localStorage "vastra:profile").
// Includes an "Update preferences" link back to /manual.
// Props:
//   profile — Record<string, string> of the user's saved preferences

import Link from "next/link";
import { Settings2 } from "lucide-react";
import { useEffect, useState } from "react";
type Props = {
  profile: Record<string, string>;
};
type ProfileData = Record<string, string>;

function getScanProfile() {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem("vastra:scan-result");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Maps profile field keys to human-readable labels.
// Only these fields are shown — others (like height/weight) are omitted for brevity.
const DISPLAY_FIELDS: { key: string; label: string }[] = [
  { key: "style", label: "Style" },
  { key: "occasion", label: "Occasion" },
  { key: "weather", label: "Weather" },
  { key: "season", label: "Season" },
  { key: "budget", label: "Budget" },
  { key: "city", label: "City" },
  { key: "bodyType", label: "Body type" },
  { key: "gender", label: "Gender" },
];

export function StyleSummaryCard({ profile }: Props) {
  // Only show fields that have a value
  const [scanProfile, setScanProfile] = useState<any>(null);

useEffect(() => {
  setScanProfile(getScanProfile());
}, []);
 const mergedProfile: ProfileData = {
    ...profile,
    ...(scanProfile
      ? {
          style: scanProfile.style,
          occasion: scanProfile.occasion,
        }
      : {}),
  };

  const filledFields = DISPLAY_FIELDS.filter(
    ({ key }) => !!mergedProfile[key as keyof ProfileData]
  );

  return (
    <div className="rounded-2xl border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-2xl">Your Style Profile</h2>
        <Link
          href="/manual"
          className="text-xs inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Settings2 className="w-3.5 h-3.5" />
          Update preferences
        </Link>
      </div>

      {filledFields.length === 0 ? (
        // Empty state — prompt user to fill in their preferences
        <p className="text-sm text-muted-foreground">
          No preferences set yet.{" "}
          <Link href="/manual" className="underline hover:text-foreground">
            Add them now
          </Link>{" "}
          to get better AI recommendations.
        </p>
      ) : (
        // Show filled preferences as pill tags
        <div className="flex flex-wrap gap-2">
          {filledFields.map(({ key, label }) => (
            <span
              key={key}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-sm"
            >
              <span className="text-muted-foreground text-xs">{label}:</span>
              <span className="font-medium">{mergedProfile[key as keyof ProfileData]}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
