import React from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import { BanknoteArrowUp, ReceiptText } from "lucide-react";

const Construction = () => {
  return (
    <>
      <div
        className="relative bg-darkPurple py-[44px] md:py-[60px] lg:py-[80px] desktop:py-[100px]"
        style={{ zIndex: 9 }}
      >
        <SideSpaceContainer>
          <div className="flex flex-col gap-5 md:gap-8 items-center justify-center">
            <h3 className="text-lightPurple2 font-semibold text-xl md:text-2xl lg:text-[32px] desktop:text-[40px] desktop:leading-[120%]">
              Hva er byggelånsfinansiering?
            </h3>
            <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-6 laptop:gap-8 w-full">
              <div className="bg-lightPurple3 w-full rounded-lg p-4 md:p-6 lg:p-8">
                <div className="w-[48px] md:w-[56px] lg:w-[70px] h-[48px] md:h-[56px] lg:h-[70px] bg-white rounded-full flex items-center justify-center mb-6 md:mb-8">
                  <BanknoteArrowUp className="text-lightPurple3 h-6 lg:h-8 w-6 lg:w-8" />
                </div>
                <h4 className="text-lightPurple2 font-semibold text-base md:text-lg lg:text-xl mb-3 md:mb-4">
                  Fleksibel utbetaling i takt med fremdrift
                </h4>
                <ul className="flex flex-col gap-3 pl-4">
                  <li className="text-lightPurple2 text-xs md:text-sm list-disc">
                    I motsetning til et vanlig boliglån, utbetales byggelånet i
                    takt med fremdriften – ofte i tråd med fakturaene fra
                    entreprenør, elektriker eller leverandøre
                  </li>
                  <li className="text-lightPurple2 text-xs md:text-sm list-disc">
                    Dette gir deg økonomisk fleksibilitet og kontroll gjennom
                    hele byggeprosessen.
                  </li>
                </ul>
              </div>
              <div className="bg-lightPurple3 w-full rounded-lg p-4 md:p-6 lg:p-8">
                <div className="w-[48px] md:w-[56px] lg:w-[70px] h-[48px] md:h-[56px] lg:h-[70px] bg-white rounded-full flex items-center justify-center mb-6 md:mb-8">
                  <ReceiptText className="text-lightPurple3 h-6 lg:h-8 w-6 lg:w-8" />
                </div>
                <h4 className="text-lightPurple2 font-semibold text-base md:text-lg lg:text-xl mb-3 md:mb-4">
                  Avdragsfrihet - men rentebetaling
                </h4>
                <ul className="flex flex-col gap-3 pl-4">
                  <li className="text-lightPurple2 text-xs md:text-sm list-disc">
                    Byggelånet er avdragsfritt i byggeperioden, med månedlige
                    renteutbetalinger. Når boligen er ferdig, omgjøres det til
                    et ordinært boliglån basert på markedsverdien.
                  </li>
                  <li className="text-lightPurple2 text-xs md:text-sm list-disc">
                    Det betyr tydelige prosesser, rask saksbehandling og tett
                    oppfølging – slik at du får trygghet i hvert steg av
                    boligbyggingen.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </SideSpaceContainer>
      </div>
    </>
  );
};

export default Construction;
