"use client";

import Image, { StaticImageData } from "next/image";
import NextLink from "next/link";

import SiteLogo from "@/assets/figma/logo1.png";
import FaceBook from "@/assets/figma/Social Media Icon Square/Facebook.png";
import YouTube from "@/assets/figma/Social Media Icon Square/YouTube.png";
import Instagram from "@/assets/figma/Social Media Icon Square/Instagram.png";
import LinkedIn from "@/assets/figma/Social Media Icon Square/LinkedIn.png";
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';

import { Divider } from "./divider";
import { label, sup } from "framer-motion/client";
import { motion } from "framer-motion";

const Link = NextLink as any;

type FooterLink = {
  label: string;
  href: string;
  src: StaticImageData;
};

const footerLinks = {
  social_media: [
    { label: "Facebook", src: FaceBook },
    { label: "Instagram", src: Instagram },
    { label: "LinkedIn", src: LinkedIn },
    { label: "YouTube", src: YouTube },
  ],
  products: [
    { label: "Hub", href: "/hub" },
    { label: "Edge", href: "/edge" },
    { label: "Community", href: "/community" },
    { label: "PB Points", href: "/pb_points" },
    { label: "Reviews", href: "/reviews" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "Careers", href: "/careers" },
    { label: "Culture", href: "/culture" },
    { label: "Blog", href: "/blog" },
  ],
  support: [
    { label: "Getting Started", href: "/getting_started" },
    { label: "Help Center", href: "/help_center" },
    { label: "FAQs", href: "/faqs" },
    { label: "Report a bug", href: "/report_a_bug" },
    { label: "Chat support", href: "/" },
  ],
  downloads: [
    { label: "iOS", href: "/ios" },
    { label: "Android", href: "/android" },
  ],
};

export function Footer() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <footer className="bg-black mt-9 text-white flex flex-col gap-8 items-center pt-[70px] pb-8 px-[68px]">
      {/* Main Footer Content */}
      <div className="flex gap-40">
        {/* Brand Section */}
        <div className="flex flex-col">
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

          <p className="text-xl leading-[136%] w-[340px] mb-[46px]">
            Lorem ipsum dolor sit amet consectetur adipiscing elit aliquam
          </p>
          <motion.div className="flex gap-4">
            {footerLinks.social_media.map((link) => (
              <motion.img
                key={link.label}
                src={link.src.src}
                alt={`${link.label} Logo`}
                whileHover={{ scale: 1.4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                width={36}
                height={36}
              />
            ))}
          </motion.div>
        </div>
        {/* Links Section */}

        <div className="flex gap-[106px]">
          {/* Products */}
          <div>
            <motion.h3
              className="font-semibold text-[22px] text-(--accent) mb-[30px] hover:text-2xl"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              Products
            </motion.h3>
            <ul className="space-y-1.5 text-xl">
              {footerLinks.products.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-[#00FFC2] transition-colors text-nowrap"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <motion.h3
              className="font-semibold text-[22px] text-(--accent) mb-[30px] hover:text-2xl"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              Company
            </motion.h3>
            <ul className="space-y-1.5 text-xl">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-[#00FFC2] transition-colors text-nowrap"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Support */}
          <div>
            <motion.h3
              className="font-semibold text-[22px] text-(--accent) mb-[30px] hover:text-2xl"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              Support
            </motion.h3>

            <ul className="space-y-1.5 text-xl">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-[#00FFC2] transition-colors text-nowrap"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Downloads */}
          <div>
            <motion.h3
              className="font-semibold text-[22px] text-(--accent) mb-[30px] hover:text-2xl"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              Downloads
            </motion.h3>

            <ul className="space-y-1.5 text-xl">
              {footerLinks.downloads.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-[#00FFC2] transition-colors text-nowrap"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Divider */}
      <Divider />
      {/* Bottom Footer */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 font-lg">
        <p> Copyright © 2025 | All Rights Reserved </p>
        <div className="flex gap-6">
          <Link href="#" className="underline hover:text-gray-300 transition-colors">
            Terms and Conditions
          </Link>
          <Link href="#" className="underline hover:text-gray-300 transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
