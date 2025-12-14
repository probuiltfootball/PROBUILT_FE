"use client";

import Image from "next/image";
import NextLink from "next/link";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa6";
import SiteLogo from "@/assets/svg/site-logo.svg";

const Link = NextLink as any;

const footerLinks = {
  product: [
    { label: "Hub", href: "/hub" },
    { label: "Edge", href: "/edge" },
    { label: "Community", href: "/community" },
    { label: "PB Points", href: "/pb-points" },
    { label: "Reviews", href: "/reviews" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Contact us", href: "/contact" },
    { label: "Careers", href: "/careers" },
    { label: "Culture", href: "/culture" },
    { label: "Blog", href: "/blog" },
  ],
  support: [
    { label: "Getting started", href: "/getting-started" },
    { label: "Help centre", href: "/help" },
    { label: "FAQs", href: "/faq" },
    { label: "Report a bug", href: "/report-bug" },
    { label: "Chat support", href: "/support" },
  ],
  downloads: [
    { label: "iOS", href: "/download/ios" },
    { label: "Android", href: "/download/android" },
  ],
};

const socialLinks = [
  { icon: FaFacebook, href: "https://facebook.com", label: "Facebook" },
  { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
  { icon: FaLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: FaYoutube, href: "https://youtube.com", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12 mb-8">
          {/* Left Section - Logo and Social Media */}
          <div className="lg:col-span-2 space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 border-2 border-[#00FFC2] rounded flex items-center justify-center p-2">
                <Image
                  src={SiteLogo}
                  alt="ProBuilt Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
            </div>

            {/* Placeholder Text */}
            <div className="space-y-1">
              <p className="text-white text-sm">
                Lorem ipsum dolor sit amet
              </p>
              <p className="text-white text-sm">
                consectetur adipiscing elit aliquam
              </p>
            </div>

            {/* Social Media Icons */}
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#00FFC2] rounded flex items-center justify-center hover:bg-[#00E0AA] transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="text-white text-lg" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="text-[#00FFC2] font-semibold mb-4 text-base">
              Product
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white hover:text-[#00FFC2] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-[#00FFC2] font-semibold mb-4 text-base">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white hover:text-[#00FFC2] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="text-[#00FFC2] font-semibold mb-4 text-base">
              Support
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white hover:text-[#00FFC2] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Downloads Column */}
          <div>
            <h3 className="text-[#00FFC2] font-semibold mb-4 text-base">
              Downloads
            </h3>
            <ul className="space-y-3">
              {footerLinks.downloads.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white hover:text-[#00FFC2] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider Line */}
        <div className="border-t border-[#00FFC2] pt-8 mt-8">
          {/* Bottom Footer - Copyright */}
          <div className="text-center">
            <p className="text-white text-sm">
              Copyright © 2025 | All Rights Reserved |{" "}
              <Link
                href="/terms"
                className="text-white hover:text-[#00FFC2] transition-colors"
              >
                Terms and Conditions
              </Link>
              {" | "}
              <Link
                href="/privacy"
                className="text-white hover:text-[#00FFC2] transition-colors"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
