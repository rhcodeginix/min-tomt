import Image from "next/image";
import Ic_check_green_icon from "@/public/images/Ic_check_green_icon.svg";
import SideSpaceContainer from "@/components/common/sideSpace";

const HouseDetailsection: React.FC<{
  loading: any;
  HouseModelData: any;
}> = ({ loading, HouseModelData }) => {
  return (
    <>
      <div
        className="py-3 md:py-5"
        style={{
          boxShadow: "0px 1px 2px 0px #1018280F,0px 1px 3px 0px #1018281A",
        }}
      >
        <SideSpaceContainer>
          <div className="flex flex-col sm:flex-row flex-wrap lg:flex-nowrap gap-2 md:gap-4 lg:justify-between">
            {/* <div className="w-full sm:w-[31%] lg:w-[20%] flex items-start gap-2 sm:gap-3">
              <Image
                fetchPriority="auto"
                src={Ic_check_green_icon}
                alt="check"
              />
              <div className="flex flex-col gap-1">
                <p className="text-secondary2 text-xs md:text-sm">
                  <span className="font-bold">
                    {HouseModelData?.Husdetaljer?.husmodell_name}
                  </span>{" "}
                  krever
                </p>
                <p className="text-black text-sm md:text-base font-medium">
                  Ferdig regulert til boligformål
                </p>
              </div>
            </div> */}
            <div className="w-full sm:w-[31%] lg:w-[20%] flex items-start gap-2 sm:gap-3">
              <Image
                fetchPriority="auto"
                src={Ic_check_green_icon}
                alt="check"
              />
              <div className="flex flex-col gap-1">
                {loading ? (
                  <div
                    className="w-[180px] h-[20px] rounded-lg custom-shimmer"
                    style={{ borderRadius: "8px" }}
                  ></div>
                ) : (
                  <p className="text-secondary2 text-xs md:text-sm">
                    <span className="font-bold">
                      {HouseModelData?.Husdetaljer?.husmodell_name}
                    </span>{" "}
                    passer for
                  </p>
                )}
                {loading ? (
                  <div
                    className="w-[180px] h-[20px] rounded-lg custom-shimmer"
                    style={{ borderRadius: "8px" }}
                  ></div>
                ) : (
                  <p className="text-black text-sm md:text-base font-medium">
                    {Array.isArray(HouseModelData?.Husdetaljer?.Tomtetype)
                      ? HouseModelData?.Husdetaljer?.Tomtetype.join(", ")
                      : HouseModelData?.Husdetaljer?.Tomtetype}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full sm:w-[31%] lg:w-[20%] flex items-start gap-2 sm:gap-3">
              <Image
                fetchPriority="auto"
                src={Ic_check_green_icon}
                alt="check"
              />
              <div className="flex flex-col gap-1">
                {loading ? (
                  <div
                    className="w-[180px] h-[20px] rounded-lg custom-shimmer"
                    style={{ borderRadius: "8px" }}
                  ></div>
                ) : (
                  <p className="text-secondary2 text-xs md:text-sm">
                    <span className="font-bold">
                      {HouseModelData?.Husdetaljer?.husmodell_name}
                    </span>{" "}
                    har
                  </p>
                )}
                {loading ? (
                  <div
                    className="w-[180px] h-[20px] rounded-lg custom-shimmer"
                    style={{ borderRadius: "8px" }}
                  ></div>
                ) : (
                  <p className="text-black text-sm md:text-base font-medium">
                    Mønehøyde på {HouseModelData?.Husdetaljer?.Mønehøyde} meter
                  </p>
                )}
              </div>
            </div>
            <div className="w-full sm:w-[31%] lg:w-[20%] flex items-start gap-2 sm:gap-3">
              <Image
                fetchPriority="auto"
                src={Ic_check_green_icon}
                alt="check"
              />
              <div className="flex flex-col gap-1">
                {loading ? (
                  <div
                    className="w-[180px] h-[20px] rounded-lg custom-shimmer"
                    style={{ borderRadius: "8px" }}
                  ></div>
                ) : (
                  <p className="text-secondary2 text-xs md:text-sm">
                    <span className="font-bold">
                      {HouseModelData?.Husdetaljer?.husmodell_name}
                    </span>{" "}
                    har
                  </p>
                )}
                {loading ? (
                  <div
                    className="w-[180px] h-[20px] rounded-lg custom-shimmer"
                    style={{ borderRadius: "8px" }}
                  ></div>
                ) : (
                  <p className="text-black text-sm md:text-base font-medium">
                    Gesimshøyde på {HouseModelData?.Husdetaljer?.Gesimshøyde}{" "}
                    meter
                  </p>
                )}
              </div>
            </div>
            <div className="w-full sm:w-[31%] lg:w-[20%] flex items-start gap-2 sm:gap-3">
              <Image
                fetchPriority="auto"
                src={Ic_check_green_icon}
                alt="check"
              />
              <div className="flex flex-col gap-1">
                {loading ? (
                  <div
                    className="w-[180px] h-[20px] rounded-lg custom-shimmer"
                    style={{ borderRadius: "8px" }}
                  ></div>
                ) : (
                  <p className="text-secondary2 text-xs md:text-sm">
                    <span className="font-bold">
                      {HouseModelData?.Husdetaljer?.husmodell_name}
                    </span>{" "}
                    har en
                  </p>
                )}
                {loading ? (
                  <div
                    className="w-[180px] h-[20px] rounded-lg custom-shimmer"
                    style={{ borderRadius: "8px" }}
                  ></div>
                ) : (
                  <p className="text-black text-sm md:text-base font-medium">
                    Grunnflate på {HouseModelData?.Husdetaljer?.BebygdAreal} m
                    <sup>2</sup>
                  </p>
                )}
              </div>
            </div>
          </div>
        </SideSpaceContainer>
      </div>
    </>
  );
};

export default HouseDetailsection;
