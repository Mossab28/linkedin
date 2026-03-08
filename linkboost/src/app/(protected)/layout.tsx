import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA]">
      <Sidebar />
      <MobileNav />
      <main className="ml-0 lg:ml-64 p-4 lg:p-8 pb-20 lg:pb-8 min-h-screen">
        {children}
      </main>
    </div>
  );
}
