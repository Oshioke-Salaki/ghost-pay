import TheWalletProblem from "@/components/landing-page/TheWalletProblem";
import FeaturesGrid from "@/components/landing-page/FeaturesGrid";
import HowItWorks from "@/components/landing-page/HowItWorks";
import ReadyBanner from "@/components/landing-page/ReadyBanner";
import HeroSection from "@/components/landing-page/HeroSection";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      <HeroSection />
      <TheWalletProblem />
      <FeaturesGrid />
      <HowItWorks />
      <ReadyBanner />
    </div>
  );
}
