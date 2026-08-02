import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/home/Hero";
import TrustStrip from "@/components/home/TrustStrip";
import Categories from "@/components/home/Categories";
import HowItWorks from "@/components/home/HowItWorks";
import FeaturedPros from "@/components/home/FeaturedPros";
import BusinessSection from "@/components/home/BusinessSection";
import WorkerCTA from "@/components/home/WorkerCTA";
import Testimonials from "@/components/home/Testimonials";
import FAQ from "@/components/home/FAQ";
import DownloadApp from "@/components/home/DownloadApp";
import InvestorSection from "@/components/home/InvestorSection";
import { workers } from "@/lib/data";

export const metadata: Metadata = {
  title: "SewaLink Nepal — Trusted Local Services, One Tap Away",
  description:
    "Book verified electricians, plumbers, carpenters, AC technicians, tutors and more across Kathmandu Valley, Pokhara and beyond. Background-checked professionals with ratings, live tracking and secure payments.",
  alternates: { canonical: "/" },
};

export default function Home() {
  const featuredWorkers = workers.slice(0, 3);
  return (
    <div>
      <Header />
      <Hero />
      <TrustStrip />
      <Categories />
      <HowItWorks />
      <FeaturedPros featured={featuredWorkers} />
      <BusinessSection />
      <WorkerCTA />
      <Testimonials />
      <FAQ />
      <DownloadApp />
      <InvestorSection />
      <Footer />
    </div>
  );
}
