"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Apple from "@/assets/figma/Social Media Icon Square/Apple.png";
import Android from "@/assets/figma/Social Media Icon Square/Android.png";
import { Button } from "./ui/button";

export default function HubSection() {
  return (
    <motion.div className="mt-12 mb-16 mx-20 h-[647px]">
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
        <h3 className="text-xl leading-tight">
          Flexible digital training with structured programs you can follow anywhere.
        </h3>
      </motion.div>

      {/* Card */}
      <motion.div className="flex flex-row justify-center items-center gap-10">
        <motion.div
          className="border-2 rounded-3xl flex-1 bg-[#27272E] pt-[130px] pb-[139px] pl-[70px] pr-[103px]"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <h2 className="text-4xl font-semibold mb-3 leading-[50px]">
            Receive Expert Coaching, <br /> Get Real Results
          </h2>
          <p className="text-xl font-normal mb-10 line-clamp-2 min-h-16 leading-[1.36]">
            Level up with structured sessions designed by top coaches.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="primary"
              size="lg"
              className="flex items-center justify-center"
            >
              <Image src={Apple} alt="Apple Icon" className="mr-2 w-5 h-5" />
              Download for iOS
            </Button>
          </motion.div>
        </motion.div>
        <motion.div
          className="border-2 rounded-3xl flex-1 bg-[#27272E] pt-[130px] pb-[139px] pl-[70px] pr-[103px]"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <h2 className="text-4xl font-semibold mb-3 leading-[50px]">
            Then Take Those Lessons Onto The Pitch
          </h2>
          <p className="text-xl font-normal mb-10 line-clamp-2 min-h-16 leading-[1.36]">
            Lorem ipsum dolor sit amet consectetur adipiscing elit dolor semper at ac
            tempus enim.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="primary"
              size="lg"
              className="flex items-center justify-center text-nowrap"
            >
              <Image src={Android} alt="Android Icon" className="mr-2 w-5 h-5" />
              Download for Android
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
