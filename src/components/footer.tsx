"use client";

import Image from "next/image";
import NextLink from "next/link";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
  FaWhatsapp,
} from "react-icons/fa6";
import SiteLogo from "@/assets/svg/site-logo.svg";

const Link = NextLink as any;

const footerLinks = {
  quickLinks: [
    { label: "Services", href: "/services" },
    { label: "Courses", href: "/courses" },
    { label: "Coaching", href: "/coaching" },
    { label: "Training", href: "/training" },
    { label: "FAQ", href: "/faq" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Team", href: "/team" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
  ],
};

const socialLinks = [
  { icon: FaFacebook, href: "https://facebook.com", label: "Facebook" },
  { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
  { icon: FaLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: FaXTwitter, href: "https://twitter.com", label: "X" },
  { icon: FaWhatsapp, href: "https://whatsapp.com", label: "WhatsApp" },
];

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 p-6 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row lg:flex-row-reverse gap-8">
          <div className="mx-auto grid grid-cols-2 items-center justify-evenly md:flex md:mx-0">
            {/* Quick Links */}
            <div>
              <h3 className=" font-semibold mb-6 md:mb-4 md:text-sm">Quick Links</h3>
              <ul className="space-y-3">
                {footerLinks.quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-[#00FFC2] transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold mb-6 md:text-sm md:mb-4">Company</h3>
              <ul className="space-y-3 text-sm">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-[#00FFC2] transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Connect */}
          <div className="mt-4 md:mt-0 md:ml-8">
            <h3 className="hidden md:block lg:block mb-6 font-bold md:text-semibold md:mb-4">
              Connect
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-1 space-y-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#00FFC2] transition-colors flex flex-row items-center space-x-2 gap-3 text-sm"
                  >
                    <Icon className="text-sm" />
                    {social.label}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Brand Section */}
          {/* <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div>
                <Image src={SiteLogo} alt="PROBUILT Logo" width={30} height={30} />
              </div>
              <span className="text-white font-bold text-lg">PROBUILT</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Improve your football performance with personalised training plans guided by
              an experienced coach committed to your success.
            </p>
          </div> */}

          <div className="flex gap-4 flex-col md:flex-col-reverse md:ml-10 md:mb-auto lg:mr-auto">
            <p className="text-sm leading-relaxed lg:max-w-xs">
              Improve your triathlon performance with personalised training plans guided
              by an experienced coach committed to your success.
            </p>
            <div className="flex gap-4">
              <Link
                href="/"
                className="mb-6 hidden text-2xl font-bold tracking-tighter text-primary lg:flex items-center gap-3 uppercase"
              >
                <Image src={SiteLogo} alt="PROBUILT Logo" width={30} height={30} />
                ProBuilt
              </Link>

              <button className="w-full px-6 py-2 rounded-full border border-gray-500 text-white text-md font-medium hover:border-white transition-colors">
                CTA
              </button>

              <button className="w-full px-6 py-2 rounded-full bg-[#00FFC2] text-black text-md font-bold hover:bg-[#00E0AA] transition-colors text-nowrap">
                Login
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">© 2024 PROBUILT. All rights reserved.</p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
