import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getProfile, getChatHistory, getSimulatorScores } from "@/lib/supabase-helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Gamepad2, Award, FileDown, Loader2, TrendingUp } from "lucide-react";
import { jsPDF } from "jspdf";
import { toast } from "sonner";

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<{ name: string; badges: unknown } | null>(null);
  const [chatCount, setChatCount] = useState(0);
  const [scores, setScores] = useState<{ scenario: string; score: number; badge: string; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getProfile(user.id),
      getChatHistory(user.id),
      getSimulatorScores(user.id),
    ]).then(([p, chats, sc]) => {
      setProfile(p);
      setChatCount(chats.length);
      setScores(sc);
    }).catch(() => toast.error("Failed to load data"))
      .finally(() => setLoading(false));
  }, [user]);

  const rightsScore = scores.length > 0
    ? Math.round(scores.reduce((sum, s) => sum + Number(s.score), 0) / scores.length)
    : 0;

  const bestBadge = scores.length > 0
    ? (rightsScore >= 80 ? "🥇 Gold" : rightsScore >= 50 ? "🥈 Silver" : "🥉 Bronze")
    : "—";

  const generateCertificate = () => {
    const doc = new jsPDF();
    doc.setFontSize(28);
    doc.setTextColor(30, 64, 175);
    doc.text("NyayaVidya", 105, 40, { align: "center" });
    doc.setFontSize(16);
    doc.setTextColor(100);
    doc.text("Certificate of Legal Awareness", 105, 55, { align: "center" });
    doc.setDrawColor(30, 64, 175);
    doc.line(30, 62, 180, 62);

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(`Awarded to: ${profile?.name || "Student"}`, 105, 85, { align: "center" });
    doc.text(`Rights Score: ${rightsScore}/100`, 105, 100, { align: "center" });
    doc.text(`Badge: ${bestBadge}`, 105, 115, { align: "center" });
    doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`, 105, 130, { align: "center" });
    doc.text(`Scenarios Completed: ${scores.length}`, 105, 145, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("This is for educational purposes only. Not legal advice.", 105, 180, { align: "center" });
    doc.text("Always consult professionals or call 15100.", 105, 188, { align: "center" });

    doc.save("NyayaVidya_Certificate.pdf");
    toast.success("Certificate downloaded! சான்றிதழ் பதிவிறக்கம் செய்யப்பட்டது!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = [
    { label: "Questions Asked", labelTa: "கேள்விகள்", value: chatCount, icon: MessageCircle, color: "text-primary" },
    { label: "Scenarios Done", labelTa: "காட்சிகள்", value: scores.length, icon: Gamepad2, color: "text-secondary" },
    { label: "Rights Score", labelTa: "மதிப்பெண்", value: `${rightsScore}/100`, icon: TrendingUp, color: "text-success" },
    { label: "Best Badge", labelTa: "சிறந்த பதக்கம்", value: bestBadge, icon: Award, color: "text-gold" },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Welcome */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold">
          வணக்கம், <span className="text-gradient">{profile?.name || "Student"}</span>! 👋
        </h1>
        <p className="text-muted-foreground mt-1">Welcome to your legal awareness dashboard</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <Card key={s.label} className="card-shadow hover:card-hover-shadow transition-shadow border-border/50" style={{ animationDelay: `${i * 100}ms` }}>
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-2">
                <s.icon className={`h-5 w-5 ${s.color}`} />
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.labelTa}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Certificate */}
      <Card className="card-shadow border-border/50 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Generate Certificate / சான்றிதழ்
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Download your personalized NyayaVidya certificate with your name, score, and badge.
          </p>
          <Button onClick={generateCertificate} className="hero-gradient text-primary-foreground">
            <FileDown className="h-4 w-4 mr-2" />
            Download PDF Certificate
          </Button>
        </CardContent>
      </Card>

      {/* Recent scores */}
      {scores.length > 0 && (
        <Card className="card-shadow border-border/50">
          <CardHeader>
            <CardTitle>Recent Activity / சமீபத்திய செயல்பாடு</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scores.slice(0, 5).map(s => (
                <div key={s.created_at} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium text-sm">{s.scenario}</p>
                    <p className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleDateString("en-IN")}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{s.score}/100</p>
                    <p className="text-xs">
                      {s.badge === "gold" ? "🥇" : s.badge === "silver" ? "🥈" : "🥉"} {s.badge}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
