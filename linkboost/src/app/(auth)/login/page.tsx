"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { signInWithGoogle, signInWithMagicLink } from "@/lib/auth/actions";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [resending, setResending] = useState(false);

  const validateEmail = (value: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(value);
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    if (!validateEmail(email)) {
      setEmailError("Adresse email invalide");
      return;
    }

    setLoading(true);
    try {
      await signInWithMagicLink(email);
      setSent(true);
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : "Une erreur est survenue. Reessaie.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await signInWithMagicLink(email);
    } catch {
      // silent
    } finally {
      setResending(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setEmailError("");
      await signInWithGoogle();
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : "Erreur OAuth Google");
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
        <h2 className="text-2xl font-bold text-white mb-1">Bienvenue</h2>
        <p className="text-sm text-zinc-400 mb-8">
          Connecte-toi pour commencer ta recherche
        </p>

        {/* Google OAuth */}
        <button
          onClick={handleGoogleLogin}
          className={cn(
            "w-full h-12 bg-white text-gray-900 font-medium rounded-lg",
            "flex items-center justify-center gap-3",
            "hover:bg-zinc-100 active:scale-[0.98] transition-all duration-150",
            "focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-[#09090B]"
          )}
        >
          {/* Google SVG Icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 001 12c0 1.94.46 3.77 1.18 5.43l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continuer avec Google
        </button>

        {/* Separator */}
        <div className="flex items-center gap-3 w-full my-6">
          <div className="flex-1 h-px bg-zinc-800" />
          <span className="text-xs text-zinc-500 uppercase tracking-wider">
            ou
          </span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        {/* Magic Link Form / Success */}
        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.form
              key="form"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleMagicLink}
              className="w-full space-y-3"
            >
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  placeholder="ton@email.com"
                  className={cn(
                    "w-full h-12 px-4 rounded-lg bg-zinc-900 border text-white text-sm",
                    "placeholder:text-zinc-500 outline-none transition-colors duration-150",
                    "focus:ring-2 focus:ring-violet-500 focus:border-transparent",
                    emailError
                      ? "border-red-500"
                      : "border-zinc-800 hover:border-zinc-700"
                  )}
                />
                {emailError && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-400 mt-1.5 pl-1"
                  >
                    {emailError}
                  </motion.p>
                )}
              </div>

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
                    Recevoir un lien magique
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.form>
          ) : (
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
                <p className="text-sm text-zinc-400">{email}</p>
              </div>
              <button
                onClick={handleResend}
                disabled={resending}
                className={cn(
                  "text-sm text-zinc-400 hover:text-white transition-colors duration-150",
                  "px-4 py-2 rounded-lg hover:bg-zinc-800/50",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {resending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Renvoyer"
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legal */}
        <p className="text-xs text-zinc-500 text-center mt-8 leading-relaxed">
          En continuant, tu acceptes nos{" "}
          <a href="/cgu" className="underline hover:text-zinc-300 transition-colors">
            CGU
          </a>{" "}
          et notre{" "}
          <a
            href="/confidentialite"
            className="underline hover:text-zinc-300 transition-colors"
          >
            Politique de confidentialite
          </a>
          .
        </p>
      </motion.div>
    </div>
  );
}
