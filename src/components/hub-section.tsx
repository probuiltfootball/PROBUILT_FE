"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import imgHubLanding from "@/assets/jpeg/img-hub-landing.jpg";
import Apple from "@/assets/figma/Social Media Icon Square/Apple.png";
import Android from "@/assets/figma/Social Media Icon Square/Android.png";
import { Button } from "./ui/button";
export default function HubSection() {
  return (
    <motion.div className="mt-12 mb-16 mx-20 h-[647px] text-(--secondary)">
      <motion.div
        className="text-center mb-7"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ margin: "-100px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2 className="text-(--secondary) text-4xl font-medium mb-3">
          Hub: Your Digital Football Training Hub
        </h2>
        <h3 className="text-(--accent) text-xl leading-tight">
          Flexible digital training with structured programs you can follow anywhere.
        </h3>
      </motion.div>

                {/* Card */}
                <motion.div
                    className="bg-[#2E2E2E80] rounded-3xl border border-[#2A2A2A] overflow-hidden flex flex-col md:flex-row"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ margin: "-100px" }}
                    whileHover={{
                        scale: 1.02,
                        boxShadow: "0 0 30px rgba(0, 255, 194, 0.3)",
                        transition: { duration: 0.3 }
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >

                    {/* Left Content Section */}
                    <div className="md:w-1/2 p-10 lg:p-14 flex flex-col justify-center h-[644px]">
                        <h4 className="text-white text-3xl md:text-4xl font-bold mb-6">
                            Train Smarter, Anytime.
                        </h4>

                        <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                            Your all-in-one digital hub for drills, feedback, and
                            guided skill development.
                        </p>

                        {/* Feature List */}
                        <ul className="space-y-5 mb-10 text-gray-300">
                            {[
                                { icon: "📚", text: "Step-by-step video lessons from UEFA coaches." },
                                { icon: "⏱️", text: "Sessions that fit your schedule, train anytime." },
                                { icon: "⚽", text: "Build habits with daily training routines." },
                            ].map((item, index) => (
                                <motion.li
                                    key={index}
                                    className="flex items-start gap-3"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ margin: "-100px" }}
                                    transition={{
                                        duration: 0.5,
                                        ease: "easeOut",
                                        delay: 0.2 + (index * 0.1)
                                    }}
                                >
                                    <span className="text-[#00FFC2] text-xl">{item.icon}</span>
                                    {item.text}
                                </motion.li>
                            ))}
                        </ul>

                        {/* Buttons */}
                        <motion.div
                            className="flex flex-wrap gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ margin: "-100px" }}
                            transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    href="/membership"
                                    className="bg-[#00FFC2] hover:bg-[#00E0AA] transition-colors text-black px-20 py-2 rounded-full hover:opacity-90 transition inline-block"
                                >
                                    View Plans
                                </Link>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    href="/membership"
                                    className="border border-gray-500 text-white px-20 py-2 rounded-full hover:bg-gray-800 transition inline-block"
                                >
                                    Get Started
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Right Image Section */}
                    <div className="md:w-1/2 relative h-[644px] w-full md:h-auto">
                        <Image
                            src={imgHubLanding}
                            alt="Your Digital Training Ground"
                            fill
                            className="object-cover"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
      {/* Card */}
      <motion.div className="flex flex-row justify-center items-center gap-10">
        <motion.div
          className="border-2 border-(--accent) rounded-3xl flex-1 bg-[#27272E] pt-[130px] pb-[139px] pl-[70px] pr-[103px]"
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
              className="text-(--primary) flex items-center justify-center"
            >
              <Image src={Apple} alt="Apple Icon" className="mr-2 w-5 h-5" />
              Download for iOS
            </Button>
          </motion.div>
        </motion.div>
        <motion.div
          className="border-2 border-(--accent) rounded-3xl flex-1 bg-[#27272E] pt-[130px] pb-[139px] pl-[70px] pr-[103px]"
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
