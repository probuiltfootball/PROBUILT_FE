"use client";

import Image from "next/image";
import NextLink from "next/link";
import { useAppSelector } from "@/lib/store/hooks";
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
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <footer className="bg-black border-t border-white/10 p-8 sm:p-10 md:p-20 text-white">
      <div className="bg-[#2e2e2e] rounded-3xl py-4 md:py-8 sm:py-6 px-2 md:px-6 sm:px-4 border-2 border-[#00FFC2] flex flex-col gap-8 items-center">
        {/* Main Footer Content */}
        <div className="flex flex-col sm:flex-row md:flex-row-reverse sm:gap-6 p-4 sm:p-2 w-full justify-between">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="flex gap-10 sm:gap-6">
              {/* Quick Links */}
              <div>
                <h3 className=" font-semibold mb-6 md:mb-4 md:text-sm text-nowrap">
                  Quick Links
                </h3>
                <ul className="space-y-3 text-sm">
                  {footerLinks.quickLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-[#00FFC2] transition-colors text-sm sm:text-xs"
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
                        className="text-gray-400 hover:text-[#00FFC2] transition-colors text-sm sm:text-xs"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Connect */}
            <div>
              <h3 className="hidden sm:block mb-6 font-bold text-semibold">Connect</h3>
              <div className="grid grid-cols-2 sm:grid-cols-1 space-y-4 ">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#00FFC2] transition-colors flex flex-row items-center space-x-2 gap-3 sm:gap-2 text-sm"
                    >
                      <Icon className="text-sm" />
                      {social.label}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
          {/* Brand Section */}
          <div className="flex flex-col gap-2 mt-4 sm:mt-[-10] sm:flex-col-reverse sm:justify-center sm:gap-4 space-y-4">
            <p className="text-sm leading-relaxed lg:max-w-xs">
              Improve your triathlon performance with personalised training plans guided
              by an experienced coach committed to your success.
            </p>
            <div className="w-full">
              <Link
                href="/"
                className="mb-6 hidden text-2xl font-bold tracking-tighter lg:flex items-center gap-3 uppercase"
              >
                <Image src={SiteLogo} alt="PROBUILT Logo" width={30} height={30} />
                ProBuilt
              </Link>

              <div className="flex items-center gap-2 justify-between w-full">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/membership"
                      className="flex-1 min-w-0 px-6 py-2 rounded-full border border-gray-500 text-white text-md font-medium hover:border-white transition-colors text-center"
                    >
                      View Plans
                    </Link>
                    <Link
                      href="/dashboard"
                      className="flex-1 min-w-0 px-6 py-2 rounded-full bg-[#00FFC2] text-black text-md font-bold hover:bg-[#00E0AA] transition-colors text-center"
                    >
                      Dashboard
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/membership"
                      className="flex-1 min-w-0 px-6 py-2 rounded-full border border-gray-500 text-white text-md font-medium hover:border-white transition-colors text-center"
                    >
                      View Plans
                    </Link>
                    <Link
                      href="/login"
                      className="flex-1 min-w-0 px-6 py-2 rounded-full bg-[#00FFC2] text-black text-md font-bold hover:bg-[#00E0AA] transition-colors text-center"
                    >
                      Login
                    </Link>
                  </>
                )}
              </div>
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
