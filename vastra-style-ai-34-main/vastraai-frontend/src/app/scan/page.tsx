"use client";

import { useRouter } from "next/navigation";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload, Camera, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { validateScanImage, type ScanVerdict } from "@/lib/scan";
import { ScanResultCard } from "@/components/ScanResultCard";


function Scan() {
  const nav = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [verdict, setVerdict] = useState<ScanVerdict | null>(null);

  function pick(file: File) {
    if (!file.type.startsWith("image/")) { toast.error("Please choose an image file."); return; }
    if (file.size > 7 * 1024 * 1024) { toast.error("Image too large (max 7MB)."); return; }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => { setPreview(reader.result as string); setVerdict(null); };
    reader.readAsDataURL(file);
  }

  async function scan() {
    if (!selectedFile) return;
    setBusy(true); setVerdict(null);
    try {
      const r = await validateScanImage(selectedFile);
      setVerdict(r);
      if (r.status === "valid") {
        sessionStorage.setItem("vastra:scan", "1");
        localStorage.setItem("vastra:scan-result", JSON.stringify({
          style: r.style,
          colors: r.colors ?? [],
          clothing_type: r.clothing_type,
          occasion: r.occasion,
          recommendations_context: r.recommendations_context ?? r.reason,
        }));
        toast.success("Scan complete · routing to analysis");
        setTimeout(() => nav.push("/dashboard"), 700);
      } else if (r.status === "invalid") {
        toast.error("Invalid image. Please upload a clear single-person fashion photo.");
      } else {
        toast.error("Image unclear. Please upload a clearer photo.");
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Scan failed");
    } finally { setBusy(false); }
  }

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-6 py-10 lg:py-16">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">AI Scan Mode</p>
        <h1 className="font-display text-4xl md:text-5xl mb-2">Let our model read your silhouette.</h1>
        <p className="text-muted-foreground max-w-2xl">Upload a clear single-person full-body or upper-body photo. We validate the image before any analysis.</p>

        <div className="mt-10 grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <motion.div whileHover={{ scale: preview ? 1 : 1.005 }}
              onClick={() => !preview && fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); }}
              onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) pick(f); }}
              className="relative rounded-3xl border-2 border-dashed bg-card aspect-[4/5] overflow-hidden flex items-center justify-center cursor-pointer">
              {preview ? (
                <>
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <button onClick={(e) => { e.stopPropagation(); setPreview(null); setSelectedFile(null); setVerdict(null); }} className="absolute top-4 right-4 glass p-2 rounded-full"><X className="w-4 h-4" /></button>
                </>
              ) : (
                <div className="text-center px-8">
                  <div className="mx-auto w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-4"><Upload className="w-6 h-6" /></div>
                  <div className="font-display text-2xl">Drop your photo here</div>
                  <p className="text-sm text-muted-foreground mt-2">or click to browse · JPG/PNG · up to 7MB</p>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={e => e.target.files?.[0] && pick(e.target.files[0])} />
            </motion.div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-11 rounded-xl" onClick={() => fileRef.current?.click()}><Upload className="w-4 h-4 mr-2" />Upload</Button>
              <Button variant="outline" className="h-11 rounded-xl" onClick={() => fileRef.current?.click()}><Camera className="w-4 h-4 mr-2" />Camera</Button>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-3xl bg-card border p-6">
              <h3 className="font-display text-2xl mb-2">Image guidelines</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Single person, clear lighting</li>
                <li>• Full body or upper body</li>
                <li>• Wearing identifiable clothing</li>
                <li>• No memes, screenshots or product photos</li>
              </ul>
            </div>

            {verdict && <ScanResultCard verdict={verdict} />}

            <Button onClick={scan} disabled={!selectedFile || busy} className="w-full h-12 rounded-xl bg-foreground text-background hover:opacity-90">
              {busy ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analyzing image…</> : "Validate & Scan"}
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default Scan;