import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Layout, Globe, Save, Eye } from "lucide-react";
import { WebsitePreview } from "@/components/WebsitePreview";

export default function Designer() {
  const [hasChanges, setHasChanges] = useState(false);
  const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false);
  const [websiteSettings, setWebsiteSettings] = useState({
    siteName: "My Website",
    tagline: "Building something amazing",
    primaryColor: "#667eea",
    secondaryColor: "#764ba2",
    aboutText: "This is a preview of your website. Customize the settings to see your content appear here.",
  });

  const handleToggleFullscreen = () => {
    setIsPreviewFullscreen(!isPreviewFullscreen);
  };

  return (
    <div className="min-h-screen bg-background">
      {isPreviewFullscreen ? (
        <WebsitePreview
          settings={websiteSettings}
          isFullscreen={true}
          onToggleFullscreen={handleToggleFullscreen}
        />
      ) : (
        <div className="p-8">
          <div className="max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Website Designer</h1>
                <p className="text-muted-foreground">Create beautiful websites for your WHOP business</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" disabled={!hasChanges}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button>
                  <Globe className="w-4 h-4 mr-2" />
                  Publish
                </Button>
              </div>
            </div>

            {/* Main Content - Split Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Left Sidebar - Design Tools */}
              <div className="xl:col-span-1 space-y-6">
                {/* Design Tools */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="w-5 h-5" />
                      Design Tools
                    </CardTitle>
                    <CardDescription>Customize your website appearance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Site Name</label>
                      <input
                        type="text"
                        value={websiteSettings.siteName}
                        onChange={(e) => {
                          setWebsiteSettings({ ...websiteSettings, siteName: e.target.value });
                          setHasChanges(true);
                        }}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="Enter site name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Tagline</label>
                      <input
                        type="text"
                        value={websiteSettings.tagline}
                        onChange={(e) => {
                          setWebsiteSettings({ ...websiteSettings, tagline: e.target.value });
                          setHasChanges(true);
                        }}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="Enter tagline"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Primary Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={websiteSettings.primaryColor}
                          onChange={(e) => {
                            setWebsiteSettings({ ...websiteSettings, primaryColor: e.target.value });
                            setHasChanges(true);
                          }}
                          className="h-10 w-20 border rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={websiteSettings.primaryColor}
                          onChange={(e) => {
                            setWebsiteSettings({ ...websiteSettings, primaryColor: e.target.value });
                            setHasChanges(true);
                          }}
                          className="flex-1 px-3 py-2 border rounded-md font-mono text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Secondary Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={websiteSettings.secondaryColor}
                          onChange={(e) => {
                            setWebsiteSettings({ ...websiteSettings, secondaryColor: e.target.value });
                            setHasChanges(true);
                          }}
                          className="h-10 w-20 border rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={websiteSettings.secondaryColor}
                          onChange={(e) => {
                            setWebsiteSettings({ ...websiteSettings, secondaryColor: e.target.value });
                            setHasChanges(true);
                          }}
                          className="flex-1 px-3 py-2 border rounded-md font-mono text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">About Text</label>
                      <textarea
                        value={websiteSettings.aboutText}
                        onChange={(e) => {
                          setWebsiteSettings({ ...websiteSettings, aboutText: e.target.value });
                          setHasChanges(true);
                        }}
                        className="w-full px-3 py-2 border rounded-md min-h-[100px]"
                        placeholder="Enter about text"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Layout Options */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layout className="w-5 h-5" />
                      Layouts
                    </CardTitle>
                    <CardDescription>Choose a template or layout</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Layout options coming soon...</p>
                  </CardContent>
                </Card>
              </div>

              {/* Right Side - Preview */}
              <div className="xl:col-span-2">
                <Card className="h-full">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="w-5 h-5" />
                        Live Preview
                      </CardTitle>
                      <CardDescription>See how your website looks in real-time</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleToggleFullscreen}
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Fullscreen
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    <WebsitePreview
                      settings={websiteSettings}
                      template="default"
                      isFullscreen={false}
                      onToggleFullscreen={handleToggleFullscreen}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

