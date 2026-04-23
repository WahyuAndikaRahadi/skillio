import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import RoadmapGenerationTimeline from "@/components/home/RoadmapGenerationTimeline";
import HowItWorks from "@/components/home/HowItWorks";
import CategoriesAndTestimonials from "@/components/home/CategoriesAndTestimonials";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <RoadmapGenerationTimeline />
        <HowItWorks />
        <CategoriesAndTestimonials />
      </main>
      <Footer />
    </div>
  );
}
