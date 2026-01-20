"use client";
import { Footer } from "@/components/footer";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import checkmark from "@/assets/figma/Social Media Icon Square/Check_Circle.png";
import profile_icon from "@/assets/figma/Social Media Icon Square/person_accent.png";
import tactic_icon from "@/assets/figma/Social Media Icon Square/tactic.png";
import calender_clock_icon from "@/assets/figma/Social Media Icon Square/calendar_clock.png";
import star_icon from "@/assets/figma/Social Media Icon Square/kid_star.png";
import alarm_icon from "@/assets/figma/Social Media Icon Square/alarm.png";

const LiteStep4 = () => {
  return (
    <div>
      <Navbar />
      <div className="mt-38 mb-16 md:mx-20 sm:mx-10 mx-8 text-(--secondary) bg-[#27272E] rounded-[30px] flex flex-col md:items-center p-8 md:p-12 lg:p-20 gap-6 text-center">
        <h2 className="text-4xl font-medium">You’re all set, John 👋</h2>
        <h3 className="text-xl leading-tight text-(--accent) mb-5">
          Your personalised ProBuilt experience is ready.
        </h3>
        <div className="flex flex-col border-2 border-(--accent) rounded-[20px] p-12.5 gap-6">
          <div className="flex flex-row items-center gap-6 mb-3">
            <Image src={checkmark} alt="checkmark" className="w-6" />
            Your Training Profile
          </div>
          <div>
            <table className="space-y-7">
              <tr className="flex flex-row items-center space-x-6">
                <td>
                  <Image src={profile_icon} alt="profile icon" className="w-6" />
                </td>
                <td className="w-33.5">Position</td>
                <td className="text-(--accent)">Attacking Midfield</td>
              </tr>
              <tr className="flex flex-row items-center space-x-6">
                <td>
                  <Image src={tactic_icon} alt="tactic icon" className="w-6" />
                </td>
                <td className="w-33.5">Training Focus</td>
                <td className="text-(--accent)">Improve Match Performance</td>
              </tr>
              <tr className="flex flex-row items-center space-x-6">
                <td>
                  <Image
                    src={calender_clock_icon}
                    alt="calendar clock icon"
                    className="w-6"
                  />
                </td>
                <td className="w-33.5">Training Frequency</td>
                <td className="text-(--accent)">1-2 Sessions Per Week</td>
              </tr>
              <tr className="flex flex-row items-center space-x-6">
                <td>
                  <Image src={star_icon} alt="star icon" className="w-6" />
                </td>
                <td className="w-33.5">Current Plan</td>
                <td className="text-(--accent)">
                  Lite <span className="text-gray-50"> (Upgrade Anytime)</span>
                </td>
              </tr>
            </table>
            <hr className="border-(--accent) my-7" />
            <Link href="/sessions" className="flex justify-center">
              <Button variant="primary" size="lg">
                Start First Session
              </Button>
            </Link>
          </div>
        </div>
        <span className="flex gap-3 justify-center mt-7">
          <Image src={alarm_icon} alt="alarm icon" className="w-6" /> First session takes
          about 60 minutes.
        </span>
      </div>
      <Footer />
    </div>
  );
};

export default LiteStep4;
