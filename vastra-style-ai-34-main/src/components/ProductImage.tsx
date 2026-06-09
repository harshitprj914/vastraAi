import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import _placeholderFashion from "@/assets/placeholder-fashion.jpg";
const placeholderFashion = typeof _placeholderFashion === 'string' ? _placeholderFashion : _placeholderFashion.src;

type Props = {
  src?: string | null;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
};

function isSafe(url?: string | null): url is string {
  return !!url && typeof url === "string" && url.startsWith("https://");
}

export function ProductImage({ src, alt, className, loading = "lazy" }: Props) {
  const initial = isSafe(src) ? src : placeholderFashion;
  const [current, setCurrent] = useState<string>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setCurrent(isSafe(src) ? src : placeholderFashion);
    setLoaded(false);
  }, [src]);

  return (
    <div className={cn("relative w-full h-full overflow-hidden bg-secondary", className)}>
      {!loaded && <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-secondary to-muted" />}
      <img
        src={current}
        alt={alt}
        loading={loading}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (current !== placeholderFashion) {
            setCurrent(placeholderFashion);
          } else {
            setLoaded(true);
          }
        }}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}

export { placeholderFashion };
