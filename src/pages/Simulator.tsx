import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { addSimulatorScore } from "@/lib/supabase-helpers";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gamepad2, CheckCircle, ArrowRight, RotateCcw, Award } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface Choice {
  text: string;
  points: number;
  feedback: string;
}

interface Step {
  situation: string;
  situationTa: string;
  choices: Choice[];
}

interface Scenario {
  id: string;
  title: string;
  titleTa: string;
  description: string;
  icon: string;
  steps: Step[];
  learningPoints: string[];
}

const scenarios: Scenario[] = [
  {
    id: "fake-job",
    title: "Fake Job Scam",
    titleTa: "போலி வேலை மோசடி",
    description: "You receive a WhatsApp message offering ₹50,000/month for data entry work from home.",
    icon: "💼",
    steps: [
      {
        situation: "You get a message: 'Earn ₹50,000/month! Data entry from home. Pay ₹5,000 registration fee.' What do you do?",
        situationTa: "நீங்கள் ஒரு செய்தி பெறுகிறீர்கள்: 'மாதம் ₹50,000 சம்பாதியுங்கள்! வீட்டிலிருந்து தரவு உள்ளீடு. ₹5,000 பதிவு கட்டணம் செலுத்துங்கள்.'",
        choices: [
          { text: "Pay the fee immediately to secure the job", points: 0, feedback: "❌ Never pay money for a job! Legitimate employers don't charge registration fees." },
          { text: "Ask for company details and verify online", points: 25, feedback: "✅ Good thinking! Verifying company details is an important first step." },
          { text: "Report to cybercrime.gov.in and block the number", points: 25, feedback: "✅ Excellent! Reporting helps protect others from the same scam." },
          { text: "Ignore and delete the message", points: 15, feedback: "⚠️ Safe choice, but reporting would help catch the scammers." },
        ],
      },
      {
        situation: "The caller insists it's urgent and says the offer expires today. They send an official-looking ID card.",
        situationTa: "அழைப்பவர் இது அவசரம் என்றும், இன்றே காலாவதியாகும் என்றும் சொல்கிறார். அதிகாரப்பூர்வமான அடையாள அட்டை அனுப்புகிறார்.",
        choices: [
          { text: "Trust the ID card and proceed", points: 0, feedback: "❌ ID cards can be easily faked. Urgency is a classic scam tactic." },
          { text: "Call the company's official number from their website", points: 25, feedback: "✅ Perfect! Always verify through official channels, never through links/numbers provided by the caller." },
          { text: "Share personal documents as requested", points: 0, feedback: "❌ Never share Aadhaar, PAN, or bank details with unverified parties!" },
          { text: "File an FIR at the nearest police station", points: 25, feedback: "✅ Filing an FIR creates an official record. Under IPC 420, fraud is punishable." },
        ],
      },
    ],
    learningPoints: [
      "Legitimate employers never charge fees for jobs",
      "IPC Section 420 covers cheating and fraud",
      "Report scams at cybercrime.gov.in or call 1930",
      "Never share personal documents with unverified sources",
      "Urgency and pressure are classic scam tactics",
    ],
  },
  {
    id: "wage-dispute",
    title: "Wage Dispute",
    titleTa: "ஊதிய தகராறு",
    description: "Your employer hasn't paid your salary for 2 months despite working full hours.",
    icon: "💰",
    steps: [
      {
        situation: "Your employer says 'Business is slow, I'll pay next month.' It's been 2 months without salary. What do you do?",
        situationTa: "உங்கள் முதலாளி 'வணிகம் மெதுவாக உள்ளது, அடுத்த மாதம் பணம் தருகிறேன்' என்கிறார். 2 மாதம் சம்பளம் இல்லை.",
        choices: [
          { text: "Wait patiently, hoping they'll pay", points: 5, feedback: "⚠️ While patience is a virtue, you have legal rights to your earned wages." },
          { text: "Send a written notice demanding payment within 15 days", points: 25, feedback: "✅ A written notice creates legal documentation. This is a strong first step." },
          { text: "Complain to the Labour Commissioner", points: 25, feedback: "✅ The Labour Commissioner can intervene and order payment under the Payment of Wages Act." },
          { text: "Quit without taking any action", points: 0, feedback: "❌ Don't leave unpaid wages behind! You have a legal right to them." },
        ],
      },
      {
        situation: "The employer threatens to fire you if you take action. What's your next step?",
        situationTa: "நடவடிக்கை எடுத்தால் வேலையிலிருந்து நீக்குவதாக முதலாளி மிரட்டுகிறார்.",
        choices: [
          { text: "Back down from fear of losing your job", points: 0, feedback: "❌ Retaliatory termination is illegal. You're protected by law." },
          { text: "File complaint at DLSA for free legal aid", points: 25, feedback: "✅ DLSA provides free legal assistance. Call 15100 for help." },
          { text: "Document everything and file with Labour Court", points: 25, feedback: "✅ Documentation is crucial. Labour Court can order payment plus compensation." },
          { text: "Accept whatever partial payment they offer", points: 10, feedback: "⚠️ You're entitled to the full amount plus interest for delayed payment." },
        ],
      },
    ],
    learningPoints: [
      "Minimum Wages Act 1948 guarantees minimum wages",
      "Payment of Wages Act ensures timely salary payment",
      "Labour Commissioner can order employers to pay",
      "Retaliatory termination is illegal",
      "DLSA (15100) provides free legal aid for workers",
    ],
  },
  {
    id: "school-harassment",
    title: "School Harassment",
    titleTa: "பள்ளி தொல்லை",
    description: "A student is being ragged and bullied by seniors in their college hostel.",
    icon: "🏫",
    steps: [
      {
        situation: "Seniors are forcing you to do their work, taking your food, and threatening you. What do you do?",
        situationTa: "மூத்த மாணவர்கள் உங்களை வேலை செய்ய கட்டாயப்படுத்துகிறார்கள், உணவை எடுத்துக்கொள்கிறார்கள், மிரட்டுகிறார்கள்.",
        choices: [
          { text: "Suffer in silence, it's normal college life", points: 0, feedback: "❌ Ragging is NOT normal. It's a criminal offense under UGC regulations." },
          { text: "Report to Anti-Ragging Committee", points: 25, feedback: "✅ Every college must have an Anti-Ragging Committee. They are legally bound to act." },
          { text: "Call the Anti-Ragging Helpline 1800-180-5522", points: 25, feedback: "✅ This is a free helpline that can take immediate action. Your identity is protected." },
          { text: "Fight back physically", points: 0, feedback: "❌ Physical confrontation can lead to legal trouble for you. Use legal channels instead." },
        ],
      },
      {
        situation: "The college administration tries to suppress your complaint. What do you do?",
        situationTa: "கல்லூரி நிர்வாகம் உங்கள் புகாரை அடக்க முயற்சிக்கிறது.",
        choices: [
          { text: "Withdraw the complaint", points: 0, feedback: "❌ Don't withdraw! The institution can face consequences for suppressing complaints." },
          { text: "Escalate to UGC through their online portal", points: 25, feedback: "✅ UGC can take action against the institution including withdrawal of recognition." },
          { text: "File an FIR at the police station", points: 25, feedback: "✅ Ragging is a criminal offense. FIR ensures official police investigation." },
          { text: "Share on social media for attention", points: 10, feedback: "⚠️ While it creates awareness, legal channels are more effective and protect your identity." },
        ],
      },
    ],
    learningPoints: [
      "Ragging is a criminal offense under UGC regulations 2009",
      "Anti-Ragging Helpline: 1800-180-5522 (free, anonymous)",
      "Every institution must have an Anti-Ragging Committee",
      "Institutions can lose recognition for suppressing complaints",
      "POCSO Act protects minors from sexual offenses",
    ],
  },
  {
    id: "landlord-issue",
    title: "Landlord Issue",
    titleTa: "வீட்டு உரிமையாளர் பிரச்சனை",
    description: "Your landlord is trying to illegally evict you without notice after you requested repairs.",
    icon: "🏠",
    steps: [
      {
        situation: "Your landlord cuts water and electricity and demands you leave within 24 hours after you asked for repairs.",
        situationTa: "நீங்கள் பழுது பார்க்கக் கேட்ட பிறகு, வீட்டு உரிமையாளர் தண்ணீர் மற்றும் மின்சாரத்தை துண்டித்து 24 மணி நேரத்தில் வெளியேறக் கோருகிறார்.",
        choices: [
          { text: "Leave immediately to avoid conflict", points: 0, feedback: "❌ Illegal eviction is punishable. You have a right to stay with proper notice." },
          { text: "Send a written complaint to the landlord and keep a copy", points: 25, feedback: "✅ Written records are crucial evidence. This creates legal documentation." },
          { text: "File complaint at Rent Controller's office", points: 25, feedback: "✅ TN Rent Control Act protects tenants from illegal eviction." },
          { text: "Stop paying rent as retaliation", points: 0, feedback: "❌ Withholding rent without legal order can be used against you in court." },
        ],
      },
      {
        situation: "The landlord sends people to physically remove your belongings. What do you do?",
        situationTa: "வீட்டு உரிமையாளர் உங்கள் பொருட்களை அகற்ற ஆட்களை அனுப்புகிறார்.",
        choices: [
          { text: "Call 100 (Police) immediately", points: 25, feedback: "✅ Call police immediately. Forceful eviction is criminal trespass and intimidation." },
          { text: "Record everything on your phone as evidence", points: 25, feedback: "✅ Video evidence is powerful in court. Document time, date, and persons involved." },
          { text: "Let them take your things to avoid trouble", points: 0, feedback: "❌ Your property rights are protected by law. Don't surrender them." },
          { text: "Call your friends to help confront them", points: 5, feedback: "⚠️ While support helps, prioritize calling police and legal channels." },
        ],
      },
    ],
    learningPoints: [
      "TN Buildings (Lease and Rent Control) Act protects tenants",
      "Illegal eviction is a criminal offense",
      "Landlords must give proper notice (usually 15-30 days)",
      "Cutting utilities to force eviction is illegal",
      "Rent Controller's office handles tenant-landlord disputes",
    ],
  },
];

