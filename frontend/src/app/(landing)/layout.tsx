import type { Metadata } from "next";
import "../globals.css";
import { LandingWrapper } from "@/components/landing/LandingWrapper";

export const metadata: Metadata = {
  title: "Formix — Build beautiful conversational forms",
  description:
    "Save time with beautiful, interactive forms that connect to your favorite apps — and let your data flow seamlessly.",
};

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="lp bg-[#faf9f7] text-[#261c23] min-h-screen flex flex-col font-sans">
      <LandingWrapper>{children}</LandingWrapper>
    </div>
  );
}
