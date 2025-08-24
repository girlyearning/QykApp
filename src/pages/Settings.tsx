import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ModernTitleWidget } from "@/components/ModernTitleWidget";
import { useTheme, Theme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { signOut, user } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDisplayNameUpdate = async () => {
    if (displayName.trim() === profile?.display_name) return;
    
    setIsUpdating(true);
    try {
      await updateProfile({ display_name: displayName.trim() });
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
      navigate("/auth");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const themes: { id: Theme; name: string }[] = [
    { id: 'light', name: 'Light Mode' },
    { id: 'pink', name: 'Pink Bliss' },
    { id: 'iridescent', name: 'Iridescent Dreams' },
    { id: 'dark', name: 'Midnight Mode' }
  ];

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  // Update displayName when profile changes
  useEffect(() => {
    if (profile?.display_name) {
      setDisplayName(profile.display_name);
    }
  }, [profile]);

  return (
    <div className="min-h-screen bg-gradient-iridescent p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Modern Title Widget */}
        <div className="pt-safe">
          <ModernTitleWidget
            title="Settings"
            description="Customize your QYK experience"
            canGoBack={true}
            backRoute="/"
          />
        </div>

        {/* Authentication */}
        <Card className="glass-card border-0 animate-slide-up">
          <CardHeader>
            <CardTitle className="font-space font-condensed">Account</CardTitle>
            <CardDescription className="font-condensed">
              Manage your account and sign out
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4 font-condensed">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Email</span>
                <span className="text-sm">{user?.email}</span>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <div className="flex gap-2">
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your display name"
                    className="rounded-2xl"
                  />
                  <Button
                    onClick={handleDisplayNameUpdate}
                    disabled={isUpdating || displayName.trim() === profile?.display_name}
                    className="rounded-2xl"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full rounded-2xl font-condensed hover-lift"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* Theme Selection */}
        <Card className="glass-card border-0 animate-slide-up">
          <CardHeader>
            <CardTitle className="font-space font-condensed">Theme Selection</CardTitle>
            <CardDescription className="font-condensed">
              Choose your preferred visual style for the app
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {themes.map((themeOption, index) => (
              <Button
                key={themeOption.id}
                variant={theme === themeOption.id ? "default" : "outline"}
                className={`w-full justify-start hover-lift transition-all duration-300 rounded-2xl ${
                  theme === themeOption.id ? 'ring-2 ring-primary/50' : ''
                }`}
                onClick={() => handleThemeChange(themeOption.id)}
                style={{ '--stagger-delay': index } as React.CSSProperties}
              >
                <span className="font-space font-condensed">{themeOption.name}</span>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="glass-card border-0 animate-slide-up">
          <CardHeader>
            <CardTitle className="font-space font-condensed">About QYK</CardTitle>
            <CardDescription className="font-condensed">
              Your personal writing sanctuary
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm space-y-2 font-condensed">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version</span>
                <span>1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created by</span>
                <span>Vee</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Data Storage</span>
                <span>Supabase Cloud</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <div className="glass-card p-4 rounded-3xl bg-primary/5 border border-primary/20 animate-scale-in">
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-primary font-space font-condensed">Secure & Private</h3>
            <p className="text-xs text-muted-foreground font-condensed">
              Your data is securely stored in the cloud with end-to-end encryption. Only you can access your notes, entries, and confessions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;