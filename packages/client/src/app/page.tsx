// packages/client/src/app/page.tsx
import HeroSection from "@/components/home/HeroSection";
import ServiceSection from "@/components/home/ServiceSection";
import AboutSection from "@/components/home/AboutSection";
import NewestProductsSection from "@/components/home/NewestProductsSection";

// (Cài đặt: npm install framer-motion)
export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <ServiceSection />
      <AboutSection />
      <NewestProductsSection />
    </main>
  );
}