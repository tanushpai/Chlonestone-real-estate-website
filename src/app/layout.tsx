import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import AuthLeadCaptureModal from "@/components/auth/AuthLeadCaptureModal";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import PropertyChatbot from "@/components/layout/PropertyChatbot";
import ComparisonBar from "@/components/projects/ComparisonBar";
import ToolsSidebar from "@/components/tools/ToolsSidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chlonestone | Real Estate",
  description: "Boutique real estate brokerage in Dubai specializing in luxury off-plan properties.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Footer />
        <WhatsAppButton />
        <PropertyChatbot />
        <ComparisonBar />
        <ToolsSidebar />
        <AuthLeadCaptureModal />
      </body>
    </html>
  );
}
