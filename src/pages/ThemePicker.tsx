import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ModernTitleWidget } from "@/components/ModernTitleWidget";
import { useTheme, Theme } from "@/contexts/ThemeContext";

const ThemePicker = () => {
  const { theme, setTheme } = useTheme();

  const themes: { id: Theme; name: string; preview: string }[] = [
    { id: 'light', name: 'Light Mode', preview: 'bg-slate-100 border-slate-300' },
    { id: 'dark', name: 'Midnight Mode', preview: 'bg-slate-800 border-slate-600' },
    { id: 'blackout', name: 'BlackOut', preview: 'bg-black border-neutral-800' },
    { id: 'pink-blackout', name: 'Pink BlackOut', preview: 'bg-black border-pink-500 ring-1 ring-pink-400' },
    { id: 'pink', name: 'Pink Bliss', preview: 'bg-pink-100 border-pink-300' },
    { id: 'hot-pink-paradise', name: 'Hot Pink Paradise', preview: 'bg-gradient-to-br from-pink-300 via-pink-200 to-green-200 border-2 border-pink-400 shadow-sm' },
    { id: 'iridescent', name: 'Iridescent Dreams', preview: 'bg-purple-100 border-purple-300' },
    { id: 'lime-green', name: 'Lime Green', preview: 'bg-lime-300 border-lime-500' },
    { id: 'baby-blue', name: 'Baby Blue', preview: 'bg-sky-200 border-sky-400' },
    { id: 'dark-purple', name: 'Dark Purple', preview: 'bg-purple-600 border-purple-400' },
    { id: 'dark-purple-night', name: 'Dark Purple Night', preview: 'bg-black border-purple-700 ring-1 ring-purple-500' },
    { id: 'coffee-core', name: 'Coffee Core', preview: 'bg-[hsl(40,50%,95%)] border-[hsl(35,30%,85%)]' },
  ];

  return (
    <div className="min-h-screen bg-gradient-iridescent p-4 pb-safe">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="pt-safe pl-safe pr-safe">
          <ModernTitleWidget
            title="Theme"
            description="Choose your preferred visual style"
            canGoBack={true}
            backRoute="/settings"
          />
        </div>

        <Card className="glass-card border-0 animate-slide-up">
          <CardHeader>
            <CardTitle className="font-display font-condensed">Theme Selection</CardTitle>
            <CardDescription className="font-condensed">
              Choose a theme to personalize your experience
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
                onClick={() => setTheme(themeOption.id)}
                style={{ '--stagger-delay': index } as React.CSSProperties}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${themeOption.preview}`}></div>
                  <span className="font-display font-condensed">{themeOption.name}</span>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ThemePicker;
