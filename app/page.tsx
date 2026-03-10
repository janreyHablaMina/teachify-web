"use client";

import Link from "next/link";
import "./landing.css";
import SaleCountdownBanner from "@/components/landing/SaleCountdownBanner";
import LandingHeader from "@/components/landing/LandingHeader";
import HeroBanner from "@/components/landing/HeroBanner";
import StatsSection from "@/components/landing/StatsSection";
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
      <StatsSection />
      <FeaturesSection />
      <PricingSection />
      <BlogSection />
      <AboutSection />
      <TestimonialsSection />

      <footer className="lp-footer-sketch lp-footer-notebook">
        <div className="sketch-canvas">
          <div className="footer-note-shell">
            <div className="footer-note-head">
              <span className="footer-note-pill">Classroom Edition</span>
              <div className="logo-text">
                Teachify<span className="sketch-pink">AI</span>
              </div>
              <p>
                The all-in-one teaching copilot for planning, assessment, and classroom momentum.
              </p>
              <div className="footer-note-actions">
                <Link href="/register" className="footer-note-cta">
                  Start free trial
                </Link>
                <Link href="/login" className="footer-note-secondary">
                  Teacher Login
                </Link>
              </div>
            </div>

            <div className="footer-note-grid">
              <nav className="footer-note-col note-a" aria-label="Product links">
                <h4>Product</h4>
                <Link href="#features">Features</Link>
                <Link href="#pricing">Pricing</Link>
                <Link href="/blog">Blog</Link>
              </nav>
              <nav className="footer-note-col note-b" aria-label="Company links">
                <h4>Company</h4>
                <Link href="#about">About Us</Link>
                <Link href="/contact">Contact</Link>
                <Link href="/privacy">Privacy</Link>
              </nav>
              <nav className="footer-note-col note-c" aria-label="Resources links">
                <h4>Resources</h4>
                <Link href="#blog">Teaching Blog</Link>
                <Link href="#testimonials">Testimonials</Link>
                <Link href="/contact">Support</Link>
              </nav>
            </div>

            <div className="footer-note-bottom">
              <p className="sketch-credit">Made with care by teachers, for teachers.</p>
              <div className="footer-bottom-links">
                <Link href="/privacy">Privacy</Link>
                <Link href="/contact">Contact</Link>
              </div>
              <span className="social-scribble">Teachify AI - {year}</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
