"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Loader2, ArrowRight, Sparkles, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { signInWithGoogle, signUpWithEmail } from "@/lib/auth/actions";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email requis");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);
    try {
      const data = await signUpWithEmail(email, password);

      // If email confirmation is enabled, Supabase returns a user but session is null
      if (data.user && !data.session) {
        setSuccess(true);
      } else {
        // Auto-confirmed (dev mode or disabled confirmation) -> redirect
        window.location.href = "/onboarding";
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("already registered")) {
        setError("Cet email est deja utilise. Essaie de te connecter.");
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
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-violet-400" />
          <h2 className="text-2xl font-bold text-white">Creer ton compte</h2>
        </div>
        <p className="text-sm text-zinc-400 mb-8 text-center">
          Gratuit. En 30 secondes tu lances ta recherche.
        </p>

        <AnimatePresence mode="wait">
          {success ? (
            /* ── Email confirmation screen ── */
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center text-center space-y-4 py-4"
            >
              <div className="w-14 h-14 rounded-full bg-violet-600/10 flex items-center justify-center">
                <Mail className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <p className="text-white font-medium mb-1">
                  Verifie ta boite mail
                </p>
                <p className="text-sm text-zinc-400 mb-1">{email}</p>
                <p className="text-xs text-zinc-500">
                  Clique sur le lien de confirmation pour activer ton compte.
                </p>
              </div>
              <Link
                href="/login"
                className={cn(
                  "mt-2 text-sm text-violet-400 hover:text-violet-300 font-medium transition-colors",
                  "px-4 py-2 rounded-lg hover:bg-zinc-800/50"
                )}
              >
                Aller a la connexion
              </Link>
            </motion.div>
          ) : (
            /* ── Registration form ── */
            <motion.div key="form" className="w-full">
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
                S'inscrire avec Google
              </button>

              {/* Separator */}
              <div className="flex items-center gap-3 w-full my-6">
                <div className="flex-1 h-px bg-zinc-800" />
                <span className="text-xs text-zinc-500 uppercase tracking-wider">ou</span>
                <div className="flex-1 h-px bg-zinc-800" />
              </div>

              {/* Form */}
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
                    placeholder="Mot de passe (min. 6 caracteres)"
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

                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                  placeholder="Confirmer le mot de passe"
                  className={cn(
                    "w-full h-12 px-4 rounded-lg bg-zinc-900 border text-white text-sm",
                    "placeholder:text-zinc-500 outline-none transition-colors duration-150",
                    "focus:ring-2 focus:ring-violet-500 focus:border-transparent",
                    error ? "border-red-500/50" : "border-zinc-800 hover:border-zinc-700"
                  )}
                />

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
                      Creer mon compte
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Switch to login */}
        {!success && (
          <p className="text-sm text-zinc-500 mt-8">
            Deja un compte ?{" "}
            <Link
              href="/login"
              className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
            >
              Se connecter
            </Link>
          </p>
        )}

        {/* Legal */}
        <p className="text-xs text-zinc-500 text-center mt-4 leading-relaxed">
          En creant un compte, tu acceptes nos{" "}
          <a href="/cgu" className="underline hover:text-zinc-300 transition-colors">
            CGU
          </a>{" "}
          et notre{" "}
          <a href="/confidentialite" className="underline hover:text-zinc-300 transition-colors">
            Politique de confidentialite
          </a>
          .
        </p>
      </motion.div>
    </div>
  );
}
