import { useEffect, useRef, useMemo } from "react";
import { Globe, Maximize2, Minimize2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WebsitePreviewProps {
  settings?: Record<string, unknown>;
  template?: string;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  className?: string;
}

export function WebsitePreview({
  settings = {},
  template = "default",
  isFullscreen = false,
  onToggleFullscreen,
  className,
}: WebsitePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Memoize website content to prevent unnecessary re-renders
  const websiteContent = useMemo(() => {

    // Generate website content based on settings
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${(settings.siteName as string) || "My Website"}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .header {
          background: linear-gradient(135deg, ${(settings.primaryColor as string) || "#667eea"} 0%, ${(settings.secondaryColor as string) || "#764ba2"} 100%);
          color: white;
          padding: 4rem 2rem;
          text-align: center;
        }
        .header h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }
        .header p {
          font-size: 1.25rem;
          opacity: 0.9;
        }
        .content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 2rem;
        }
        .section {
          margin-bottom: 4rem;
        }
        .section h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: ${(settings.primaryColor as string) || "#667eea"};
        }
        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }
        .feature-card {
          padding: 2rem;
          border-radius: 8px;
          background: #f8f9fa;
          border: 1px solid #e9ecef;
        }
        .feature-card h3 {
          margin-bottom: 0.5rem;
          color: ${(settings.primaryColor as string) || "#667eea"};
        }
        .footer {
          background: #2d3748;
          color: white;
          padding: 2rem;
          text-align: center;
          margin-top: 4rem;
        }
        @media (max-width: 768px) {
          .header h1 { font-size: 2rem; }
          .header p { font-size: 1rem; }
          .content { padding: 2rem 1rem; }
        }
      </style>
    </head>
    <body>
      <header class="header">
        <h1>${(settings.siteName as string) || "Welcome to My Website"}</h1>
        <p>${(settings.tagline as string) || "Building something amazing"}</p>
      </header>
      
      <main class="content">
        <section class="section">
          <h2>About</h2>
          <p>${(settings.aboutText as string) || "This is a preview of your website. Customize the settings to see your content appear here."}</p>
        </section>
        
        <section class="section">
          <h2>Features</h2>
          <div class="features">
            <div class="feature-card">
              <h3>Feature One</h3>
              <p>Describe your first key feature here.</p>
            </div>
            <div class="feature-card">
              <h3>Feature Two</h3>
              <p>Describe your second key feature here.</p>
            </div>
            <div class="feature-card">
              <h3>Feature Three</h3>
              <p>Describe your third key feature here.</p>
            </div>
          </div>
        </section>
      </main>
      
      <footer class="footer">
        <p>&copy; 2025 ${(settings.siteName as string) || "My Website"}. All rights reserved.</p>
      </footer>
    </body>
    </html>
  `;
  }, [settings]);

  // Update iframe content when settings change (backup method)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (iframeRef.current?.contentDocument) {
        try {
          iframeRef.current.contentDocument.open();
          iframeRef.current.contentDocument.write(websiteContent);
          iframeRef.current.contentDocument.close();
        } catch (e) {
          // If we can't write to the document, srcDoc will handle it
          console.log("Could not update iframe content directly");
        }
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [websiteContent]);

  const handleRefresh = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.location.reload();
    }
  };

  return (
    <div
      className={cn(
        "relative bg-white rounded-lg border shadow-lg overflow-hidden",
        isFullscreen && "fixed inset-0 z-50 rounded-none",
        className
      )}
    >
      {/* Preview Toolbar */}
      <div className="flex items-center justify-between bg-gray-100 px-4 py-2 border-b">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            {isFullscreen ? "Fullscreen Preview" : "Preview"}
          </span>
          <span className="text-xs text-gray-500 ml-2 hidden sm:inline">
            Desktop
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="h-7 px-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
          {onToggleFullscreen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleFullscreen}
              className="h-7 px-2"
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Preview Content */}
      <div
        className={cn(
          "bg-gray-100",
          isFullscreen ? "h-[calc(100vh-48px)]" : "h-[600px]"
        )}
      >
        <iframe
          key={JSON.stringify(settings)}
          ref={iframeRef}
          srcDoc={websiteContent}
          className="w-full h-full border-0"
          title="Website Preview"
          sandbox="allow-same-origin allow-scripts"
        />
      </div>
    </div>
  );
}

