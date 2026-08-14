import type { Metadata } from "next";
import { LandingNav } from "@/components/landing/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { QuoteSection } from "@/components/landing/QuoteSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { IntegrationsSection } from "@/components/landing/IntegrationsSection";
import { CtaSection } from "@/components/landing/CtaSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export const metadata: Metadata = {
  title: "Formix — Build beautiful conversational forms",
  description:
    "Save time with beautiful, interactive forms that connect to your favorite apps — and let your data flow seamlessly.",
};

export default function LandingPage() {
  return (
    <>
      <LandingNav />
      <main className="flex flex-col">
        <HeroSection />
        <QuoteSection />
        <FeaturesSection />
        <IntegrationsSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </>
  );
}
