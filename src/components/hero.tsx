"use client";

import { motion } from "framer-motion";
import { FiZap } from "react-icons/fi";

const featurePills = [
  "App Router",
  "Server Components",
  "Tailwind CSS",
  "Redux Toolkit",
  "Framer Motion",
];

export function Hero() {
  return (
    <motion.header
      className="card-surface relative overflow-hidden p-10 text-center md:text-left"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.span
        className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1 text-sm font-semibold uppercase tracking-widest text-indigo-900 dark:text-indigo-100"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <FiZap className="text-lg text-yellow-400" />
        PROBUILT Starter
      </motion.span>
      <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
        Production-ready Next.js foundation.
      </h1>
      <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 md:text-xl">
        Batteries included with theming, animation, and global state so you can go from
        idea to polished experience in minutes.
      </p>

      <motion.div
        className="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.08,
            },
          },
        }}
      >
        {featurePills.map((pill) => (
          <motion.span
            key={pill}
            className="rounded-full border border-white/30 bg-white/50 px-4 py-1 text-sm font-medium text-slate-900 backdrop-blur dark:bg-white/10 dark:text-slate-100"
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              visible: { opacity: 1, scale: 1 },
            }}
          >
            {pill}
          </motion.span>
        ))}
      </motion.div>
    </motion.header>
  );
}
