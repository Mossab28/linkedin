import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Non authentifie" },
        { status: 401 }
      );
    }

    const { data: rpcData, error: rpcError } = await supabase.rpc(
      "get_dashboard_stats",
      { p_user_id: user.id }
    );

    if (rpcError) {
      return NextResponse.json(
        { error: "Erreur lors de la recuperation des statistiques", details: rpcError.message },
        { status: 500 }
      );
    }

    // rpcData shape from DB:
    // { total_applications, applications_by_status, total_saved_jobs,
    //   total_messages, active_search_profiles, recent_applications, weekly_application_count }

    const byStatus = rpcData?.applications_by_status ?? {};
    const totalApps = rpcData?.total_applications ?? 0;
    const interviewCount = byStatus.interview ?? 0;
    const acceptedCount = byStatus.accepted ?? 0;
    const responseRate = totalApps > 0
      ? Math.round(((interviewCount + acceptedCount) / totalApps) * 100)
      : 0;

    // Transform recent_applications from DB columns to frontend format
    const recentApps = (rpcData?.recent_applications ?? []).map((app: Record<string, unknown>) => ({
      id: app.id,
      company: app.company_name,
      position: app.job_title,
      status: app.status,
      applied_at: app.applied_at ?? app.created_at,
      offer_url: app.job_url,
    }));

    return NextResponse.json(
      {
        stats: {
          total: totalApps,
          response_rate: responseRate,
          by_status: byStatus,
        },
        recent_applications: recentApps,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
