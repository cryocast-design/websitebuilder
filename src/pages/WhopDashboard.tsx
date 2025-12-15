import { useEffect } from "react";
import { useWhop } from "@/contexts/WhopContext";
import { Loader2, AlertCircle, Shield } from "lucide-react";
import Designer from "./Designer";
import { Button } from "@/components/ui/button";

export default function WhopDashboard() {
  const { 
    isAuthenticated, 
    isLoading, 
    error, 
    initializeWhopAuth,
    company,
    whopUser,
  } = useWhop();

  useEffect(() => {
    // Initialize WHOP authentication when component mounts
    console.log("[WhopDashboard] Component mounted, initializing auth...");
    initializeWhopAuth();
  }, [initializeWhopAuth]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <Shield className="h-5 w-5 text-primary/50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="space-y-1">
            <p className="text-foreground font-medium">Connecting to WHOP...</p>
            <p className="text-sm text-muted-foreground">Verifying your access</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md px-4">
          <div className="h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">Authentication Error</h1>
          <p className="text-muted-foreground">{error}</p>
          <div className="pt-4 space-y-2">
            <Button 
              onClick={() => initializeWhopAuth()} 
              variant="outline"
              className="w-full"
            >
              Try Again
            </Button>
            <p className="text-xs text-muted-foreground">
              Make sure you're accessing this from your WHOP Dashboard
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated - render designer
  if (isAuthenticated) {
    return (
      <div className="whop-dashboard-container">
        {/* Optional: Show WHOP context info in dev */}
        {import.meta.env.DEV && (
          <div className="fixed bottom-2 right-2 text-xs bg-background/80 backdrop-blur p-2 rounded border z-50">
            <div>Company: {company?.title || company?.id}</div>
            <div>User: {whopUser?.name || whopUser?.email}</div>
          </div>
        )}
        <Designer />
      </div>
    );
  }

  // Not authenticated - shouldn't reach here normally
  return null;
}

