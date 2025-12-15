import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Globe, Sparkles, Code } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            WHOP Website Builder
          </h1>
          <p className="text-xl text-muted-foreground">
            Create beautiful websites for your WHOP business
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 py-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Sparkles className="w-5 h-5" />
            <span>Easy to Use</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Code className="w-5 h-5" />
            <span>Customizable</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Globe className="w-5 h-5" />
            <span>Live Preview</span>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-muted-foreground">
            This app is designed to run within the WHOP platform.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              To use the Website Builder:
            </p>
            <ol className="text-sm text-muted-foreground space-y-1 text-left max-w-md mx-auto">
              <li>1. Access it from your WHOP Dashboard</li>
              <li>2. Or configure your WHOP integration</li>
            </ol>
          </div>
        </div>

        <div className="pt-8">
          <div className="inline-flex flex-col gap-2">
            <Button asChild>
              <a href="https://whop.com" target="_blank" rel="noopener noreferrer">
                Learn more about WHOP
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
