"use client";
import React from "react";
import Img_Error from "@/public/images/Img_Error.png";
import Image from "next/image";

const NotFound: React.FC<{ error: any }> = ({ error }) => {
  return (
    <>
      <div className="flex items-center justify-center pt-[100px] md:pt-[125px] px-4">
        <div className="flex flex-col items-center">
          <Image src={Img_Error} alt="error" />
          <h3 className="text-black font-bold text-[23px] md:text-[32px] desktop:text-[40px] mb-3 md:mb-4">
            Aaaah! Her gikk det litt galt :(
          </h3>
          {error && (
            <p className="text-yellow italic text-xs md:text-sm mb-3 md:mb-4">
              Feilmelding: {error}
            </p>
          )}
          <div className="text-sm md:text-base text-secondary text-center">
            MinTomt.no har blitt varslet om feilen. <br /> Du kan oppdatere
            siden eller prøve igjen senere.
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
