import Image from "next/image";
import Ic_check_green_icon from "@/public/images/Ic_check_green_icon.svg";
import SideSpaceContainer from "@/components/common/sideSpace";
import { useEffect, useState } from "react";

const PropertyDetails: React.FC<{
  CadastreDataFromApi: any;
  lamdaDataFromApi: any;
  askData: any;
  HouseModelData?: any;
  loading?: any;
}> = ({
  CadastreDataFromApi,
  lamdaDataFromApi,
  askData,
  HouseModelData,
  loading,
}) => {
  const BBOXData =
    CadastreDataFromApi?.cadastreApi?.response?.item?.geojson?.bbox;

  const [BoxData, setBoxData] = useState<any>(null);

  useEffect(() => {
    const fetchPlotData = async () => {
      try {
        const response = await fetch(
          "https://d8t0z35n2l.execute-api.eu-north-1.amazonaws.com/prod/bya",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              url: `https://wms.geonorge.no/skwms1/wms.reguleringsplaner?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetFeatureInfo&QUERY_LAYERS=Planomrade_02,Arealformal_02&LAYERS=Planomrade_02,Arealformal_02&INFO_FORMAT=text/html&CRS=EPSG:25833&BBOX=${BBOXData[0]},${BBOXData[1]},${BBOXData[2]},${BBOXData[3]}&WIDTH=800&HEIGHT=600&I=400&J=300`,
              plot_size_m2:
                lamdaDataFromApi?.eiendomsInformasjon?.basisInformasjon
                  ?.areal_beregnet ?? 0,
            }),
          }
        );

        const json = await response.json();
        setBoxData(json);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (CadastreDataFromApi) {
      fetchPlotData();
    }
  }, [CadastreDataFromApi]);

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
                {loading ? (
                  <div className="w-[180px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary2 text-xs lg:text-sm">
                    Eiendommen har en
                  </p>
                )}
                {loading ? (
                  <div className="w-[180px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-black text-sm lg:text-base font-semibold">
                    Utnyttelsesgrad på{" "}
                    {BoxData?.bya_percentage ??
                      askData?.bya_calculations?.input?.bya_percentage}
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

                        return `${formattedResult}  %`;
                      } else {
                        return "0";
                      }
                    })()}
                  </p>
                )}
                {loading ? (
                  <div className="w-[180px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-black text-xs lg:text-sm">
                    Tilgjengelig BYA{" "}
                    {(() => {
                      const data =
                        CadastreDataFromApi?.buildingsApi?.response?.items?.map(
                          (item: any) => item?.builtUpArea
                        ) ?? [];

                      if (
                        askData?.bya_calculations?.results?.total_allowed_bya
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
                        const formattedResult: any = result.toFixed(2);

                        return `${(
                          askData?.bya_calculations?.input?.bya_percentage -
                          formattedResult
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
                {loading ? (
                  <div className="w-[180px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary2 text-xs lg:text-sm">
                    Boligen kan ha en
                  </p>
                )}
                {loading ? (
                  <div className="w-[180px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-black text-sm lg:text-base font-semibold">
                    Grunnflate på{" "}
                    {BoxData?.bya_area_m2 ??
                      HouseModelData?.Husdetaljer?.BebygdAreal}{" "}
                    m<sup>2</sup>
                  </p>
                )}
                {loading ? (
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
                        askData?.bya_calculations?.results?.total_allowed_bya
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
                              askData?.bya_calculations?.results
                                ?.total_allowed_bya - totalData
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
