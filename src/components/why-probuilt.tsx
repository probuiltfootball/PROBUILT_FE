"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import checkmark from "@/assets/figma/Social Media Icon Square/Check_Circle.png";
import mediaPlayer_placeholder from "@/assets/figma/Media Player.png";

const WhyProbuilt = () => {
  return (
    <div className="flex flex-col md:flex-row gap-15 justify-between rounded-[30px] md:p-21.25 p-8 text-(--secondary)">
      <div className="flex flex-col gap-4">
        <h2 className="text-4xl font-medium">Why Footballers Choose ProBuilt</h2>
        <h3 className="text-xl leading-tight text-(--accent)">
          Train with structure, track real progress, and improve with purpose.
        </h3>
        <ul className="space-y-5 flex flex-col mt-1">
          <li className="flex items-center">
            <Image src={checkmark} alt="checkmark" className="w-5 h-5 mr-2" />
            Train with structure
          </li>
          <li className="flex items-center">
            <Image src={checkmark} alt="checkmark" className="w-5 h-5 mr-2" />
            Stay consistent with visible progress
          </li>
          <li className="flex items-center">
            <Image src={checkmark} alt="checkmark" className="w-5 h-5 mr-2" />
            Learn from UEFA qualified coaches and driven players
          </li>
        </ul>
        <motion.div
          className="flex flex-row md:gap-4 gap-2 mt-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/signup?plan=trial">
              <Button variant="primary" size="lg" className="flex-1">
                Start Free
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
      <div className="">
        <Image
          src={mediaPlayer_placeholder}
          alt="media player"
          className="rounded-[20px]"
        />
      </div>
    </div>
  );
};

export default WhyProbuilt;
