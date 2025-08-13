import React from "react";
import SideSpaceContainer from "@/components/common/sideSpace";

const FåInnsiktI = () => {
  return (
    <>
      <div
        className="relative bg-green py-[44px] md:py-[60px] lg:py-[80px] desktop:py-[100px]"
        style={{ zIndex: 9 }}
      >
        <SideSpaceContainer>
          <div className="flex flex-col gap-5 md:gap-8 items-center justify-center">
            <h3 className="text-lightGreenText font-semibold text-xl md:text-2xl lg:text-[32px] desktop:text-[40px] desktop:leading-[120%]">
              Få innsikt i
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 laptop:px-14 big:px-40 big:w-[1280px]">
              <div className="bg-green3 py-2 px-3 rounded-[50px] text-lightGreenText font-medium text-xs md:text-sm lg:text-base">
                BYA
              </div>
              <div className="bg-green3 py-2 px-3 rounded-[50px] text-lightGreenText font-medium text-xs md:text-sm lg:text-base">
                BYA i %
              </div>
              <div className="bg-green3 py-2 px-3 rounded-[50px] text-lightGreenText font-medium text-xs md:text-sm lg:text-base">
                Bebyggelse
              </div>
              <div className="bg-green3 py-2 px-3 rounded-[50px] text-lightGreenText font-medium text-xs md:text-sm lg:text-base">
                Eiere
              </div>
              <div className="bg-green3 py-2 px-3 rounded-[50px] text-lightGreenText font-medium text-xs md:text-sm lg:text-base">
                Gesimshøyde
              </div>
              <div className="bg-green3 py-2 px-3 rounded-[50px] text-lightGreenText font-medium text-xs md:text-sm lg:text-base">
                Mønehøyde
              </div>
              <div className="bg-green3 py-2 px-3 rounded-[50px] text-lightGreenText font-medium text-xs md:text-sm lg:text-base">
                Kommuneplan
              </div>
              <div className="bg-green3 py-2 px-3 rounded-[50px] text-lightGreenText font-medium text-xs md:text-sm lg:text-base">
                Reguleringsplan
              </div>
              <div className="bg-green3 py-2 px-3 rounded-[50px] text-lightGreenText font-medium text-xs md:text-sm lg:text-base">
                Parkeringsnorm
              </div>
              <div className="bg-green3 py-2 px-3 rounded-[50px] text-lightGreenText font-medium text-xs md:text-sm lg:text-base">
                + mye mer!
              </div>
            </div>
          </div>
        </SideSpaceContainer>
      </div>
    </>
  );
};

export default FåInnsiktI;
