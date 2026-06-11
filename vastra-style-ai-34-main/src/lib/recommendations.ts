type OnboardingProfile = Record<string, string | undefined>;

export type ScanAnalysis = {
  style: string;
  colors: string[];
  clothing_type: string;
  occasion: string;
  recommendations_context: string;
};

export type RecommendationProduct = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  color: string;
  fabric: string;
  occasion: string;
  store: string;
  buy_url: string;
  image_url: string;
};

type BackendRecommendation = {
  id: string;
  title: string;
  brand: string;
  price: number;
  image: string;
  product_url: string;
  category: string;
};

type RecommendationRequest = {
  gender: string;
  body_type: string;
  style: string;
  occasion: string;
  season: string;
  budget: string;
  scan_analysis?: ScanAnalysis;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "https://vastraai-4.onrender.com/";

function apiPath(path: string) {
  return `${API_BASE_URL}${path}`;
}

function required(value: string | undefined, fallback: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

function getSavedScanAnalysis(): ScanAnalysis | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = localStorage.getItem("vastra:scan-result");
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as ScanAnalysis;
    if (!parsed?.style || !parsed?.clothing_type || !parsed?.recommendations_context) return undefined;
    return {
      style: parsed.style,
      colors: Array.isArray(parsed.colors) ? parsed.colors : [],
      clothing_type: parsed.clothing_type,
      occasion: parsed.occasion || "daily",
      recommendations_context: parsed.recommendations_context,
    };
  } catch {
    return undefined;
  }
}

export function buildRecommendationRequest(profile: OnboardingProfile): RecommendationRequest {
  
  const scan =
  typeof window !== "undefined" &&
  sessionStorage.getItem("vastra:scan") === "1"
    ? getSavedScanAnalysis()
    : undefined;

  return {
  gender: required(profile.gender, "Unisex"),
  body_type: required(profile.bodyType, "Average"),
  style: required(scan?.style, required(profile.style, "Casual")),
  occasion: required(scan?.occasion, required(profile.occasion, "Daily Wear")),
  season: required(profile.season, "Summer"),
  budget: required(profile.budget, "₹1500-3000"),

  ...(scan ? { scan_analysis: scan } : {}),
};
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

function mapProduct(item: BackendRecommendation, profile: OnboardingProfile): RecommendationProduct {
  const scan = getSavedScanAnalysis();
  return {
    id: item.id,
    name: item.title,
    category: item.category,
    description: `${item.brand} pick for ${scan?.occasion || required(profile.occasion, "your occasion")}.`,
    price: formatPrice(item.price),
    color: scan?.colors?.join(", ") || required(profile.skinTone, ""),
    fabric: "",
    occasion: scan?.occasion || required(profile.occasion, ""),
    store: item.brand,
    buy_url: item.product_url,
    image_url: item.image,
  };
}

export async function fetchRecommendationProducts(profile: OnboardingProfile) {
  const response = await fetch(apiPath("/recommend"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buildRecommendationRequest(profile)),
  });

  if (!response.ok) {
    let detail = "";
    try {
      const body = await response.json();
      detail = typeof body.detail === "string" ? body.detail : JSON.stringify(body.detail ?? body);
    } catch {
      detail = await response.text();
    }
    throw new Error(detail || `Recommendation API failed with ${response.status}`);
  }

  const data: { products?: BackendRecommendation[] } = await response.json();
  return (data.products ?? []).map(item => mapProduct(item, profile));
}
