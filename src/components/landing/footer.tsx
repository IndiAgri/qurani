"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  const currentYear = 2025; // Matching Qurani original footer year

  const footerSections = [
    {
      title: "PRODUCT",
      links: [
        { label: "Pricing", href: "#pricing" },
        { label: "Gift Cards", href: "#gift-cards" },
        { label: "Family Plan", href: "#family-plan" },
        { label: "Mobile App", href: "/en/install-app" },
      ],
    },
    {
      title: "COMPANY",
      links: [
        { label: "Blog", href: "#blog" },
        { label: "Careers", href: "#careers" },
        { label: "Scholarship", href: "#scholarship" },
        { label: "About Us", href: "/en/about" },
      ],
    },
    {
      title: "SUPPORT",
      links: [
        { label: "Support Center", href: "/en/support" },
        { label: "Feature Requests", href: "#feature-requests" },
        { label: "Contact Us", href: "/en/support" },
      ],
    },
    {
      title: "COMMUNITY",
      links: [
        { label: "re:Verses Podcast", href: "https://youtu.be/hwig-OJz88Y", external: true },
        { label: "Hifz Network", href: "#hifz-network" },
        { label: "Glossary", href: "#glossary" },
        { label: "Ramadan", href: "#ramadan" },
        { label: "Discord", href: "https://discord.com", external: true },
      ],
    },
  ];

  return (
    <footer className="w-full bg-[#0a1914] text-gray-300 pt-16 pb-12 border-t border-emerald-950/60 font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 lg:gap-14 mb-16">
          {/* Logo & Info */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-900/30">
                <span className="text-white font-extrabold text-xl tracking-tighter">Q</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition">
                Qurani
              </span>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed max-w-xs">
              Modern Quran recitation, companion, and learning platform designed to elevate your daily Qur&apos;anic journey.
            </p>
          </div>

          {/* Nav columns */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="text-xs font-bold tracking-wider text-emerald-400 uppercase">
                {section.title}
              </h4>
              <ul className="space-y-2.5 text-xs">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition duration-150 inline-block"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-white transition duration-150 inline-block"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom divider and copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© Copyright {currentYear} Qurani, Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#privacy" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link href="#terms" className="hover:text-white transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
