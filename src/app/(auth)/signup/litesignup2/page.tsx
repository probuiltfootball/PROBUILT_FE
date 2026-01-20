"use client";
import { Footer } from "@/components/footer";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

const LiteStep2 = () => {
  const [position, setPosition] = useState<string>("position");
  const [ageRange, setAgeRange] = useState<string>("18_25");
  const [country, setCountry] = useState<string>("country");
  const [playingLevel, setPlayingLevel] = useState<string>("Grassroots / Amateur");
  return (
    <div>
      <Navbar />
      <div className="mt-38 mb-16 md:mx-20 sm:mx-10 mx-8 text-(--secondary) bg-[#27272E] rounded-[30px] flex flex-col md:items-center p-8 md:p-12 lg:p-20 gap-6 text-center">
        <h2 className="text-4xl font-medium">Create your ProBuilt Account</h2>
        <h3 className="text-xl leading-tight text-(--accent)">
          Step 2 of 4 — Playing profile
        </h3>
        <form className="space-y-6 text-left">
          <div>
            <label
              htmlFor="Primary Position"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Primary Position
            </label>
            <select
              id="primary_position"
              className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00FFC2] focus:outline-none transition-colors"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            >
              <option value="position" disabled>
                Position
              </option>
              <option value="forward">Forward</option>
              <option value="midfielder">Midfielder</option>
              <option value="defender">Defender</option>
              <option value="goalkeeper">Goalkeeper</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="Age Range"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Age Range
            </label>
            <select
              id="age_range"
              className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00FFC2] focus:outline-none transition-colors"
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value)}
            >
              <option value="under_18">Under 18</option>
              <option value="18_25">18-25</option>
              <option value="25_34">25-34</option>
              <option value="35_44">35-44</option>
              <option value="45_plus">45+</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="Country or Region"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Country or Region
            </label>
            <select
              id="country_or_region"
              className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00FFC2] focus:outline-none transition-colors"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="country" disabled>
                Country
              </option>
              <option value="usa">United States</option>
              <option value="canada">Canada</option>
              <option value="uk">United Kingdom</option>
              <option value="australia">Australia</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="Playing Level"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Playing Level
            </label>
            <select
              id="playing_level"
              className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00FFC2] focus:outline-none transition-colors"
              value={playingLevel}
              onChange={(e) => setPlayingLevel(e.target.value)}
            >
              <option value="Grassroots / Amateur">Grassroots / Amateur</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="professional">Professional</option>
            </select>
          </div>
          <div className="flex flex-col items-center justify-center gap-8 mt-8">
            <span className="block">
              You’ll start on ProBuilt Lite — upgrade anytime.
            </span>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div>
              <Link href="/signup/litesignup3">
                <Button variant="primary" size="lg" className="flex-1">
                  Next Step
                </Button>
              </Link>
            </div>
            <div>
              <Link href="/membership">
                <Button variant="secondary" size="lg" className="flex-1">
                  Upgrade Plan
                </Button>
              </Link>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default LiteStep2;
