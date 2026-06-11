"use client";

import Link from "next/link";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const search = z.object({ mode: z.enum(["login","signup"]).catch("login") });


function AuthContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'login';
  const isSignup = mode === "signup";
  const { signIn, signUp, continueAsGuest } = useAuth();
  const nav = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const fn = isSignup ? signUp(email, password, name) : signIn(email, password);
      const { error } = await fn;
      if (error) toast.error(error);
      else { toast.success(isSignup ? "Welcome to VastraAI" : "Welcome back"); nav.push("/mode"); }
    } finally { setBusy(false); }
  }

  async function google() {
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/mode`,
        },
      });
      if (error) toast.error(error.message ?? "Google sign-in failed");
    } finally { setBusy(false); }
  }

  function guest() { continueAsGuest(); nav.push("/mode"); }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="relative hidden lg:block">
        <img src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1400&q=80" alt="Editorial" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 text-background">
          <div className="font-display text-5xl leading-tight">An atelier<br/>for your wardrobe.</div>
          <p className="mt-3 opacity-80 text-sm max-w-md">Personal styling, refined by AI.</p>
        </div>
        <Link href="/" className="absolute top-8 left-8 text-background/90 text-sm">← Back</Link>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }} className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Link href="/" className="lg:hidden text-sm text-muted-foreground">← Back</Link>
          <h1 className="font-display text-4xl md:text-5xl mt-4">{isSignup ? "Create your account" : "Welcome back"}</h1>
          <p className="text-muted-foreground mt-2">{isSignup ? "Begin your style journey." : "Continue where you left off."}</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            {isSignup && (
              <div><Label htmlFor="name">Name</Label><Input id="name" value={name} onChange={e=>setName(e.target.value)} required className="mt-1.5 h-11 rounded-xl" /></div>
            )}
            <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="mt-1.5 h-11 rounded-xl" /></div>
            <div><Label htmlFor="password">Password</Label><Input id="password" type="password" minLength={6} value={password} onChange={e=>setPassword(e.target.value)} required className="mt-1.5 h-11 rounded-xl" /></div>
            <Button type="submit" disabled={busy} className="w-full h-11 rounded-xl bg-foreground text-background hover:opacity-90">
              {busy ? "..." : (isSignup ? "Create account" : "Login")}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" />OR<div className="h-px flex-1 bg-border" />
          </div>

          <div className="space-y-3">
            <Button onClick={google} disabled={busy} variant="outline" className="w-full h-11 rounded-xl">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.3 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16.3 19 13.5 24 13.5c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.3 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.4-4.5 2.4-7.2 2.4-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.6 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4-4.1 5.6l6.2 5.2c-.4.4 6.6-4.8 6.6-14.8 0-1.3-.1-2.4-.4-3.5z"/></svg>
              Continue with Google
            </Button>
            <Button onClick={guest} variant="ghost" className="w-full h-11 rounded-xl">Continue as guest</Button>
          </div>

          <p className="mt-8 text-sm text-center text-muted-foreground">
            {isSignup ? "Have an account?" : "New to VastraAI?"}{" "}
            <Link href={`/auth?mode=${isSignup ? "login" : "signup"}`} className="text-foreground font-medium hover:underline">
              {isSignup ? "Login" : "Sign up"}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function Auth() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}