import React from "react";
import Image from "next/image";
import signup_image from "@/assets/figma/placeholder.png";
import checkmark from "@/assets/figma/Social Media Icon Square/Check_Circle.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const LiteSignupForm = () => {
  return (
    <div className="mt-38 mb-16 md:mx-20 sm:mx-10 mx-8 text-(--secondary)">
      <div className="text-center mb-7">
        <h2 className="text-4xl font-medium mb-3">Set up your ProBuilt Experience</h2>
        <h3 className="text-xl leading-tight text-(--turquoise)">
          We’ll use this to recommend the most relevant training and features for you.
        </h3>
      </div>

      {/* Card */}
      <div className="flex flex-col md:flex-row gap-15 bg-(--card-bg) rounded-[30px] p-8 md:p-12 lg:p-20">
        <div>
          <Image
            src={signup_image}
            alt="Signup Illustration"
            className="rounded-xl object-fill"
          />
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <Button variant="tag" size="md" className="bg-[#e6e6e6]">
              Lite
            </Button>
          </div>
          <h2 className="text-4xl">Set Up Your Experience</h2>
          <h3 className="text-xl leading-tight text-(--turquoise)">
            Everyone starts free. You can upgrade anytime.
          </h3>
          <ul className="flex flex-col gap-5 my-3">
            <li className="flex">
              <Image src={checkmark} alt="checkmark" className="w-5 h-5 mr-2" />
              <span>Confirm your goals</span>
            </li>
            <li className="flex">
              <Image src={checkmark} alt="checkmark" className="w-5 h-5 mr-2" />
              <span>Set training focus</span>
            </li>
            <li className="flex">
              <Image src={checkmark} alt="checkmark" className="w-5 h-5 mr-2" />
              <span>Start your ProBuilt training journey</span>
            </li>
          </ul>
          <div className="flex flex-row md:gap-4 mt-auto">
            <div>
              <Link href="/signup/litesignup1" className="w-full">
                <Button variant="primary" size="lg" className="flex-1">
                  Continue Setup
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiteSignupForm;
