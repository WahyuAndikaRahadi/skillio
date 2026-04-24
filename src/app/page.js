import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import DigitalFieldsSection from "@/components/home/DigitalFieldsSection";
import RoadmapGenerationTimeline from "@/components/home/RoadmapGenerationTimeline";
import FaqSection from "@/components/home/FaqSection";
import CategoriesAndTestimonials from "@/components/home/CategoriesAndTestimonials";
import Footer from "@/components/layout/Footer";

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
    </div>
  );
}
