import Image from "next/image";
import Ic_check_green_icon from "@/public/images/Ic_check_green_icon.svg";
import SideSpaceContainer from "@/components/common/sideSpace";

const PropertyDetails: React.FC<{
  CadastreDataFromApi: any;
  lamdaDataFromApi: any;
  askData: any;
  HouseModelData?: any;
  loading?: any;
  resultsLoading: any;
  BoxData: any;
  results: any;
}> = ({
  CadastreDataFromApi,
  lamdaDataFromApi,
  // askData,
  // HouseModelData,
  loading,
  resultsLoading,
  BoxData,
  results,
}) => {
  return (
    <>
      <div
        className="py-5"
        style={{
          boxShadow: "0px 1px 2px 0px #1018280F,0px 1px 3px 0px #1018281A",
        }}
      >
        <SideSpaceContainer>
          <div className="flex flex-wrap md:flex-nowrap gap-4 lg:gap-5 laptop:gap-[70px] justify-between">
            <div className="md:w-1/4 flex items-start gap-2.5 lg:gap-2 laptop:gap-3">
              <Image
                fetchPriority="auto"
                src={Ic_check_green_icon}
                alt="check"
              />
              <div className="flex flex-col gap-1">
                {loading ? (
                  <div className="w-[180px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary2 text-xs lg:text-sm">
                    Eiendommen er
                  </p>
                )}
                {loading ? (
                  <div className="w-[180px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-black text-sm lg:text-base font-semibold">
                    Ferdig regulert til boligformål
                  </p>
                )}
              </div>
            </div>
            <div className="md:w-1/4 flex items-start gap-2.5 lg:gap-2 laptop:gap-3">
              <Image
                fetchPriority="auto"
                src={Ic_check_green_icon}
                alt="check"
              />
              <div className="flex flex-col gap-1">
                {resultsLoading ? (
                  <div className="w-[180px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary2 text-xs lg:text-sm">
                    Eiendommen har en
                  </p>
                )}
                {resultsLoading ? (
                  <div className="w-[180px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-black text-sm lg:text-base font-semibold">
                    Utnyttelsesgrad på{" "}
                    {BoxData?.bya_percentage
                      ? BoxData?.bya_percentage
                      : results?.BYA?.rules?.[0]?.unit === "%"
                        ? results?.BYA?.rules?.[0]?.value
                        : (
                            (results?.BYA?.rules?.[0]?.value ?? 0) /
                              lamdaDataFromApi?.eiendomsInformasjon
                                ?.basisInformasjon?.areal_beregnet ?? 0 * 100
                          ).toFixed(2)}
                    %
                  </p>
                )}
              </div>
            </div>
            <div className="md:w-1/4 flex items-start gap-2.5 lg:gap-2 laptop:gap-3">
              <Image
                fetchPriority="auto"
                src={Ic_check_green_icon}
                alt="check"
              />
              <div className="flex flex-col gap-1">
                {loading ? (
                  <div className="w-[180px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary2 text-xs lg:text-sm">
                    Ekisterende BYA
                  </p>
                )}
                {loading ? (
                  <div className="w-[180px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-black text-sm lg:text-base font-semibold">
                    Utnyttelsesgrad på{" "}
                    {(() => {
                      const data =
                        CadastreDataFromApi?.buildingsApi?.response?.items?.map(
                          (item: any) => item?.builtUpArea
                        ) ?? [];

                      if (
                        lamdaDataFromApi?.eiendomsInformasjon?.basisInformasjon
                          ?.areal_beregnet
                      ) {
                        const totalData = data
                          ? data.reduce(
                              (acc: number, currentValue: number) =>
                                acc + currentValue,
                              0
                            )
                          : 0;

                        const result =
                          (totalData /
                            lamdaDataFromApi?.eiendomsInformasjon
                              ?.basisInformasjon?.areal_beregnet) *
                          100;
                        const formattedResult = result.toFixed(2);

                        return `${formattedResult} %`;
                      } else {
                        return "0";
                      }
                    })()}
                  </p>
                )}
                {resultsLoading ? (
                  <div className="w-[180px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-black text-xs lg:text-sm">
                    Tilgjengelig BYA{" "}
                    {(() => {
                      const data =
                        CadastreDataFromApi?.buildingsApi?.response?.items?.map(
                          (item: any) => item?.builtUpArea
                        ) ?? [];

                      if (BoxData) {
                        const totalData = data
                          ? data.reduce(
                              (acc: number, currentValue: number) =>
                                acc + currentValue,
                              0
                            )
                          : 0;

                        const result =
                          (totalData /
                            lamdaDataFromApi?.eiendomsInformasjon
                              ?.basisInformasjon?.areal_beregnet) *
                          100;
                        const formattedResult: any = result.toFixed(2);

                        return `${(
                          (BoxData?.bya_percentage
                            ? BoxData?.bya_percentage
                            : results?.BYA?.rules?.[0]?.unit === "%"
                              ? results?.BYA?.rules?.[0]?.value
                              : (
                                  (results?.BYA?.rules?.[0]?.value ?? 0) /
                                    lamdaDataFromApi?.eiendomsInformasjon
                                      ?.basisInformasjon?.areal_beregnet ??
                                  0 * 100
                                ).toFixed(2)) - formattedResult
                        ).toFixed(2)} %`;
                      } else {
                        return "0";
                      }
                    })()}
                  </p>
                )}
              </div>
            </div>
            <div className="md:w-1/4 flex items-start gap-2.5 lg:gap-2 laptop:gap-3">
              <Image
                fetchPriority="auto"
                src={Ic_check_green_icon}
                alt="check"
              />
              <div className="flex flex-col gap-1">
                {resultsLoading ? (
                  <div className="w-[180px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary2 text-xs lg:text-sm">
                    Boligen kan ha en
                  </p>
                )}
                {resultsLoading ? (
                  <div className="w-[180px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-black text-sm lg:text-base font-semibold">
                    Grunnflate på{" "}
                    {BoxData?.bya_area_m2
                      ? BoxData?.bya_area_m2
                      : results?.BYA?.rules?.[0]?.unit === "%"
                        ? (
                            ((lamdaDataFromApi?.eiendomsInformasjon
                              ?.basisInformasjon?.areal_beregnet ?? 0) *
                              (results?.BYA?.rules?.[0]?.value ?? 0)) /
                            100
                          ).toFixed(2)
                        : results?.BYA?.rules?.[0]?.value}{" "}
                    m<sup>2</sup>
                  </p>
                )}
                {resultsLoading ? (
                  <div className="w-[180px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-black text-xs lg:text-sm">
                    Tilgjengelig{" "}
                    {(() => {
                      const data =
                        CadastreDataFromApi?.buildingsApi?.response?.items?.map(
                          (item: any) => item?.builtUpArea
                        ) ?? [];

                      if (
                        BoxData?.bya_area_m2
                          ? BoxData?.bya_area_m2
                          : results?.BYA?.rules?.[0]
                      ) {
                        const totalData = data
                          ? data.reduce(
                              (acc: number, currentValue: number) =>
                                acc + currentValue,
                              0
                            )
                          : 0;

                        return (
                          <>
                            {(
                              (BoxData?.bya_area_m2
                                ? BoxData?.bya_area_m2
                                : results?.BYA?.rules?.[0]?.unit === "%"
                                  ? (
                                      ((lamdaDataFromApi?.eiendomsInformasjon
                                        ?.basisInformasjon?.areal_beregnet ??
                                        0) *
                                        (results?.BYA?.rules?.[0]?.value ??
                                          0)) /
                                      100
                                    ).toFixed(2)
                                  : results?.BYA?.rules?.[0]?.value) - totalData
                            ).toFixed(2)}
                            m<sup>2</sup>
                          </>
                        );
                      } else {
                        return "0";
                      }
                    })()}
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

export default PropertyDetails;
