"use client";
import { Footer } from "@/components/footer";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { fa, tr } from "zod/locales";

const LiteStep3 = () => {
  const [focusAreas, setFocusAreas] = useState<string>("position");
  const [favoritePlayer, setFavoritePlayer] = useState<string>("jude_bellingham");
  const [trainLocation, setTrainLocation] = useState<string>("team_sessions");
  const [trainingFrequency, setTrainingFrequency] = useState<string>("1-2_sessions");

  return (
    <div>
      <Navbar />
      <div className="mt-38 mb-16 md:mx-20 sm:mx-10 mx-8 text-(--secondary) bg-[#27272E] rounded-[30px] flex flex-col md:items-center p-8 md:p-12 lg:p-20 gap-6 text-center">
        <h2 className="text-4xl font-medium">Create your ProBuilt Account</h2>
        <h3 className="text-xl leading-tight text-(--accent)">
          Step 3 of 4 — Training focus
        </h3>
        <form className="space-y-6 text-left">
          <div>
            <label
              htmlFor="choose_focus_areas"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Choose up to 2 focus areas
            </label>
            <select
              id="choose_focus_areas"
              className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00FFC2] focus:outline-none transition-colors"
              value={focusAreas}
              onChange={(e) => setFocusAreas(e.target.value)}
            >
              <option value="position" disabled>
                Position
              </option>
              <option value="dribbling">Dribbling</option>
              <option value="shooting">Shooting</option>
              <option value="passing">Passing</option>
              <option value="defending">Defending</option>
              <option value="fitness">Fitness</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="choose_favourite_player"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Choose your favourite player
            </label>
            <select
              id="choose_favourite_player"
              className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00FFC2] focus:outline-none transition-colors"
              value={favoritePlayer}
              onChange={(e) => setFavoritePlayer(e.target.value)}
            >
              <option value="jude_bellingham">Jude Bellingham</option>
              <option value="lionel_messi">Lionel Messi</option>
              <option value="cristiano_ronaldo">Cristiano Ronaldo</option>
              <option value="kylian_mbappe">Kylian Mbappé</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="where_do_you_train_most"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Where do you train most?
            </label>
            <select
              id="where_do_you_train_most"
              className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00FFC2] focus:outline-none transition-colors"
              value={trainLocation}
              onChange={(e) => setTrainLocation(e.target.value)}
            >
              <option value="team_sessions">Team sessions</option>
              <option value="individual_sessions">Individual sessions</option>
              <option value="gym_training">Gym training</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="training_frequency"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              How often can you train per week?
            </label>
            <select
              id="training_frequency"
              className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00FFC2] focus:outline-none transition-colors"
              value={trainingFrequency}
              onChange={(e) => setTrainingFrequency(e.target.value)}
            >
              <option value="1-2_sessions">1–2 sessions</option>
              <option value="3-4_sessions">3–4 sessions</option>
              <option value="5+_sessions">5+ sessions</option>
            </select>
          </div>
          <div className="flex flex-col items-center justify-center gap-8 mt-8">
            <span className="block">
              You’ll start on ProBuilt Lite — upgrade anytime.
            </span>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div>
              <Link href="/signup/litesignup4">
                <Button variant="primary" size="lg" className="flex-1">
                  Final Step
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

export default LiteStep3;
