"use client";

import Image from "next/image";
import NextLink from "next/link";
import { FaFacebook, FaInstagram, FaLinkedin, FaXTwitter, FaWhatsapp } from "react-icons/fa6";
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
        <footer className="bg-black border-t border-white/10">
            <div className="max-w-7xl mx-auto px-6 py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-[#00FFC2] rounded-full p-2">
                                <Image src={SiteLogo} alt="PROBUILT Logo" width={24} height={24} />
                            </div>
                            <span className="text-white font-bold text-lg">PROBUILT</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Improve your football performance with personalised training plans guided by an experienced coach committed to your success.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Quick Links</h3>
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
                        <h3 className="text-white font-semibold mb-6">Company</h3>
                        <ul className="space-y-3">
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

                    {/* Connect */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Connect</h3>
                        <div className="flex flex-col space-y-4">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 text-gray-400 hover:text-[#00FFC2] transition-colors text-sm"
                                    >
                                        <Icon className="text-lg" />
                                        {social.label}
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/10 pt-8">
                    {/* Bottom Footer */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-500 text-sm">
                            © 2024 PROBUILT. All rights reserved.
                        </p>
                        <div className="flex gap-6">
                            <Link href="/privacy" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
