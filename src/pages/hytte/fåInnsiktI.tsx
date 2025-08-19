import React from "react";
import SideSpaceContainer from "@/components/common/sideSpace";

const FåInnsiktI = () => {
  return (
    <>
      <div
        className="relative bg-navyBlue py-[44px] md:py-[60px] lg:py-[80px] desktop:py-[100px]"
        style={{ zIndex: 9 }}
      >
        <SideSpaceContainer>
          <div className="flex flex-col gap-5 md:gap-8 items-center justify-center">
            <h3 className="text-skyBlue font-semibold text-xl md:text-2xl lg:text-[32px] desktop:text-[40px] desktop:leading-[120%]">
              Utforsk hytteprodusenter
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 laptop:px-14 big:px-40 big:w-[1300px]">
              <div className="bg-navyBlue2 py-2 px-3 rounded-[50px] text-skyBlue font-medium text-xs md:text-sm lg:text-base">
                Fjellheimhytta (6)
              </div>
              <div className="bg-navyBlue2 py-2 px-3 rounded-[50px] text-skyBlue font-medium text-xs md:text-sm lg:text-base">
                BoligPartner (33)
              </div>
              {/* <div className="bg-navyBlue2 py-2 px-3 rounded-[50px] text-skyBlue font-medium text-xs md:text-sm lg:text-base">
                Blink-hus (19)
              </div>
              <div className="bg-navyBlue2 py-2 px-3 rounded-[50px] text-skyBlue font-medium text-xs md:text-sm lg:text-base">
                Eventyrhus (75)
              </div>
              <div className="bg-navyBlue2 py-2 px-3 rounded-[50px] text-skyBlue font-medium text-xs md:text-sm lg:text-base">
                Follohus (159)
              </div>
              <div className="bg-navyBlue2 py-2 px-3 rounded-[50px] text-skyBlue font-medium text-xs md:text-sm lg:text-base">
                HA Hus (18)
              </div>
              <div className="bg-navyBlue2 py-2 px-3 rounded-[50px] text-skyBlue font-medium text-xs md:text-sm lg:text-base">
                Idéhus (34)
              </div>
              <div className="bg-navyBlue2 py-2 px-3 rounded-[50px] text-skyBlue font-medium text-xs md:text-sm lg:text-base">
                Lillesandhus (94)
              </div>
              <div className="bg-navyBlue2 py-2 px-3 rounded-[50px] text-skyBlue font-medium text-xs md:text-sm lg:text-base">
                Mesterhus (47)
              </div>
              <div className="bg-navyBlue2 py-2 px-3 rounded-[50px] text-skyBlue font-medium text-xs md:text-sm lg:text-base">
                Nordbohus (27)
              </div>
              <div className="bg-navyBlue2 py-2 px-3 rounded-[50px] text-skyBlue font-medium text-xs md:text-sm lg:text-base">
                Norgeshus (37)
              </div>
              <div className="bg-navyBlue2 py-2 px-3 rounded-[50px] text-skyBlue font-medium text-xs md:text-sm lg:text-base">
                Systemhus (57)
              </div> */}
            </div>
          </div>
        </SideSpaceContainer>
      </div>
    </>
  );
};

export default FåInnsiktI;
