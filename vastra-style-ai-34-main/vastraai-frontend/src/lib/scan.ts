export type ScanVerdict = {
  status: "valid" | "invalid" | "unclear";
  reason?: string;
  style?: string;
  colors?: string[];
  clothing_type?: string;
  occasion?: string;
  recommendations_context?: string;
};

const API_BASE_URL =
  (process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://vastraai-4.onrender.com").replace(/\/$/, "");

function apiPath(path: string) {
  return API_BASE_URL ? `${API_BASE_URL}${path}` : `/api${path}`;
}

function loadImage(dataUrl: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Image could not be read."));
    image.src = dataUrl;
  });
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Image could not be read."));
    reader.readAsDataURL(file);
  });
}

async function localImageCheck(file: File): Promise<ScanVerdict> {
  const dataUrl = await fileToDataUrl(file);
  if (!/^data:image\/(png|jpe?g|webp);base64,/i.test(dataUrl)) {
    return { status: "invalid", reason: "Please upload a JPG, PNG, or WebP image." };
  }

  const image = await loadImage(dataUrl);
  const pixels = image.naturalWidth * image.naturalHeight;

  if (image.naturalWidth < 320 || image.naturalHeight < 320 || pixels < 180_000) {
    return { status: "unclear", reason: "The image is too small for a reliable scan." };
  }

  return { status: "valid", reason: "Image accepted for local analysis." };
}

export async function validateScanImage(file: File): Promise<ScanVerdict> {
  const form = new FormData();
  form.append("file", file);

  const response = await fetch(apiPath("/scan"), {
    method: "POST",
    body: form,
  });

  if (response.ok) {
    const analysis = await response.json();
    return {
      status: "valid",
      reason: analysis.recommendations_context,
      style: analysis.style,
      colors: analysis.colors ?? [],
      clothing_type: analysis.clothing_type,
      occasion: analysis.occasion,
      recommendations_context: analysis.recommendations_context,
    };
  }

  if (response.status !== 404 && response.status !== 405) {
    let detail = "";
    try {
      const body = await response.json();
      detail = typeof body.detail === "string" ? body.detail : JSON.stringify(body.detail ?? body);
    } catch {
      detail = await response.text();
    }
    throw new Error(detail || `Scan API failed with ${response.status}`);
  }

return localImageCheck(file);
}
