import React from "react";
import Image from "next/image";
import player1 from "@/assets/figma/player1.png";
import player2 from "@/assets/figma/player2.png";
import { image } from "framer-motion/client";

const Feedback = () => {
  const playerdata = [
    {
      image: player1,
      name: "Favour Onukwuli",
      club: "Sheffield Wednesday",
      feedback:
        "Every session feels designed to make me better where it matters most. I feel sharper, fitter, and more prepared for matches.",
    },
    {
      image: player2,
      name: "Lionel Ainsworth",
      club: "Aveley Football Club",
      feedback:
        "ProBuilt transformed how I train. Purposeful sessions and clear feedback helped me improve fast. I feel sharper and match-ready.",
    },
  ];
  return (
    <div className="my-16 md:mx-20 sm:mx-10 mx-8 text-(--secondary)">
      <h2 className="text-4xl font-medium">Results That Speak</h2>
      <h3 className="text-xl leading-tight text-(--accent)">
        Real feedback from players training for their position.
      </h3>
      <div className="flex flex-col md:flex-row gap-10 mt-7">
        {playerdata.map((player, index) => (
          <div key={index} className="flex flex-row gap-7 bg-[#27272E] rounded-[20px]">
            <div className="shrink-0">
              <Image src={player.image} alt={player.name} />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="md:text-[22px] text-[20px] font-semibold mb-2">
                {player.name}
              </h2>
              <h3 className="md:text-xl text-lg leading-tight text-(--accent) mb-7">
                {player.club}
              </h3>
              <p className="md:text-xl text-mdfont-regular leading-[136%] md:line-clamp-3 line-clamp-5 overflow-auto">
                {player.feedback}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feedback;
