import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useQykQuotes } from "@/hooks/useQykQuotes";
import { QykQuotes } from "@/lib/qykQuotes";
import { useEffect } from "react";

export const QykQuotesSettings = () => {
  const { enabled, hour, minute, setEnabled, setTime, requestPermissions } = useQykQuotes();

  useEffect(() => { requestPermissions(); }, [requestPermissions]);

  const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

  return (
    <Card className="glass-card border-0 animate-slide-up">
      <CardHeader>
        <CardTitle className="font-display font-condensed">Qyk Quotes</CardTitle>
        <CardDescription className="font-condensed">Quick, daily check-ins</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 max-w-md mx-auto">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="font-condensed">Enable notifications</Label>
            <div className="text-xs text-muted-foreground font-condensed">Daily reminder at your chosen time</div>
          </div>
          <Switch checked={enabled} onCheckedChange={(v) => setEnabled(!!v)} />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="qyk-quotes-time" className="font-condensed">Reminder time</Label>
          <input
            id="qyk-quotes-time"
            type="time"
            value={timeStr}
            onChange={(e) => {
              const [h, m] = e.target.value.split(":").map((n) => parseInt(n, 10));
              if (!Number.isNaN(h) && !Number.isNaN(m)) setTime(h, m);
            }}
            className="rounded-2xl border px-3 py-2 bg-background w-28 text-center"
          />
        </div>

        <div className="flex items-center justify-end">
          <Button
            variant="outline"
            className="rounded-2xl"
            onClick={async () => {
              try {
                await QykQuotes.requestPermissions();
              } catch {}
              try {
                await QykQuotes.testNotify();
              } catch {}
            }}
          >
            Send test notification
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
