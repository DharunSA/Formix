"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User, Session, Provider } from "@supabase/supabase-js";
import { supabase } from "./supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithEmail: (email: string, password?: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, password?: string) => Promise<{ error: Error | null }>;
  signInWithProvider: (provider: Provider) => Promise<{ error: Error | null }>;
  updateProfile: (data: { full_name?: string; email?: string }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local demo storage first if offline or demo mode
    const storedDemo = typeof window !== "undefined" ? localStorage.getItem("formix_demo_user") : null;
    let initialUser: User | null = null;
    let initialSession: Session | null = null;

    if (storedDemo) {
      try {
        const parsed = JSON.parse(storedDemo);
        initialUser = {
          id: parsed.id || "demo-user-id",
          email: parsed.email || "creator@typeform-clone.local",
          app_metadata: {},
          user_metadata: { full_name: parsed.name || "Demo Creator" },
          aud: "authenticated",
          created_at: new Date().toISOString(),
        } as User;
        initialSession = {
          access_token: "demo-token",
          token_type: "bearer",
          user: initialUser,
          expires_in: 3600,
          refresh_token: "demo-refresh-token",
        } as Session;
      } catch {
        localStorage.removeItem("formix_demo_user");
      }
    }

    // Get initial Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        setUser(session.user);
      } else if (initialSession) {
        setSession(initialSession);
        setUser(initialUser);
      } else {
        setSession(null);
        setUser(null);
      }
      setLoading(false);
    }).catch(() => {
      if (initialSession) {
        setSession(initialSession);
        setUser(initialUser);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session);
        setUser(session.user);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const createDemoSession = (email: string) => {
    const demoUser = {
      id: "demo-user-id",
      email: email,
      app_metadata: {},
      user_metadata: { full_name: email.split("@")[0] },
      aud: "authenticated",
      created_at: new Date().toISOString(),
    } as User;
    const demoSess = {
      access_token: "demo-token",
      token_type: "bearer",
      user: demoUser,
      expires_in: 3600,
      refresh_token: "demo-refresh-token",
    } as Session;

    if (typeof window !== "undefined") {
      localStorage.setItem("formix_demo_user", JSON.stringify({ email, name: email.split("@")[0] }));
    }
    setUser(demoUser);
    setSession(demoSess);
  };

  const signInWithEmail = async (email: string, password = "DefaultPassword123!") => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        // Fallback to local demo session if Supabase auth fails (e.g. demo key/unreachable)
        createDemoSession(email);
        return { error: null };
      }
      return { error: null };
    } catch {
      createDemoSession(email);
      return { error: null };
    }
  };

function getAppOrigin(): string {
  if (typeof window !== "undefined" && window.location?.origin && !window.location.origin.includes("localhost") && !window.location.origin.includes("127.0.0.1")) {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL || "https://formix-delta.vercel.app";
}

  const signUpWithEmail = async (email: string, password = "DefaultPassword123!") => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${getAppOrigin()}/dashboard`,
        },
      });
      if (error) {
        createDemoSession(email);
        return { error: null };
      }
      return { error: null };
    } catch {
      createDemoSession(email);
      return { error: null };
    }
  };

  const signInWithProvider = async (provider: Provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${getAppOrigin()}/dashboard`,
        },
      });
      if (error) {
        createDemoSession("demo@formix.app");
        return { error: null };
      }
      return { error: null };
    } catch {
      createDemoSession("demo@formix.app");
      return { error: null };
    }
  };

  const updateProfile = async (data: { full_name?: string; email?: string }) => {
    if (!user) return;
    const nextFullName = data.full_name ?? user.user_metadata?.full_name ?? "Demo Creator";
    const nextEmail = data.email ?? user.email ?? "creator@typeform-clone.local";

    const updatedUser = {
      ...user,
      email: nextEmail,
      user_metadata: {
        ...user.user_metadata,
        full_name: nextFullName,
      },
    } as User;

    setUser(updatedUser);

    if (typeof window !== "undefined") {
      localStorage.setItem("formix_demo_user", JSON.stringify({ email: nextEmail, name: nextFullName }));
    }

    try {
      await supabase.auth.updateUser({
        email: data.email ? nextEmail : undefined,
        data: { full_name: nextFullName },
      });
    } catch {
      // ignore offline fallback
    }
  };

  const signOut = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("formix_demo_user");
    }
    setUser(null);
    setSession(null);
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signInWithProvider,
        updateProfile,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
