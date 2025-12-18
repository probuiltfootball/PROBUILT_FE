"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Apple from "@/assets/figma/Social Media Icon Square/Apple.png";
import Android from "@/assets/figma/Social Media Icon Square/Android.png";
import { Button } from "./ui/button";
import Link from "next/link";

export default function HubSection() {
  return (
    <motion.div className="my-16 md:mx-20 sm:mx-10 mx-8 text-(--secondary)">
      <motion.div
        className="text-center mb-7"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ margin: "-100px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2 className="text-4xl font-medium mb-3">
          Hub: Your Digital Football Training Hub
        </h2>
        <h3 className="text-xl leading-tight text-(--accent)">
          Flexible digital training with structured programs you can follow anywhere.
        </h3>
      </motion.div>

      {/* Card */}
      <motion.div className="flex flex-col md:flex-row justify-center items-center md:gap-10 gap-4">
        <motion.div
          className="border-2 border-(--accent) rounded-3xl flex-1 bg-[#27272E] pt-32.5 pb-34.75 pl-17.5 pr-25.75"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <h2 className="text-4xl font-semibold mb-3 leading-12.5">
            Receive Expert Coaching, <br /> Get Real Results
          </h2>
          <p className="text-xl font-normal mb-10 line-clamp-2 min-h-16 leading-[1.36]">
            Level up with structured sessions designed by top coaches.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/download/ios">
              <Button
                variant="primary"
                size="lg"
                className="flex items-center justify-center"
              >
                <Image src={Apple} alt="Apple Icon" className="mr-2 w-5 h-5" />
                Download for iOS
              </Button>
            </Link>
          </motion.div>
        </motion.div>
        <motion.div
          className="border-2 border-(--accent) rounded-3xl flex-1 bg-[#27272E] pt-32.5 pb-34.75 pl-17.5 pr-25.75"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <h2 className="text-4xl font-semibold mb-3 leading-12.5">
            Then Take Those Lessons Onto The Pitch
          </h2>
          <p className="text-xl font-normal mb-10 line-clamp-2 min-h-16 leading-[1.36]">
            Lorem ipsum dolor sit amet consectetur adipiscing elit dolor semper at ac
            tempus enim.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/download/android">
              <Button
                variant="primary"
                size="lg"
                className="flex items-center justify-center text-nowrap"
              >
                <Image src={Android} alt="Android Icon" className="mr-2 w-5 h-5" />
                Download for Android
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
