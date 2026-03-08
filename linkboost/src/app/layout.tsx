import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastProvider } from "@/components/ui/toast-provider";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "LinkBoost",
  description:
    "Optimisez votre presence LinkedIn avec l'IA. Generez du contenu engageant, analysez vos performances et boostez votre personal branding.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased bg-[#09090B] text-white`}
      >
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
