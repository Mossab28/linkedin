"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface UserProfile {
  name: string | null;
  email: string | null;
}

interface UseUserReturn {
  user: UserProfile | null;
  loading: boolean;
  error: Error | null;
  logout: () => Promise<void>;
}

function extractProfile(authUser: { email?: string; user_metadata?: Record<string, unknown> }): UserProfile {
  return {
    name:
      (authUser.user_metadata?.full_name as string) ??
      (authUser.user_metadata?.name as string) ??
      authUser.email?.split("@")[0] ??
      null,
    email: authUser.email ?? null,
  };
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function getUser() {
      try {
        const {
          data: { user: authUser },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          setError(new Error(userError.message));
        } else if (authUser) {
          setUser(extractProfile(authUser));
        } else {
          setUser(null);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch user")
        );
      } finally {
        setLoading(false);
      }
    }

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(extractProfile(session.user));
      } else {
        setUser(null);
      }
      setLoading(false);
      setError(null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logout = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }, []);

  return { user, loading, error, logout };
}
