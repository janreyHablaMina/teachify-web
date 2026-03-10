"use client";

import Link from "next/link";
import "./landing.css";
import SaleCountdownBanner from "@/components/landing/SaleCountdownBanner";
import LandingHeader from "@/components/landing/LandingHeader";
import HeroBanner from "@/components/landing/HeroBanner";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PricingSection from "@/components/landing/PricingSection";
import BlogSection from "@/components/landing/BlogSection";
import AboutSection from "@/components/landing/AboutSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <main className="lp-root">
      <div className="sketch-fixed-top">
        <SaleCountdownBanner />
        <LandingHeader />
      </div>

      <HeroBanner />
      <FeaturesSection />
      <PricingSection />
      <BlogSection />
      <AboutSection />
      <TestimonialsSection />

      <footer className="lp-footer-sketch">
        <div className="sketch-canvas">
          <div className="footer-top">
            <div className="footer-brand">
              <span className="footer-brand-kicker">Built for modern classrooms</span>
              <div className="logo-text">
                Teachify<span className="sketch-pink">AI</span>
              </div>
              <p>
                Reimagining education through <br />
                creative AI automation.
              </p>
              <Link href="/register" className="footer-cta">
                Start free trial
              </Link>
            </div>
            <div className="footer-links-grid">
              <div className="footer-col">
                <h4>Product</h4>
                <Link href="#features">Features</Link>
                <Link href="#pricing">Pricing</Link>
                <Link href="/blog">Blog</Link>
              </div>
              <div className="footer-col">
                <h4>Company</h4>
                <Link href="#about">About Us</Link>
                <Link href="/contact">Contact</Link>
                <Link href="/privacy">Privacy</Link>
              </div>
              <div className="footer-col">
                <h4>Resources</h4>
                <Link href="#blog">Blog</Link>
                <Link href="/login">Teacher Login</Link>
                <Link href="#testimonials">Testimonials</Link>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="sketch-credit">Made with care by teachers, for teachers.</p>
            <div className="footer-socials">
              <span className="social-scribble">Teachify AI · {year}</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
