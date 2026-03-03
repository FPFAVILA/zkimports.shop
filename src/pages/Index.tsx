import { useEffect, useState } from "react";
import Header from "@/components/Header";
import PromoBanner from "@/components/BlackFridayBanner";
import ProductHero from "@/components/ProductHero";
import TrustBadges from "@/components/TrustBadges";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";
import DiscountWheel from "@/components/DiscountWheel";
import { trackViewContent } from "@/lib/tiktok-tracking";
import { metaTrackViewContent } from "@/lib/meta-tracking";

const Index = () => {
  const [showWheel, setShowWheel] = useState(false);
  const [discountApplied, setDiscountApplied] = useState(false);

  useEffect(() => {
    void trackViewContent();
    void metaTrackViewContent();
    
    // Check if user already spun the wheel this session
    const hasSpun = sessionStorage.getItem("wheelSpun");
    if (!hasSpun) {
      // Show wheel after a brief delay for better UX
      const timer = setTimeout(() => {
        setShowWheel(true);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      // If already spun, apply discount
      setDiscountApplied(true);
    }
  }, []);

  const handleDiscountApplied = (discount: number) => {
    sessionStorage.setItem("wheelSpun", "true");
    setDiscountApplied(true);
  };

  const handleCloseWheel = () => {
    setShowWheel(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {showWheel && (
        <DiscountWheel 
          onDiscountApplied={handleDiscountApplied}
          onClose={handleCloseWheel}
        />
      )}
      <PromoBanner />
      <Header />
      <main>
        <ProductHero whatsappNumber="556294330111" discountApplied={discountApplied} />
        <TrustBadges />
        <Reviews />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
