import React from "react";
import Img_main_bg from "@/public/images/Img_main_bg.png";
import Ic_boligpartner from "@/public/images/Ic_boligpartner.png";
import Ic_eie from "@/public/images/Ic_eie.svg";
import Ic_fjellheimhytta from "@/public/images/Ic_fjellheimhytta.svg";
import Ic_check_true from "@/public/images/Ic_check_true.svg";
import Ic_sparbank from "@/public/images/Ic_sparbank.svg";
import SideSpaceContainer from "@/components/common/sideSpace";
import Image from "next/image";
import AdresseTab from "@/components/Ui/homePageSearchTab/adresse";
import { MoveRight } from "lucide-react";

const MainSection = () => {
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
                  Hva kan du bygge?
                </h1>
                <p className="text-white text-sm md:text-base lg:text-lg desktop:text-xl">
                  Gjør en rask tometeanalyse -{" "}
                  <span className="font-bold">helt kostnadfritt!</span>
                </p>
              </div>
              <div>
                <p className="text-white text-xs md:text-sm mb-4">
                  I samarbeid med Norges ledende ferdighusprodusenter:
                </p>
                <div className="flex items-center flex-wrap gap-3 md:gap-4">
                  <Image
                    src={Ic_boligpartner}
                    alt="boligpartner"
                    fetchPriority="auto"
                  />
                  <Image
                    src={Ic_fjellheimhytta}
                    alt="fjellheimhytta"
                    fetchPriority="auto"
                  />
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
              className="bg-lightGreen p-5 md:p-6 desktop:p-8 relative w-full laptop:w-[540px] flex flex-col gap-4 md:gap-6"
              style={{
                clipPath:
                  "polygon(16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px), 0 16px)",
              }}
            >
              <h4 className="text-black font-bold text-base md:text-lg lg:text-xl desktop:text-2xl">
                Se tomteanalyse av eiendommen din her
              </h4>
              <AdresseTab />
              <div className="flex flex-col gap-4">
                <div className="flex gap-2 items-start">
                  <Image src={Ic_check_true} alt="check" fetchPriority="auto" />
                  <p className="text-secondary text-xs md:text-sm">
                    Vi samler data fra ulike datakilder og presenter de for deg
                  </p>
                </div>
                <div className="flex gap-2 items-start">
                  <Image src={Ic_check_true} alt="check" fetchPriority="auto" />
                  <p className="text-secondary text-xs md:text-sm">
                    Sjekk BYA, kommune- og reguleringsplan, gesims- og mønehøyde
                    og parkering
                  </p>
                </div>
                <div className="flex gap-2 items-start">
                  <Image src={Ic_check_true} alt="check" fetchPriority="auto" />
                  <p className="text-secondary text-xs md:text-sm">
                    Se hva du kan bygge
                  </p>
                </div>
              </div>
              <div className="text-darkGreen text-xs md:text-sm lg:text-base font-semibold flex items-center gap-2">
                Jeg vil heller snakke med en rådgiver
                <MoveRight className="text-darkGreen" />
              </div>
            </div>
          </div>
        </SideSpaceContainer>
      </div>
    </>
  );
};

export default MainSection;