export default function Simulator() {
  const { user } = useAuth();
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [finished, setFinished] = useState(false);

  const handleChoice = (choice: Choice) => {
    setSelectedChoice(choice);
    setTotalScore(prev => prev + choice.points);
  };

  const nextStep = async () => {
    if (!selectedScenario) return;
    if (currentStep + 1 < selectedScenario.steps.length) {
      setCurrentStep(prev => prev + 1);
      setSelectedChoice(null);
    } else {
      setFinished(true);
      const maxScore = selectedScenario.steps.length * 50;
      const finalScore = Math.round((totalScore / maxScore) * 100);
      const badge = finalScore >= 80 ? "gold" : finalScore >= 50 ? "silver" : "bronze";

      if (badge === "gold") {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      }

      if (user) {
        try {
          await addSimulatorScore(user.id, selectedScenario.title, finalScore, badge);
        } catch {
          toast.error("Failed to save score");
        }
      }
    }
  };

  const reset = () => {
    setSelectedScenario(null);
    setCurrentStep(0);
    setTotalScore(0);
    setSelectedChoice(null);
    setFinished(false);
  };

  if (!selectedScenario) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Gamepad2 className="h-8 w-8 text-primary" />
            Rights Simulator / உரிமை சிமுலேட்டர்
          </h1>
          <p className="text-muted-foreground mt-2">Choose a scenario and test your legal knowledge</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {scenarios.map((s, i) => (
            <Card
              key={s.id}
              className="cursor-pointer card-shadow hover:card-hover-shadow transition-all hover:-translate-y-1 border-border/50 animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
              onClick={() => setSelectedScenario(s)}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-3xl">{s.icon}</span>
                  <div>
                    <p>{s.title}</p>
                    <p className="text-sm text-muted-foreground font-normal">{s.titleTa}</p>
                  </div>
                </CardTitle>
                <CardDescription>{s.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (finished) {
    const maxScore = selectedScenario.steps.length * 50;
    const finalScore = Math.round((totalScore / maxScore) * 100);
    const badge = finalScore >= 80 ? "gold" : finalScore >= 50 ? "silver" : "bronze";
    const badgeEmoji = badge === "gold" ? "🥇" : badge === "silver" ? "🥈" : "🥉";

    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl animate-fade-in">
        <Card className="card-shadow border-border/50 text-center">
          <CardContent className="py-10">
            <p className="text-6xl mb-4">{badgeEmoji}</p>
            <h2 className="text-2xl font-bold mb-2">Scenario Complete!</h2>
            <p className="text-4xl font-bold text-gradient mb-2">{finalScore}/100</p>
            <p className={`text-lg font-semibold capitalize ${
              badge === "gold" ? "text-gold" : badge === "silver" ? "text-silver" : "text-bronze"
            }`}>
              {badge} Badge
            </p>

            <div className="mt-8 text-left bg-muted/50 rounded-xl p-6">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" />
                Learning Points / கற்றுக்கொண்டவை
              </h3>
              <ul className="space-y-2">
                {selectedScenario.learningPoints.map((lp, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                    {lp}
                  </li>
                ))}
              </ul>
            </div>

            <Button onClick={reset} className="mt-6 hero-gradient text-primary-foreground">
              <RotateCcw className="h-4 w-4 mr-2" />
              Try Another Scenario
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const step = selectedScenario.steps[currentStep];

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-lg">{selectedScenario.icon} {selectedScenario.title}</h2>
        <span className="text-sm text-muted-foreground">Step {currentStep + 1}/{selectedScenario.steps.length}</span>
      </div>

      {/* Progress */}
      <div className="w-full h-2 bg-muted rounded-full mb-6">
        <div
          className="h-2 hero-gradient rounded-full transition-all"
          style={{ width: `${((currentStep + (selectedChoice ? 1 : 0)) / selectedScenario.steps.length) * 100}%` }}
        />
      </div>

      <Card className="card-shadow border-border/50 mb-4">
        <CardContent className="pt-6">
          <p className="font-medium mb-2">{step.situation}</p>
          <p className="text-sm text-muted-foreground mb-6">{step.situationTa}</p>

          <div className="space-y-3">
            {step.choices.map((choice, i) => (
              <button
                key={i}
                onClick={() => !selectedChoice && handleChoice(choice)}
                disabled={!!selectedChoice}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all text-sm ${
                  selectedChoice === choice
                    ? choice.points >= 25
                      ? "border-secondary bg-accent"
                      : "border-destructive bg-destructive/5"
                    : selectedChoice
                    ? "opacity-50 border-border"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                {choice.text}
              </button>
            ))}
          </div>

          {selectedChoice && (
            <div className={`mt-4 p-4 rounded-xl text-sm animate-fade-in ${
              selectedChoice.points >= 25 ? "bg-accent text-accent-foreground" : "bg-destructive/5 text-destructive"
            }`}>
              <p className="font-medium">{selectedChoice.feedback}</p>
              <p className="text-xs mt-2 opacity-70">+{selectedChoice.points} points</p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedChoice && (
        <Button onClick={nextStep} className="w-full hero-gradient text-primary-foreground animate-fade-in">
          {currentStep + 1 < selectedScenario.steps.length ? (
            <>Next <ArrowRight className="h-4 w-4 ml-2" /></>
          ) : (
            <>See Results <Award className="h-4 w-4 ml-2" /></>
          )}
        </Button>
      )}
    </div>
  );
}
