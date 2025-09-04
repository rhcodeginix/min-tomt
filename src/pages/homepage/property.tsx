import { useEffect, useState } from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import Button from "@/components/common/button";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
} from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { useRouter } from "next/router";
import { formatPrice } from "@/pages/belop/belopProperty";
import NorkartMap from "@/components/map";
import Image from "next/image";
import Ic_area1 from "@/public/images/Ic_area1.svg";
import Ic_area2 from "@/public/images/Ic_area2.svg";
import Ic_Bya from "@/public/images/Ic_Bya.svg";
import Ic_Bya_m2 from "@/public/images/Ic_Bya_m2.svg";

const Property: React.FC = () => {
  const router = useRouter();

  const [data, setData] = useState<any>({
    houseModelProperty: [],
    isLoading: false,
  });

  useEffect(() => {
    const fetchProperty = async () => {
      setData((prev: any) => ({ ...prev, isLoading: true }));

      try {
        let allPlots: any = [];
        const plotPromises = [];

        plotPromises.push(
          getDocs(query(collection(db, "empty_plot"), limit(5)))
        );
        const plotSnapshots = await Promise.all(plotPromises);
        allPlots = plotSnapshots.flatMap((snapshot) =>
          snapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter(
              (plot: any) => plot?.CadastreDataFromApi?.presentationAddressApi
            )
        );

        setData({
          houseModelProperty: allPlots.slice(0, 3),
          isLoading: false,
        });
      } catch (error) {
        console.error("Error fetching properties:", error);
        setData((prev: any) => ({ ...prev, isLoading: false }));
      }
    };

    fetchProperty();
  }, []);

  const [boxDataList, setBoxDataList] = useState<any[]>([]);
  const [results, setResult] = useState<any>(null);

  useEffect(() => {
    if (!data?.houseModelProperty) return;

    const fetchAll = async () => {
      const results: any[] = [];
      const finalResults: any[] = [];

      for (const property of data.houseModelProperty) {
        const BBOXData =
          property?.CadastreDataFromApi?.cadastreApi?.response?.item?.geojson
            ?.bbox;

        if (!BBOXData) {
          results.push(null);
          continue;
        }

        try {
          const response = await fetch(
            "https://d8t0z35n2l.execute-api.eu-north-1.amazonaws.com/prod/bya",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                url: `https://wms.geonorge.no/skwms1/wms.reguleringsplaner?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetFeatureInfo&QUERY_LAYERS=Planomrade_02,Arealformal_02&LAYERS=Planomrade_02,Arealformal_02&INFO_FORMAT=text/html&CRS=EPSG:25833&BBOX=${BBOXData[0]},${BBOXData[1]},${BBOXData[2]},${BBOXData[3]}&WIDTH=800&HEIGHT=600&I=400&J=300`,
                plot_size_m2:
                  property?.lamdaDataFromApi?.eiendomsInformasjon
                    ?.basisInformasjon?.areal_beregnet ?? 0,
              }),
            }
          );
          const json = await response.json();
          results.push(json);

          if (json && json?.plan_link) {
            const res = await fetch(
              "https://iplotnor-areaplanner.hf.space/resolve",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  step1_url: json?.plan_link,
                  api_token: `${process.env.NEXT_PUBLIC_DOCUMENT_TOKEN}`,
                }),
              }
            );

            if (!res.ok) throw new Error("Request failed");

            const data = await res.json();

            if (data?.inputs?.internal_plan_id) {
              const uniqueId = String(data?.inputs?.internal_plan_id);

              if (!uniqueId) {
                console.warn("No uniqueId found, skipping Firestore setDoc");
                return;
              }

              const plansDocRef = doc(db, "mintomt_plans", uniqueId);

              const existingDoc = await getDoc(plansDocRef);

              if (existingDoc.exists()) {
                setResult(existingDoc?.data()?.rule);
                return;
              }
            }
            if (data && data?.rule_book) {
              const responseData = await fetch(
                "https://iplotnor-norwaypropertyagent.hf.space/extract_json_direct_gpt",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    pdf_url: data?.rule_book?.link,
                    plot_size_m2: `${
                      property?.lamdaDataFromApi?.eiendomsInformasjon
                        ?.basisInformasjon?.areal_beregnet ?? 0
                    }`,
                  }),
                }
              );

              if (!responseData.ok) {
                throw new Error("Network response was not ok");
              }

              const responseResult = await responseData.json();
              finalResults.push(responseResult?.data);

              if (responseResult?.data) {
                const uniqueId = String(data?.inputs?.internal_plan_id);

                if (!uniqueId) {
                  console.warn("No uniqueId found, skipping Firestore setDoc");
                  return;
                }

                const plansDocRef = doc(db, "mintomt_plans", uniqueId);

                const formatDate = (date: Date) =>
                  date
                    .toLocaleString("sv-SE", { timeZone: "UTC" })
                    .replace(",", "");

                const existingDoc = await getDoc(plansDocRef);

                if (!existingDoc.exists()) {
                  await setDoc(plansDocRef, {
                    id: uniqueId,
                    updatedAt: formatDate(new Date()),
                    createdAt: formatDate(new Date()),
                    documents: { ...data },
                    rule: { ...responseResult?.data },
                  });
                }
              }
            }
          }
        } catch (e) {
          console.error("Error fetching data:", e);
          results.push(null);
        }
      }

      setBoxDataList(results);
      setResult(finalResults);
    };

    fetchAll();
  }, [data?.houseModelProperty]);

  return (
    <>
      <div className="py-[44px] md:py-[58px] desktop:py-[120px]">
        <SideSpaceContainer>
          <h2 className="text-black text-[20px] md:text-[24px] lg:text-[32px] desktop:text-[40px] font-bold mb-5 lg:mb-[20px] text-center md:mb-[32px] desktop:mb-[40px]">
            Eksempler på tomteanalyser
          </h2>
          {data?.isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {Array.from({ length: 3 }).map((_: any, index: number) => (
                <div
                  key={index}
                  className="border border-gray3 rounded-[8px] p-3 md:p-5 cursor-pointer hover:shadow-[0px_4px_24px_0px_#0000001A]"
                >
                  <div className="relative mb-3 desktop:mb-4">
                    <div className="w-full h-[200px] md:h-[234px] rounded-[8px] overflow-hidden">
                      <div className="w-full h-full rounded-lg custom-shimmer"></div>
                    </div>
                  </div>
                  <div className="w-[240px] h-[20px] rounded-lg custom-shimmer mb-2 md:mb-3 desktop:mb-4"></div>
                  <div className="w-full h-[20px] rounded-lg custom-shimmer mb-2 md:mb-3 desktop:mb-4"></div>
                  <div className="flex items-center gap-4 sm:gap-2.5 md:gap-4 lg:gap-2 desktop:gap-6 justify-between mb-3 md:mb-4 desktop:mb-5">
                    <div className="flex flex-col gap-2 items-center">
                      <div className="w-8 h-8 rounded-lg custom-shimmer"></div>
                      <div className="w-full h-[20px] rounded-lg custom-shimmer"></div>
                    </div>
                    <div className="h-[40px] border-l border-gray2"></div>
                    <div className="flex flex-col gap-2 items-center">
                      <div className="w-8 h-8 rounded-lg custom-shimmer"></div>
                      <div className="w-full h-[20px] rounded-lg custom-shimmer"></div>
                    </div>
                    <div className="h-[40px] border-l border-gray2"></div>
                    <div className="flex flex-col gap-2 items-center">
                      <div className="w-8 h-8 rounded-lg custom-shimmer"></div>
                      <div className="w-full h-[20px] rounded-lg custom-shimmer"></div>
                    </div>
                    <div className="h-[40px] border-l border-gray2"></div>
                    <div className="flex flex-col gap-2 items-center">
                      <div className="w-8 h-8 rounded-lg custom-shimmer"></div>
                      <div className="w-full h-[20px] rounded-lg custom-shimmer"></div>
                    </div>
                  </div>
                  <div className="gap-4 md:gap-5 lg:gap-6 flex items-center justify-between">
                    <div>
                      <div className="w-[120px] h-[20px] rounded-lg custom-shimmer mb-1"></div>
                      <div className="w-[150px] h-[20px] rounded-lg custom-shimmer"></div>
                    </div>
                    <div className="w-[180px] h-[40px] rounded-lg custom-shimmer"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {data?.houseModelProperty.map((property: any, index: number) => {
                const BoxData = boxDataList[index];

                return (
                  <div
                    key={index}
                    className="border border-gray3 rounded-[8px] p-3 md:p-5 cursor-pointer hover:shadow-[0px_4px_24px_0px_#0000001A]"
                    onClick={() => {
                      router.push(
                        `/regulations?kommunenummer=${property?.lamdaDataFromApi?.searchParameters?.kommunenummer}&gardsnummer=${property?.lamdaDataFromApi?.searchParameters?.gardsnummer}&bruksnummer=${property?.lamdaDataFromApi?.searchParameters?.bruksnummer}`
                      );
                      const currIndex = 0;
                      localStorage.setItem("currIndex", currIndex.toString());
                    }}
                  >
                    <div className="relative mb-3 desktop:mb-4">
                      <div className="w-full h-[200px] md:h-[234px] rounded-[8px] overflow-hidden">
                        {property?.lamdaDataFromApi?.coordinates
                          ?.convertedCoordinates && (
                          <NorkartMap
                            coordinates={
                              property?.lamdaDataFromApi?.coordinates
                                ?.convertedCoordinates
                            }
                            MAX_ZOOM={20}
                          />
                        )}
                      </div>
                    </div>
                    <h4 className="text-black text-sm md:text-base lg:text-lg lg:leading-[30px] mb-3 md:mb-4 desktop:mb-5 font-bold">
                      {
                        property?.CadastreDataFromApi?.presentationAddressApi
                          ?.response?.item?.formatted?.line1
                      }{" "}
                      <span className="font-normal">
                        {
                          property?.CadastreDataFromApi?.presentationAddressApi
                            ?.response?.item?.formatted?.line2
                        }
                      </span>
                    </h4>
                    <p className="text-secondary text-xs md:text-sm mb-2 md:mb-3 desktop:mb-4">
                      Tomten kan bebygges med en{" "}
                      <span className="text-[#05000F]">
                        grunnflate på{" "}
                        {
                          property?.CadastreDataFromApi?.cadastreApi?.response
                            ?.item?.specifiedArea
                        }{" "}
                        m<sup>2</sup>
                      </span>
                    </p>
                    <div className="flex items-center gap-4 sm:gap-2.5 md:gap-4 lg:gap-2 desktop:gap-6 justify-between mb-3 md:mb-4 desktop:mb-5">
                      <div className="flex flex-col gap-2 items-center">
                        <Image src={Ic_area1} alt="area" fetchPriority="auto" />
                        <p className="text-darkBlack text-xs md:text-sm font-semibold">
                          {
                            property?.CadastreDataFromApi?.cadastreApi?.response
                              ?.item?.specifiedArea
                          }{" "}
                          <span className="text-secondary font-normal">
                            m<sup>2</sup>
                          </span>
                        </p>
                      </div>
                      <div className="h-[40px] border-l border-gray2"></div>
                      <div className="flex flex-col gap-2 items-center">
                        <Image src={Ic_Bya} alt="area" fetchPriority="auto" />
                        <p className="text-darkBlack text-xs md:text-sm font-semibold">
                          {BoxData?.bya_percentage
                            ? BoxData?.bya_percentage
                            : results?.BYA?.rules?.[0]?.unit === "%"
                              ? results?.BYA?.rules?.[0]?.value
                              : (
                                  (results?.BYA?.rules?.[0]?.value ?? 0) /
                                    property?.lamdaDataFromApi
                                      ?.eiendomsInformasjon?.basisInformasjon
                                      ?.areal_beregnet ?? 0 * 100
                                ).toFixed(2)}{" "}
                          %
                        </p>
                      </div>
                      <div className="h-[40px] border-l border-gray2"></div>
                      <div className="flex flex-col gap-2 items-center">
                        <Image
                          src={Ic_Bya_m2}
                          alt="area"
                          fetchPriority="auto"
                        />
                        <p className="text-darkBlack text-xs md:text-sm font-semibold">
                          {BoxData?.bya_area_m2 ?? BoxData?.bya_area_m2
                            ? BoxData?.bya_area_m2
                            : results?.BYA?.rules?.[0]?.unit === "%"
                              ? (
                                  ((property?.lamdaDataFromApi
                                    ?.eiendomsInformasjon?.basisInformasjon
                                    ?.areal_beregnet ?? 0) *
                                    (results?.BYA?.rules?.[0]?.value ?? 0)) /
                                  100
                                ).toFixed(2)
                              : results?.BYA?.rules?.[0]?.value}{" "}
                          <span className="text-secondary font-normal">
                            m<sup>2</sup>
                          </span>
                        </p>
                      </div>
                      <div className="h-[40px] border-l border-gray2"></div>
                      <div className="flex flex-col gap-2 items-center">
                        <Image src={Ic_area2} alt="area" fetchPriority="auto" />
                        <p className="text-darkBlack text-xs md:text-sm font-semibold">
                          0{" "}
                          <span className="text-secondary font-normal">
                            m<sup>2</sup>
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="gap-4 md:gap-5 lg:gap-6 flex items-center justify-between">
                      <div>
                        <p className="text-secondary text-xs md:text-sm mb-1">
                          Byggekost fra
                        </p>
                        <h6 className="text-xs md:text-sm font-bold desktop:text-base text-black">
                          {property.pris ? formatPrice(property.pris) : 0}
                        </h6>
                      </div>
                      <Button
                        text="Se detaljer"
                        className="border-2 border-darkGreen bg-white text-darkGreen sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
                        onClick={() => {
                          router.push(
                            `/regulations?kommunenummer=${property?.lamdaDataFromApi?.searchParameters?.kommunenummer}&gardsnummer=${property?.lamdaDataFromApi?.searchParameters?.gardsnummer}&bruksnummer=${property?.lamdaDataFromApi?.searchParameters?.bruksnummer}`
                          );
                          const currIndex = 0;
                          localStorage.setItem(
                            "currIndex",
                            currIndex.toString()
                          );
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SideSpaceContainer>
      </div>
    </>
  );
};

export default Property;
