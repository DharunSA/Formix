import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Formix — Build beautiful conversational forms",
  description:
    "Save time with beautiful, interactive forms that connect to your favorite apps — and let your data flow seamlessly.",
};

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${playfair.variable} ${jakarta.variable} lp min-h-screen flex flex-col`}>
      {/* Material Symbols font for integration badge icons */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
      />
      {children}
    </div>
  );
}
