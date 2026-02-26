import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Scale, MessageCircle, Gamepad2, MapPin, Shield, ArrowRight } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-5" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm mb-6">
              <Shield className="h-4 w-4" />
              AI-Powered Legal Awareness
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              <span className="text-gradient">NyayaVidya</span>
              <br />
              <span className="text-foreground">உங்கள் சட்ட உரிமைகளை அறிந்துகொள்ளுங்கள்</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Know your legal rights. An AI-powered platform for Tamil Nadu youth to learn about laws, fight scams, and access free legal aid.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="hero-gradient text-primary-foreground text-lg px-8">
                  Get Started <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { icon: MessageCircle, title: "Legal Chat", titleTa: "சட்ட அரட்டை", desc: "Ask legal questions in Tamil or English. Get instant answers from our knowledge base." },
            { icon: Gamepad2, title: "Rights Simulator", titleTa: "உரிமை சிமுலேட்டர்", desc: "Test your legal knowledge with real-world scenarios. Earn badges and certificates." },
          ].map((f, i) => (
            <div
              key={f.title}
              className="p-6 rounded-2xl bg-card card-shadow hover:card-hover-shadow transition-all hover:-translate-y-1 border border-border/50 animate-fade-in"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="h-12 w-12 rounded-xl hero-gradient flex items-center justify-center mb-4">
                <f.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{f.titleTa}</p>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg hero-gradient flex items-center justify-center">
              <Scale className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-gradient">NyayaVidya</span>
          </div>
          <p className="text-xs text-muted-foreground max-w-xl mx-auto">
            ⚖️ This is for educational purposes only. Not legal advice. Always consult professionals or call{" "}
            <a href="tel:15100" className="text-primary font-semibold hover:underline">15100</a>.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            கல்வி நோக்கங்களுக்காக மட்டுமே. சட்ட ஆலோசனை அல்ல. 15100 அழைக்கவும்.
          </p>
        </div>
      </footer>
    </div>
  );
}
