"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Shield, CheckCircle2 } from "lucide-react";

export default function Footer() {
  const links = [
    { name: "Projects", href: "/projects" },
    { name: "Communities", href: "/communities" },
    { name: "Services", href: "/services" },
    { name: "About Us", href: "/about" },
  ];

  return (
    <footer className="bg-[#0B0C1E] text-slate-300 border-t border-slate-900 mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Logo and Tagline Column */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="inline-block">
              <div className="bg-white p-2 rounded-xl inline-block">
                <Image
                  src="/logo.png"
                  alt="Chlonestone Logo"
                  width={150}
                  height={42}
                  className="h-auto w-auto max-h-12"
                />
              </div>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed">
              Chlonestone specializes in Dubai off-plan properties, investment advisory, mortgage assistance, and premium residential opportunities across the UAE.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Explore Portfolio
            </h4>
            <ul className="space-y-2 text-sm">
              {links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-primary transition duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Contact Advisors
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-slate-400">
                  COMMERCIAL BANK OF DUBAI-BUILDING - M-01,<br />
                  Al Khabeesi, Dubai, UAE<br />
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Plot: 64-7 | DM No: 128-469 | Makani: 31895 95518
                  </span>
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <a href="tel:+971503483366" className="hover:text-primary transition">
                  +971 50 348 3366
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <a href="mailto:info@chlonestone.com" className="hover:text-primary transition">
                  info@chlonestone.com
                </a>
              </li>
            </ul>
          </div>

          {/* Trust and Compliance Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-emerald-500" /> Compliance
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Chlonestone Real Estate operates in accordance with Dubai's real estate regulations, ensuring transparency, professionalism, and client confidence in every transaction.
            </p>
            <div className="text-[0.7rem] text-slate-400 space-y-1 bg-slate-950/40 p-3 rounded-xl border border-slate-900/60">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                <span>RERA Broker License: <strong>91442</strong></span>
              </div>
            </div>
          </div>

        </div>

        {/* SEO-Friendly Text Line */}
        <p className="border-t border-slate-900 mt-10 pt-6 pb-4 text-[0.7rem] text-slate-500 leading-relaxed">
          Serving property investors, homebuyers, and real estate professionals across Dubai, Business Bay, Downtown Dubai, Dubai Marina, Palm Jumeirah, and other leading UAE communities.
        </p>

        {/* Copyright and DLD Legal Note */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[0.7rem] text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Chlonestone Real Estate. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-slate-400 transition">
              Privacy Policy
            </Link>
            <span>·</span>
            <Link href="/terms-and-conditions" className="hover:text-slate-400 transition">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
