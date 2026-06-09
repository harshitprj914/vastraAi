"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, Camera, ListChecks, MessageCircleHeart, User2, Shirt, LogOut, Menu } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Primary navigation items — /trends is intentionally omitted here.
// The Trends page still exists at /trends but is not a core recommendation flow item.
const nav = [
  { to: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/scan", label: "AI Scan", Icon: Camera },
  { to: "/manual", label: "Preferences", Icon: ListChecks },
  { to: "/chat", label: "Stylist Chat", Icon: MessageCircleHeart },
  { to: "/wardrobe", label: "Wardrobe", Icon: Shirt },
  { to: "/profile", label: "Profile", Icon: User2 },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { user, isGuest, signOut } = useAuth();
  const loc = usePathname();
  const nav2 = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:sticky top-0 left-0 z-40 h-screen w-72 shrink-0 border-r bg-background/80 glass transition-transform",
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      )}>
        <div className="flex flex-col h-full p-6">
          <Link href="/dashboard" className="flex items-center gap-2 mb-10" onClick={() => setOpen(false)}>
            <div className="w-9 h-9 rounded-full gradient-luxe flex items-center justify-center font-display text-lg">V</div>
            <div>
              <div className="font-display text-2xl tracking-wide">VastraAI</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">fashion intelligence</div>
            </div>
          </Link>
          <nav className="flex-1 space-y-1">
            {nav.map(({ to, label, Icon }) => {
              const active = loc === to;
              return (
                <Link key={to} href={to} onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all",
                    active ? "bg-foreground text-background shadow-soft" : "hover:bg-secondary",
                  )}>
                  <Icon className="w-4 h-4" />{label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-6 pt-6 border-t">
            <div className="text-xs text-muted-foreground mb-2 truncate">
              {isGuest ? "Guest mode" : user?.email}
            </div>
            <Button variant="ghost" size="sm" className="w-full justify-start" onClick={async () => { await signOut(); nav2.push("/"); }}>
              <LogOut className="w-4 h-4 mr-2" />Sign out
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile topbar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-30 glass border-b flex items-center justify-between px-4 h-14">
        <Link href="/dashboard" className="font-display text-xl">VastraAI</Link>
        <button onClick={() => setOpen(o => !o)} className="p-2 rounded-lg hover:bg-secondary"><Menu className="w-5 h-5" /></button>
      </div>

      {open && <div onClick={() => setOpen(false)} className="lg:hidden fixed inset-0 z-30 bg-black/30" />}

      <main className="flex-1 min-w-0 pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  );
}