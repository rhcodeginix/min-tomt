import React from "react";
import Img_main_bg from "@/public/images/Img_main_bg.png";
import Ic_eie from "@/public/images/Ic_eie.svg";
import Ic_check_true from "@/public/images/Ic_check_true.svg";
import Ic_sparbank from "@/public/images/Ic_sparbank.svg";
import Ic_vapp from "@/public/images/Ic_vapp.svg";
import SideSpaceContainer from "@/components/common/sideSpace";
import Image from "next/image";
import { MoveRight } from "lucide-react";
import { getVippsLoginUrl } from "@/utils/vippsAuth";
import { toast } from "@/hooks/use-toast";

const MainSection = () => {
  const handleVippsLogin = () => {
    try {
      const vippsUrl = getVippsLoginUrl();

      toast({
        title: "Redirecting to Vipps",
        description: `You'll be redirected to Vipps login page (${new URL(vippsUrl).origin}). Redirect URL: ${new URL(vippsUrl).searchParams.get("redirect_uri")}`,
      });

      setTimeout(() => {
        window.location.href = vippsUrl;
      }, 800);
    } catch (error) {
      console.error("Failed to initiate Vipps login:", error);
      toast({
        title: "Login Error",
        description: "Could not connect to Vipps. Please try again.",
        variant: "destructive",
      });
    }
  };
  return (
    <>
      <div
        className="pt-[84px] md:pt-[120px] desktop:pt-[128px] pb-[60px] md:pb-[80px] overflow-hidden relative"
        style={{
          backgroundImage: `url(${Img_main_bg.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <SideSpaceContainer>
          <div className="flex flex-col desktop:flex-row justify-between gap-4">
            <div className="flex flex-col gap-4 justify-between">
              <div>
                <h1 className="text-white font-bold text-[32px] sm:text-[40px] md:text-[44px] lg:text-[48px] desktop:text-[56px] mb-4 laptop:mb-6">
                  Vi hjelper deg med finansieringen
                </h1>
                <p className="text-white text-sm md:text-base lg:text-lg desktop:text-xl">
                  Vi kobler deg med riktig bank – raskt og kostnadsfritt!
                </p>
              </div>
              <div>
                <p className="text-white text-xs md:text-sm mb-4">
                  I samarbeid med noen av Norges ledende banker og
                  eiendomsmeglere
                </p>
                <div className="flex items-center flex-wrap gap-3 md:gap-4">
                  <Image src={Ic_eie} alt="eie" fetchPriority="auto" />
                  <Image
                    src={Ic_sparbank}
                    alt="sparbank"
                    fetchPriority="auto"
                  />
                </div>
              </div>
            </div>
            <div
              className="bg-lightPurple p-5 md:p-6 desktop:p-8 relative w-full laptop:w-[519px] flex flex-col gap-4 md:gap-6"
              style={{
                clipPath:
                  "polygon(16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px), 0 16px)",
              }}
            >
              <h4 className="text-black font-bold text-base md:text-lg lg:text-xl desktop:text-2xl">
                Start byggelånsprosessen på 1 minutt med Vipps
              </h4>
              <button
                className={`px-3 lg:px-4 lg:py-2.5 cursor-pointer flex justify-center items-center bg-purple rounded-[40px] transition-all duration-300 ease-out h-[40px] md:h-[48px] m-2 gap-2`}
                type="button"
                onClick={handleVippsLogin}
              >
                <span className="text-white font-semibold text-sm md:text-base">
                  Start lånesøknad med
                </span>
                <Image src={Ic_vapp} alt="vipps" fetchPriority="auto" />
              </button>
              <div className="flex flex-col gap-4">
                <div className="flex gap-2 items-start">
                  <Image src={Ic_check_true} alt="check" fetchPriority="auto" />
                  <p className="text-secondary text-xs md:text-sm">
                    Vi henter navn, adresse og kontaktinfo automatisk
                  </p>
                </div>
                <div className="flex gap-2 items-start">
                  <Image src={Ic_check_true} alt="check" fetchPriority="auto" />
                  <p className="text-secondary text-xs md:text-sm">
                    Vi deler aldri informasjon uten ditt samtykke. Søknaden er
                    helt uforpliktende.
                  </p>
                </div>
              </div>
              <div className="text-purple text-xs md:text-sm lg:text-base font-semibold flex items-center gap-2">
                Jeg vil heller snakke med en rådgiver
                <MoveRight className="text-purple" />
              </div>
            </div>
          </div>
        </SideSpaceContainer>
      </div>
    </>
  );
};

export default MainSection;
