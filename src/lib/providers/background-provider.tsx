
import Image from "next/image";

// Background gallery images
import bg from "@/assets/football/bg.avif";


export function BackgroundProvider() {


    return (
        <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none  bg-[#00000090]">
            <Image
                src={bg}
                alt="Football ground"
                fill
                className={`
                        object-cover object-bottom
                        absolute inset-0
                        transition-opacity duration-1000 opacity-10
                    `}
            />
        </div>
    );
}
