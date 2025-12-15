// WHOP SDK integration for iframe communication
// Uses postMessage API to communicate with WHOP parent frame

interface WhopUrlData {
  companyRoute: string;
  experienceRoute: string;
  experienceId: string;
  viewType: "app" | "admin" | "analytics" | "preview";
  baseHref: string;
  fullHref: string;
}

let sdkInitialized = false;
let pendingRequests = new Map<string, { resolve: (data: unknown) => void; reject: (error: Error) => void }>();

// Message handler for responses from WHOP parent
function handleMessage(event: MessageEvent) {
  // Only accept messages from whop.com
  if (!event.origin.includes("whop.com")) {
    return;
  }

  const data = event.data;
  if (data?.source === "typed-transport" && data?.id) {
    const pending = pendingRequests.get(data.id);
    if (pending) {
      if (data.error) {
        pending.reject(new Error(data.error));
      } else {
        pending.resolve(data.response);
      }
      pendingRequests.delete(data.id);
    }
  }
}

// Initialize the SDK - sets up message listener
export function initWhopSdk(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  if (sdkInitialized) {
    return true;
  }

  try {
    window.addEventListener("message", handleMessage);
    sdkInitialized = true;
    console.log("[WHOP SDK] Initialized message listener");
    return true;
  } catch (error) {
    console.error("[WHOP SDK] Failed to initialize:", error);
    return false;
  }
}

// Send a message to the WHOP parent frame
function sendToParent<T>(event: string, request?: unknown): Promise<T> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || window.parent === window) {
      reject(new Error("Not in an iframe"));
      return;
    }

    const id = crypto.randomUUID();
    const timeout = setTimeout(() => {
      pendingRequests.delete(id);
      reject(new Error("Request timeout"));
    }, 5000);

    pendingRequests.set(id, {
      resolve: (data) => {
        clearTimeout(timeout);
        resolve(data as T);
      },
      reject: (error) => {
        clearTimeout(timeout);
        reject(error);
      },
    });

    window.parent.postMessage(
      {
        source: "typed-transport",
        id,
        event,
        request,
      },
      "*"
    );
  });
}

// Check if we're running inside a WHOP iframe
export function isInWhopIframe(): boolean {
  try {
    // If we're in an iframe, window.self !== window.top
    return window.self !== window.top;
  } catch {
    // Cross-origin check throws error when in iframe
    return true;
  }
}

// Get context from WHOP parent frame using postMessage
export async function getWhopContext(): Promise<{
  companyId: string;
  experienceId: string;
  viewType: "app" | "admin" | "analytics" | "preview";
} | null> {
  if (!sdkInitialized) {
    initWhopSdk();
  }

  if (!isInWhopIframe()) {
    console.log("[WHOP SDK] Not in iframe, using URL fallback");
    const companyId = extractCompanyIdFromUrl();
    if (companyId) {
      return {
        companyId,
        experienceId: "",
        viewType: "admin",
      };
    }
    return null;
  }

  try {
    console.log("[WHOP SDK] Requesting URL data from parent...");
    const urlData = await sendToParent<WhopUrlData>("getTopLevelUrlData", {});
    console.log("[WHOP SDK] Received URL data:", urlData);

    return {
      companyId: urlData.companyRoute,
      experienceId: urlData.experienceId,
      viewType: urlData.viewType,
    };
  } catch (error) {
    console.error("[WHOP SDK] Failed to get context from parent:", error);
    
    // Fallback to URL extraction
    const companyId = extractCompanyIdFromUrl();
    if (companyId) {
      return {
        companyId,
        experienceId: "",
        viewType: "admin",
      };
    }
    return null;
  }
}

// Extract company ID from URL path (fallback method)
export function extractCompanyIdFromUrl(): string | null {
  const pathname = window.location.pathname;

  // Match patterns like /dashboard/biz_xxx or /whop-dashboard/biz_xxx
  const dashboardMatch = pathname.match(/(?:\/dashboard\/|\/whop-dashboard\/)(biz_[a-zA-Z0-9]+)/);
  if (dashboardMatch) {
    return dashboardMatch[1];
  }

  // Match direct path pattern like /biz_xxx (WHOP passes companyId directly in path)
  const directMatch = pathname.match(/^\/(biz_[a-zA-Z0-9]+)/);
  if (directMatch) {
    return directMatch[1];
  }

  // Also check URL params
  const params = new URLSearchParams(window.location.search);
  const companyId = params.get("companyId") || params.get("company_id");
  if (companyId?.startsWith("biz_")) {
    return companyId;
  }

  return null;
}

// Cleanup function
export function cleanupWhopSdk(): void {
  if (sdkInitialized) {
    window.removeEventListener("message", handleMessage);
    pendingRequests.clear();
    sdkInitialized = false;
  }
}

// Open external URL (communicates with WHOP parent to open URL)
export async function openExternalUrl(url: string, newTab = false): Promise<void> {
  if (!isInWhopIframe()) {
    // Not in iframe, just open directly
    if (newTab) {
      window.open(url, "_blank");
    } else {
      window.location.href = url;
    }
    return;
  }

  try {
    await sendToParent("openExternalUrl", { url, newTab });
  } catch {
    // Fallback to direct navigation
    if (newTab) {
      window.open(url, "_blank");
    } else {
      window.location.href = url;
    }
  }
}

