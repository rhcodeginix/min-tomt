import React from "react";
import Hvordan_Tomteanalyse from "@/public/images/Hvordan_Tomteanalyse.png";
import Image from "next/image";
import { HandCoins, Banknote, Landmark, BellDot } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: (
        <HandCoins className="w-5 desktop:w-6 h-5 desktop:h-6 text-purple" />
      ),
      title: "Spesialist på byggelånsfinansiering",
      description:
        "Med digitale systemer og rådgivere fra banken kjenner vi prosessene.",
    },
    {
      icon: (
        <Banknote className="w-5 desktop:w-6 h-5 desktop:h-6 text-purple" />
      ),
      title: "En økonomisk plan reduserer overskridelser",
      description: "Lånesaker inkluderer en økonomisk plan for fremdrift.",
    },
    {
      icon: (
        <Landmark className="w-5 desktop:w-6 h-5 desktop:h-6 text-purple" />
      ),
      title: "Banken følger hele byggeprosessen",
      description: "Banken har tilgang til hele fremdriften i byggeprosessen.",
    },
    {
      icon: <BellDot className="w-5 desktop:w-6 h-5 desktop:h-6 text-purple" />,
      title: "Endringsmeldinger gjøres gjennom MinTomt",
      description: "Alle endringsmeldinger signeres og godkjennes elektronisk.",
    },
  ];
  return (
    <div className="pb-[44px] lg:pb-[58px] desktop:pb-[120px] flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2">
        <Image
          src={Hvordan_Tomteanalyse}
          alt="image"
          fetchPriority="auto"
          className="w-full h-full"
          style={{
            clipPath:
              "polygon(16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px), 0 16px)",
          }}
        />
      </div>

      <div
        className="w-full lg:w-1/2 bg-[#C7DBFA] p-7 desktop:px-14 big:px-20 flex items-center justify-center relative"
        style={{
          clipPath:
            "polygon(16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px), 0 16px)",
        }}
      >
        <div className="w-full">
          <h3
            className="text-black text-[20px] md:text-[24px] lg:text-[32px] desktop:text-[40px] font-bold mb-8 md:mb-10 desktop:mb-12"
            style={{ lineHeight: "120%" }}
          >
            Slik gjør vi låneprosessen enklere
          </h3>

          <div className="space-y-6 desktop:space-y-10 relative">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start">
                {index < steps.length - 1 && (
                  <div
                    className="absolute left-5 desktop:left-[28px] top-0 bottom-[36px] desktop:bottom-[28px] w-0.5 border-l border-white border-dashed"
                    style={{ zIndex: "-1" }}
                  ></div>
                )}

                <div className="flex-shrink-0 w-10 desktop:w-14 h-10 desktop:h-14 bg-white rounded-full flex items-center justify-center shadow-sm mr-3.5 md:mr-4 desktop:mr-6 relative">
                  {step.icon}
                </div>

                <div className="flex-1">
                  <h4 className="text-black font-semibold mb-2 text-sm md:text-base lg:text-lg">
                    {step.title}
                  </h4>
                  <p className="text-black text-xs md:text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
