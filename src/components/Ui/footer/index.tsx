import React from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import Ic_logo from "@/public/images/Ic_logo_footer.svg";
import facebook from "@/public/images/facebook.svg";
import instagram from "@/public/images/instagram.svg";
import linkedin from "@/public/images/linkedin.svg";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <>
      <div className="bg-green pt-10 md:pt-20 pb-7 md:pb-10">
        <SideSpaceContainer>
          <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-start gap-4 justify-between">
            <p className="text-lightGreenText text-lg md:text-xl lg:text-2xl">
              Alt du trenger – tomteanalyse, <br /> boligdrømmer og
              finansiering, <br />
              samlet på ett sted
            </p>
            <div className="flex gap-[100px] lg:gap-[116px] items-start">
              <div className="gap-2 md:gap-2.5 flex flex-col">
                <h4 className="text-lightGreenText text-sm md:text-base lg:text-lg mb-1.5 font-semibold">
                  Linker
                </h4>
                <Link
                  href={"/"}
                  className="text-xs md:text-sm lg:text-base text-lightGreenText"
                >
                  Tomteanalyse
                </Link>
                <Link
                  href={"/ferdighus"}
                  className="text-xs md:text-sm lg:text-base text-lightGreenText"
                >
                  Finansiering
                </Link>
                <Link
                  href={""}
                  className="text-xs md:text-sm lg:text-base text-lightGreenText"
                >
                  Ferdighus
                </Link>
                <Link
                  href={""}
                  className="text-xs md:text-sm lg:text-base text-lightGreenText"
                >
                  Hytte
                </Link>
              </div>
              <div className="gap-2 md:gap-2.5 flex flex-col">
                <h4 className="text-lightGreenText text-sm md:text-base lg:text-lg mb-1.5 font-semibold">
                  Kontakt
                </h4>
                <div className="text-xs md:text-sm lg:text-base text-lightGreenText">
                  +47 48 17 97 60
                </div>
                <div className="text-xs md:text-sm lg:text-base text-lightGreenText">
                  hei@iplot.no
                </div>
                <div className="text-xs md:text-sm lg:text-base text-lightGreenText">
                  Orgnr.: 834 632 772 MVA
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-end justify-between gap-2">
            <Image
              src={Ic_logo}
              alt="logo"
              className="w-[180px] lg:w-[300px] desktop:w-auto"
              fetchPriority="auto"
            />
            <div className="flex flex-row gap-2 sm:gap-4 items-center">
              <Image
                src={linkedin}
                alt="linkedin"
                className="w-[28px] lg:w-auto"
                fetchPriority="auto"
              />
              <Image
                src={facebook}
                alt="facebook"
                className="w-[28px] lg:w-auto"
                fetchPriority="auto"
              />
              <Image
                src={instagram}
                alt="instagram"
                className="w-[28px] lg:w-auto"
                fetchPriority="auto"
              />
            </div>
          </div>
          <div>
            <p className="text-xs md:text-sm lg:text-base text-lightGreenText text-center mt-[56px] lg:mt-[72px]">
              © 2025 iPlot AS. All rights reserved.
            </p>
          </div>
        </SideSpaceContainer>
      </div>
    </>
  );
};

export default Footer;
