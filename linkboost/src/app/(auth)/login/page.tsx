"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { signInWithGoogle, signInWithEmail } from "@/lib/auth/actions";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Email et mot de passe requis");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmail(email, password);
      router.push("/dashboard");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("Invalid login credentials")) {
        setError("Email ou mot de passe incorrect");
      } else if (msg.includes("Email not confirmed")) {
        setError("Verifie ta boite mail pour confirmer ton compte");
      } else {
        setError(msg || "Une erreur est survenue");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setError("");
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur OAuth Google");
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm mx-auto flex flex-col items-center"
      >
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">
            LinkBoost
          </h1>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-white mb-1">Content de te revoir</h2>
        <p className="text-sm text-zinc-400 mb-8">
          Connecte-toi pour retrouver ton espace
        </p>

        {/* Google OAuth */}
        <button
          onClick={handleGoogle}
          className={cn(
            "w-full h-12 bg-white text-gray-900 font-medium rounded-lg",
            "flex items-center justify-center gap-3",
            "hover:bg-zinc-100 active:scale-[0.98] transition-all duration-150",
            "focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-[#09090B]"
          )}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 001 12c0 1.94.46 3.77 1.18 5.43l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continuer avec Google
        </button>

        {/* Separator */}
        <div className="flex items-center gap-3 w-full my-6">
          <div className="flex-1 h-px bg-zinc-800" />
          <span className="text-xs text-zinc-500 uppercase tracking-wider">ou</span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        {/* Email + Password Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            placeholder="ton@email.com"
            className={cn(
              "w-full h-12 px-4 rounded-lg bg-zinc-900 border text-white text-sm",
              "placeholder:text-zinc-500 outline-none transition-colors duration-150",
              "focus:ring-2 focus:ring-violet-500 focus:border-transparent",
              error ? "border-red-500/50" : "border-zinc-800 hover:border-zinc-700"
            )}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              placeholder="Mot de passe"
              className={cn(
                "w-full h-12 px-4 pr-12 rounded-lg bg-zinc-900 border text-white text-sm",
                "placeholder:text-zinc-500 outline-none transition-colors duration-150",
                "focus:ring-2 focus:ring-violet-500 focus:border-transparent",
                error ? "border-red-500/50" : "border-zinc-800 hover:border-zinc-700"
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-400 pl-1"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={cn(
              "w-full h-12 rounded-lg font-medium text-sm text-white",
              "bg-violet-600 hover:bg-violet-500 active:scale-[0.98]",
              "transition-all duration-150 flex items-center justify-center gap-2",
              "focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-[#09090B]",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            )}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Se connecter
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Switch to register */}
        <p className="text-sm text-zinc-500 mt-8">
          Pas encore de compte ?{" "}
          <Link
            href="/register"
            className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
          >
            Creer un compte
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
