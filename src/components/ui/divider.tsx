import Image from "next/image";
import DividerSvg from "@/assets/figma/Divider.svg";

export function Divider() {
  return (
    <div className="flex justify-center w-full">
      <Image src={DividerSvg} alt="divider" className="w-[90%] h-auto" />
    </div>
  );
}
