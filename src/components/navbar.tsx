"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import NextLink from "next/link";
import { motion } from "framer-motion";

const Link = NextLink;
import SiteLogo from "@/assets/svg/site-logo.svg";
import { FaTimes, FaBars } from "react-icons/fa";

export default function Navbar() {
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("up");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 100) {
        setIsScrolling(true);
      } else {
        setIsScrolling(false);
      }

      if (currentScrollY > lastScrollY) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-6 bg-[#2E2E2E90] backdrop-blur-[10px] border border-[#00FFC230] shadow-2xl mx-[1%] mt-[10px] rounded-full"
      initial={{ y: -100, opacity: 1 }}
      animate={{
        y: scrollDirection === "down" && isScrolling ? 10 : 20,
        opacity: scrollDirection === "down" && isScrolling ? 0.9 : 1,
      }}
      transition={{
        duration: 0.4,
        ease: "easeInOut",
      }}
    >
      {/* Logo */}
      <div className="hidden md:flex md:items-center gap-2 ml-4">
        <Link href="/">
          <Image src={SiteLogo} alt="Probuilt Logo" width={35} height={35} />
        </Link>
        <h2 className="text-xs md:text-xl font-bold text-white tracking-wider whitespace-nowrap">
          Probuilt <span className="text-[#00FFC2]">Football</span>
        </h2>
      </div>

      {/* Nav Links */}
      <div className="hidden md:flex mr-auto px-8">
        <Link
          href="/"
          className="relative text-gray-100 font-medium text-md hover:text-[#00FFC2] transition-colors px-4 py-2
          after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:h-1
          after:w-0 after:bg-[#00FFC2] after:transition-all after:duration-300 after:-translate-x-1/2
          hover:after:w-full"
        >
          Hub
        </Link>

        <Link
          href="/"
          className="relative text-gray-100 font-medium text-md hover:text-[#00FFC2] transition-colors px-4 py-2
          after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:h-1
          after:w-0 after:bg-[#00FFC2] after:transition-all after:duration-300 after:-translate-x-1/2
          hover:after:w-full"
        >
          Edge
        </Link>

        <Link
          href="/"
          className="relative text-gray-100 font-medium text-md hover:text-[#00FFC2] transition-colors px-4 py-2
          after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:h-1
          after:w-0 after:bg-[#00FFC2] after:transition-all after:duration-300 after:-translate-x-1/2
          hover:after:w-full"
        >
          Community
        </Link>

        <Link
          href="/"
          className="relative text-gray-100 font-medium text-md hover:text-[#00FFC2] transition-colors px-4 py-2
          after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:h-1
          after:w-0 after:bg-[#00FFC2] after:transition-all after:duration-300 after:-translate-x-1/2
          hover:after:w-full"
        >
          PB Points
        </Link>
      </div>

      <div className="flex gap-4 justify-center sm:justify-end items-center flex-1">
        {/* CTA Buttons */}
        <div className="flex items-center gap-4">
          <button className="px-6 py-2 rounded-full border border-gray-500 text-white text-md font-medium hover:border-white transition-colors">
            Register
          </button>

          <button className="px-6 py-2 rounded-full bg-[#00FFC2] text-black text-md font-bold hover:bg-[#00E0AA] transition-colors text-nowrap">
            Log in
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button className="text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="md:hidden absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[94%] bg-[#2E2E2E] backdrop-blur-[6px] border border-[#00FFC230] rounded-xl p-4 z-40 shadow-lg"
        >
          <nav className="flex flex-col gap-2">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 rounded-md text-gray-100 hover:bg-[#00FFC210] hover:text-[#00FFC2]"
            >
              Hub
            </Link>
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 rounded-md text-gray-100 hover:bg-[#00FFC210] hover:text-[#00FFC2]"
            >
              Edge
            </Link>
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 rounded-md text-gray-100 hover:bg-[#00FFC210] hover:text-[#00FFC2]"
            >
              Community
            </Link>
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 rounded-md text-gray-100 hover:bg-[#00FFC210] hover:text-[#00FFC2]"
            >
              PB Points
            </Link>
          </nav>
        </motion.div>
      )}
    </motion.nav>
  );
}
