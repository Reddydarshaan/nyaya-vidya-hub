import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getProfile, updateProfile, getChatHistory, getSimulatorScores } from "@/lib/supabase-helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Globe, MessageCircle, Gamepad2, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Profile() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("tamil");
  const [chatCount, setChatCount] = useState(0);
  const [scores, setScores] = useState<{ badge: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getProfile(user.id),
      getChatHistory(user.id),
      getSimulatorScores(user.id),
    ]).then(([p, chats, sc]) => {
      setName(p.name);
      setLanguage(p.language_preference);
      setChatCount(chats.length);
      setScores(sc);
    }).finally(() => setLoading(false));
  }, [user]);

  const handleSave = async () => {
    if (!user || !name.trim()) return;
    setSaving(true);
    try {
      await updateProfile(user.id, { name: name.trim(), language_preference: language });
      toast.success("Profile updated! சுயவிவரம் புதுப்பிக்கப்பட்டது!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const badges = {
    gold: scores.filter(s => s.badge === "gold").length,
    silver: scores.filter(s => s.badge === "silver").length,
    bronze: scores.filter(s => s.badge === "bronze").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <User className="h-8 w-8 text-primary" />
          Profile / சுயவிவரம்
        </h1>
      </div>

      <div className="space-y-6">
        {/* Profile info */}
        <Card className="card-shadow border-border/50 animate-fade-in">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Name / பெயர்</Label>
              <Input id="profile-name" value={name} onChange={e => setName(e.target.value)} maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label>Email / மின்னஞ்சல்</Label>
              <Input value={user?.email || ""} disabled className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language Preference / மொழி</Label>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant={language === "tamil" ? "default" : "outline"}
                  onClick={() => setLanguage("tamil")}
                  className={language === "tamil" ? "hero-gradient text-primary-foreground" : ""}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  தமிழ்
                </Button>
                <Button
                  type="button"
                  variant={language === "english" ? "default" : "outline"}
                  onClick={() => setLanguage("english")}
                  className={language === "english" ? "hero-gradient text-primary-foreground" : ""}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  English
                </Button>
              </div>
            </div>
            <Button onClick={handleSave} disabled={saving} className="hero-gradient text-primary-foreground">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card className="card-shadow border-border/50 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <CardHeader>
            <CardTitle>Earned Badges / பதக்கங்கள்</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-3xl mb-1">🥇</p>
                <p className="text-2xl font-bold text-gold">{badges.gold}</p>
                <p className="text-xs text-muted-foreground">Gold</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-3xl mb-1">🥈</p>
                <p className="text-2xl font-bold text-silver">{badges.silver}</p>
                <p className="text-xs text-muted-foreground">Silver</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-3xl mb-1">🥉</p>
                <p className="text-2xl font-bold text-bronze">{badges.bronze}</p>
                <p className="text-xs text-muted-foreground">Bronze</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="card-shadow border-border/50 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <CardHeader>
            <CardTitle>Statistics / புள்ளிவிவரங்கள்</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                <MessageCircle className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xl font-bold">{chatCount}</p>
                  <p className="text-xs text-muted-foreground">Questions Asked</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                <Gamepad2 className="h-5 w-5 text-secondary" />
                <div>
                  <p className="text-xl font-bold">{scores.length}</p>
                  <p className="text-xs text-muted-foreground">Scenarios Completed</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
