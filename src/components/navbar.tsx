"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import NextLink from "next/link";
import { motion } from "framer-motion";

const Link = NextLink;
import SiteLogo from "@/assets/figma/logo2.png";
import { FaTimes, FaBars } from "react-icons/fa";
import { Button } from "./ui/button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-(--primary) px-20">
      {/* Logo */}
      <motion.div
        className="hidden md:flex md:items-center"
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Link href="/">
          <Image src={SiteLogo} alt="Probuilt Logo" width={147} height={147} />
        </Link>
      </motion.div>

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

      <motion.div
        className="flex gap-4 justify-center sm:justify-end items-center flex-1"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ margin: "-100px" }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
      >
        {/* CTA Buttons */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex gap-4"
        >
          <Button variant="primary" size="md">
            Register
          </Button>

          <Button variant="secondary" size="md">
            Log In
          </Button>
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="md:hidden flex items-center"
        >
          <button className="text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </motion.div>
      </motion.div>

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
