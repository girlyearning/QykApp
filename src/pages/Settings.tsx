import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme, Theme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Palette, Sparkles, Moon, Check, ArrowLeft, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { signOut, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const themes: { id: Theme; name: string; description: string; icon: any; preview: string }[] = [
    {
      id: 'light',
      name: 'Light Mode',
      description: 'Clean and bright interface (Default)',
      icon: Sparkles,
      preview: 'bg-gradient-to-br from-gray-50 to-gray-100'
    },
    {
      id: 'pink',
      name: 'Pink Bliss',
      description: 'Warm pink tones with soft gradients',
      icon: Palette,
      preview: 'bg-gradient-to-br from-pink-200 to-rose-300'
    },
    {
      id: 'iridescent',
      name: 'Iridescent Dreams',
      description: 'Shimmering rainbow-like colors',
      icon: Sparkles,
      preview: 'bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200'
    },
    {
      id: 'dark',
      name: 'Midnight Mode',
      description: 'Dark theme for night writing',
      icon: Moon,
      preview: 'bg-gradient-to-br from-gray-800 to-gray-900'
    }
  ];

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <div className="min-h-screen bg-gradient-iridescent p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 pt-safe animate-fade-in">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="rounded-full p-2 hover-lift"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-primary font-space font-extra-condensed">Settings</h1>
            <p className="text-sm text-muted-foreground font-medium font-overused font-condensed">
              Customize your QYK experience
            </p>
          </div>
        </div>

        {/* Authentication */}
        <Card className="glass-card border-0 animate-slide-up">
          <CardHeader>
            <CardTitle className="font-space font-condensed">Account</CardTitle>
            <CardDescription className="font-overused font-condensed">
              Manage your account and sign out
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm space-y-2 font-overused font-condensed">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span>{user?.email}</span>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full rounded-2xl font-overused font-condensed hover-lift"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* Theme Selection */}
        <Card className="glass-card border-0 animate-slide-up">
          <CardHeader>
            <CardTitle className="font-space font-condensed flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Theme Selection
            </CardTitle>
            <CardDescription className="font-overused font-condensed">
              Choose your preferred visual style for the app
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {themes.map((themeOption, index) => (
              <div
                key={themeOption.id}
                style={{ '--stagger-delay': index } as React.CSSProperties}
                className="animate-slide-up"
              >
                <Button
                  variant={theme === themeOption.id ? "default" : "outline"}
                  className={`w-full h-auto p-4 justify-start hover-lift transition-all duration-300 ${
                    theme === themeOption.id ? 'ring-2 ring-primary/50 scale-105' : ''
                  }`}
                  onClick={() => handleThemeChange(themeOption.id)}
                >
                  <div className="flex items-center gap-4 w-full">
                    {/* Theme Preview */}
                    <div className={`w-12 h-12 rounded-2xl ${themeOption.preview} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <themeOption.icon className="w-6 h-6 text-white drop-shadow-lg" />
                      </div>
                    </div>
                    
                    {/* Theme Info */}
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold font-space font-condensed">{themeOption.name}</h3>
                        {theme === themeOption.id && (
                          <Check className="w-4 h-4 text-primary animate-bounce-in" />
                        )}
                      </div>
                      <p className="text-sm opacity-80 font-overused font-condensed">
                        {themeOption.description}
                      </p>
                    </div>
                  </div>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="glass-card border-0 animate-slide-up">
          <CardHeader>
            <CardTitle className="font-space font-condensed">About QYK</CardTitle>
            <CardDescription className="font-overused font-condensed">
              Your personal writing sanctuary
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm space-y-2 font-overused font-condensed">
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
            <p className="text-xs text-muted-foreground font-overused font-condensed">
              Your data is securely stored in the cloud with end-to-end encryption. Only you can access your notes, entries, and confessions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;