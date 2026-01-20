"use client";

import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa6";
import SiteLogo from "@/assets/figma/logo1.png";
import FaceBook from "@/assets/figma/Social Media Icon Square/Facebook.png";
import YouTube from "@/assets/figma/Social Media Icon Square/YouTube.png";
import Instagram from "@/assets/figma/Social Media Icon Square/Instagram.png";
import LinkedIn from "@/assets/figma/Social Media Icon Square/LinkedIn.png";
import { motion } from "framer-motion";

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
  { label: "Facebook", src: FaceBook, href: "https://facebook.com" },
  { label: "Instagram", src: Instagram, href: "https://instagram.com" },
  { label: "LinkedIn", src: LinkedIn, href: "https://linkedin.com" },
  { label: "YouTube", src: YouTube, href: "https://youtube.com" },
];

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12 mb-8">
          {/* Left Section - Logo and Social Media */}
          <div className="lg:col-span-2 space-y-6">
            {/* Logo */}
            <motion.div
              className="flex gap-4"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Link href="/" className="mb-6 -ml-2">
                <Image src={SiteLogo} alt="PROBUILT Logo" width={100} height={100} />
              </Link>
            </motion.div>

            {/* Placeholder Text */}
            <div className="space-y-1">
              <p className="text-white text-sm">Lorem ipsum dolor sit amet</p>
              <p className="text-white text-sm">consectetur adipiscing elit aliquam</p>
            </div>

            {/* Social Media Icons */}
            <motion.div className="flex gap-4">
              {socialLinks.map((social) => {
                return (
                  <Link href={social.href} key={social.label}>
                    <motion.img
                      src={social.src.src}
                      alt={`${social.label} Logo`}
                      whileHover={{ scale: 1.4 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      width={36}
                      height={36}
                    />
                  </Link>
                );
              })}
            </motion.div>
          </div>

          {/* Product Column */}
          <div>
            <motion.h3
              className="font-semibold text-[22px] text-(--accent) mb-7.5 hover:text-2xl"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              Products
            </motion.h3>
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
            <motion.h3
              className="font-semibold text-[22px] text-(--accent) mb-7.5 hover:text-2xl"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              Company
            </motion.h3>
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
            <motion.h3
              className="font-semibold text-[22px] text-(--accent) mb-7.5 hover:text-2xl"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              Support
            </motion.h3>
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
            <motion.h3
              className="font-semibold text-[22px] text-(--accent) mb-7.5 hover:text-2xl"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              Downloads
            </motion.h3>
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
                className="text-white hover:text-[#00FFC2] transition-colors underline"
              >
                Terms and Conditions
              </Link>
              {" | "}
              <Link
                href="/privacy"
                className="text-white hover:text-[#00FFC2] transition-colors underline"
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
