"use client";

import Link from "next/link";
import "./landing.css";
import SaleCountdownBanner from "@/components/landing/SaleCountdownBanner";
import LandingHeader from "@/components/landing/LandingHeader";
import HeroBanner from "@/components/landing/HeroBanner";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PricingSection from "@/components/landing/PricingSection";

export default function Home() {
  return (
    <main className="lp-root">
      <div className="sketch-fixed-top">
        <SaleCountdownBanner />
        <LandingHeader />
      </div>

      <HeroBanner />
      <FeaturesSection />
      <PricingSection />

      <section className="lp-testimonials-sketch">
        <div className="sketch-canvas">
          <div className="testi-intro">
            <h3 className="sketch-section-title">
              What the <span className="sketch-accent-text">Staff Room</span> is saying...
            </h3>
          </div>

          <div className="sketch-testi-grid">
            <div className="sketch-testi-bubble b-1">
              <p className="testi-quote">
                &quot;I finished my entire week&apos;s lesson planning in 10 minutes. Honestly, it feels like
                cheating, but my students love the quizzes!&quot;
              </p>
              <div className="testi-author">- Sarah J., 10th Grade History</div>
            </div>
            <div className="sketch-testi-bubble b-2 hl-teal">
              <p className="testi-quote">
                &quot;The grading scanner is a lifesaver. No more Sunday nights at the dining table with a red
                pen.&quot;
              </p>
              <div className="testi-author">- Marcus T., Math Lead</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="lp-footer-sketch">
        <div className="sketch-canvas">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="logo-text">
                Teachify<span className="sketch-pink">AI</span>
              </div>
              <p>
                Reimagining education through <br />
                creative AI automation.
              </p>
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
                <Link href="/about">About Us</Link>
                <Link href="/contact">Contact</Link>
                <Link href="/privacy">Privacy</Link>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="sketch-credit">Made with care by Teachers for Teachers.</p>
            <div className="footer-socials">
              <span className="social-scribble">Follow us for updates</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
