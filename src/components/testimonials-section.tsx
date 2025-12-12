"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import placeholderAvatar from "@/assets/figma/avtar_placeholder.png";

type Testimonial = {
  id: string | number;
  quote: string;
  name: string;
  role: string;
  avatar: StaticImageData;
};

type Props = {
  items?: Testimonial[];
  autoPlayInterval?: number; // ms
  pauseOnHover?: boolean;
};

export default function TestimonialCarousel({
  items = [
    {
      id: 1,
      quote:
        "ProBuilt completely transformed how I train. The sessions are challenging but purposeful, and the feedback helped me improve faster than I expected. I feel sharper, more confident, and more prepared on match day.",
      name: "Josh Bohui",
      role: "Web Designer",
      avatar: placeholderAvatar,
    },
    {
      id: 2,
      quote:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      name: "Favour Onuwkuli",
      role: "Lead Developer",
      avatar: placeholderAvatar,
    },
    {
      id: 3,
      quote:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      name: "Lionel Ainsworth",
      role: "Head of Marketing",
      avatar: placeholderAvatar,
    },
  ],
  autoPlayInterval = 5000,
  pauseOnHover = true,
}: Props) {
  const [index, setIndex] = useState(0);
  const length = items.length;
  const intervalRef = useRef<number | null>(null);
  const pausedRef = useRef(false);

  // helpers
  const wrap = (i: number) => (i + length) % length;
  const goNext = () => setIndex((i) => wrap(i + 1));
  const goPrev = () => setIndex((i) => wrap(i - 1));

  // autoplay
  useEffect(() => {
    if (!autoPlayInterval || length <= 1) return;

    const start = () => {
      stop();
      intervalRef.current = window.setInterval(() => {
        if (!pausedRef.current) goNext();
      }, autoPlayInterval);
    };
    const stop = () => {
      if (intervalRef.current != null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlayInterval, length]);

  // pause/resume handlers
  const handleMouseEnter = () => {
    if (pauseOnHover) pausedRef.current = true;
  };
  const handleMouseLeave = () => {
    if (pauseOnHover) pausedRef.current = false;
  };

  // keyboard controls
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const current = items[index];
  const prev = items[wrap(index - 1)];
  const next = items[wrap(index + 1)];

  return (
    <section className="mt-12 mb-16 mx-20 text-(--secondary) bg-[#27272E] rounded-[30px] px-[70px] py-[92px]">
      <motion.div
        className="text-center mb-[67px]"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ margin: "-100px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2 className="text-(--secondary) text-4xl font-medium">What our clients say</h2>
      </motion.div>

      <div
        className="text-center select-none"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* CARD: quote */}
        <div className="flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={current.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45 }}
              className="text-[28px] leading-[130%] text-(--accent) mb-[121px] line-clamp-3 min-h-[108px]"
              aria-live="polite"
            >
              “{current.quote}”
            </motion.blockquote>
          </AnimatePresence>
        </div>

        {/* NAMES LINE: prev - current - next */}

        <div className="relative flex items-center justify-center gap-[171px] pt-[38px] border-t border-(--border-forms)">
          {/* previous name (clickable) */}
          <button
            onClick={goPrev}
            aria-label={`Previous testimonial: ${prev.name}`}
            className="flex gap-5 items-center text-sm md:text-base text-gray-400 hover:text-gray-200 transition-colors w-[248px]"
          >
            <Image
              src={prev.avatar}
              alt={prev.name}
              width={36}
              height={36}
              className="rounded-full"
            />
            <div className="flex flex-col items-start">
              <span className="truncate max-w-36">{prev.name}</span>
              <div className="text-xs text-(--accent)">{prev.role}</div>
            </div>
          </button>

          {/* current name (prominent) */}
          <div className="-top-0.5 left-1/2 absolute h-[3px] w-[331px] -translate-x-1/2 bg-(--accent) rounded-full" />
          <div className="flex gap-5 items-center w-[248px]">
            <Image
              src={prev.avatar}
              alt={prev.name}
              width={36}
              height={36}
              className="rounded-full"
            />
            <div className="flex flex-col items-start text-nowrap">
              <div className="text-lg md:text-xl font-semibold text-white">
                {current.name}
              </div>
              <div className="text-sm text-(--accent)">{current.role}</div>
            </div>
          </div>

          {/* next name (clickable) */}
          <button
            onClick={goNext}
            aria-label={`Next testimonial: ${next.name}`}
            className="flex gap-5 items-center text-sm md:text-base text-gray-400 hover:text-gray-200 transition-colors w-[248px]"
          >
            <Image
              src={next.avatar}
              alt={next.name}
              width={36}
              height={36}
              className="rounded-full"
            />
            <div className="flex flex-col items-start">
              <span className="truncate max-w-36">{next.name}</span>
              <div className="text-xs text-(--accent)">{next.role}</div>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
