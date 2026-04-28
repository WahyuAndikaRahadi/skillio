import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import Footer from "@/components/layout/Footer";
import LandingAiWidget from "@/components/home/LandingAiWidget";

// Dynamic imports for components below the fold
const AboutSection = dynamic(() => import("@/components/home/AboutSection"), { ssr: true });
const FeaturesSection = dynamic(() => import("@/components/home/FeaturesSection"), { ssr: true });
const DigitalFieldsSection = dynamic(() => import("@/components/home/DigitalFieldsSection"), { ssr: true });
const RoadmapGenerationTimeline = dynamic(() => import("@/components/home/RoadmapGenerationTimeline"), { ssr: true });
const FaqSection = dynamic(() => import("@/components/home/FaqSection"), { ssr: true });
const CategoriesAndTestimonials = dynamic(() => import("@/components/home/CategoriesAndTestimonials"), { ssr: true });

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <DigitalFieldsSection />
        <RoadmapGenerationTimeline />
        <FaqSection />
        <CategoriesAndTestimonials />
      </main>
      <Footer />
      <LandingAiWidget />
    </div>
  );
}
