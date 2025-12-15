import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { 
  initWhopSdk, 
  getWhopContext as getWhopContextFromSdk, 
  isInWhopIframe,
  extractCompanyIdFromUrl,
  cleanupWhopSdk 
} from "@/lib/whop-sdk";

interface WhopUser {
  id: string;
  email: string;
  name: string;
}

interface WhopCompany {
  id: string;
  title?: string;
}

interface WhopContextType {
  // Authentication state
  isWhopEmbed: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // User info
  user: User | null;
  session: Session | null;
  whopUser: WhopUser | null;
  
  // Company info
  companyId: string | null;
  company: WhopCompany | null;
  viewType: "app" | "admin" | "analytics" | "preview" | null;
  
  // Actions
  initializeWhopAuth: () => Promise<boolean>;
  signOut: () => Promise<void>;
}

const WhopContext = createContext<WhopContextType | undefined>(undefined);

export function WhopProvider({ children }: { children: ReactNode }) {
  // Auth state
  const [isWhopEmbed, setIsWhopEmbed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // User state
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [whopUser, setWhopUser] = useState<WhopUser | null>(null);
  
  // Company state
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [company, setCompany] = useState<WhopCompany | null>(null);
  const [viewType, setViewType] = useState<WhopContextType["viewType"]>(null);

  // Check if URL matches WHOP dashboard patterns
  const isWhopRoute = useCallback(() => {
    const pathname = window.location.pathname;
    // Match /dashboard/biz_xxx pattern (WHOP's standard Dashboard View format)
    return pathname.match(/^\/dashboard\/biz_[a-zA-Z0-9]+/);
  }, []);

  // Initialize WHOP authentication
  const initializeWhopAuth = useCallback(async (): Promise<boolean> => {
    console.log("[WhopContext] Starting WHOP auth initialization...");
    setIsLoading(true);
    setError(null);

    try {
      // First, try to get context from the SDK
      const sdk = initWhopSdk();
      let whopContext = null;
      
      if (sdk) {
        console.log("[WhopContext] SDK initialized, getting context...");
        whopContext = await getWhopContextFromSdk();
      }

      // Fallback: extract from URL
      let resolvedCompanyId = whopContext?.companyId || extractCompanyIdFromUrl();
      
      if (!resolvedCompanyId) {
        console.error("[WhopContext] No company ID found");
        setError("Could not determine company. Please access from WHOP Dashboard.");
        setIsLoading(false);
        return false;
      }

      console.log("[WhopContext] Company ID:", resolvedCompanyId);
      setCompanyId(resolvedCompanyId);
      setViewType(whopContext?.viewType || "admin");
      setIsWhopEmbed(true);

      // Call edge function to verify and get/create Supabase session
      console.log("[WhopContext] Verifying with backend...");
      const { data, error: fnError } = await supabase.functions.invoke("whop-auth", {
        body: { 
          companyId: resolvedCompanyId,
        },
      });

      if (fnError || !data?.success) {
        console.error("[WhopContext] Auth verification failed:", fnError || data?.error);
        setError(data?.error || fnError?.message || "Authentication failed");
        setIsLoading(false);
        return false;
      }

      console.log("[WhopContext] Auth verified, setting session...");
      
      // Set WHOP user info
      if (data.whopUser) {
        setWhopUser(data.whopUser);
      }
      
      // Set company info
      if (data.company) {
        setCompany(data.company);
      }

      // Sign in to Supabase with the returned session
      if (data.session) {
        const { data: authData, error: authError } = await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });

        if (authError) {
          console.error("[WhopContext] Failed to set session:", authError);
          setError("Failed to establish session");
          setIsLoading(false);
          return false;
        }

        setUser(authData.user);
        setSession(authData.session);
      }

      setIsAuthenticated(true);
      setIsLoading(false);
      console.log("[WhopContext] WHOP auth complete!");
      return true;
    } catch (err) {
      console.error("[WhopContext] Auth error:", err);
      setError(err instanceof Error ? err.message : "Authentication failed");
      setIsLoading(false);
      return false;
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setWhopUser(null);
    setIsAuthenticated(false);
    setCompany(null);
    cleanupWhopSdk();
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Only set authenticated if we have a valid session
        if (session?.user && !isLoading) {
          setIsAuthenticated(true);
        } else if (!session && event === "SIGNED_OUT") {
          setIsAuthenticated(false);
        }
      }
    );

    // Check for existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // If not in WHOP context and has session, mark as authenticated
      if (session && !isWhopRoute()) {
        setIsAuthenticated(true);
        setIsLoading(false);
      } else if (!isWhopRoute()) {
        // Not in WHOP context and no session
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isWhopRoute, isLoading]);

  // Cleanup SDK on unmount
  useEffect(() => {
    return () => {
      cleanupWhopSdk();
    };
  }, []);

  return (
    <WhopContext.Provider
      value={{
        isWhopEmbed,
        isAuthenticated,
        isLoading,
        error,
        user,
        session,
        whopUser,
        companyId,
        company,
        viewType,
        initializeWhopAuth,
        signOut,
      }}
    >
      {children}
    </WhopContext.Provider>
  );
}

export function useWhop() {
  const context = useContext(WhopContext);
  if (context === undefined) {
    throw new Error("useWhop must be used within a WhopProvider");
  }
  return context;
}

