import React, { useEffect, useState } from "react";
import { useAddress } from "@/context/addressContext";
import Ic_Step_icon from "@/public/images/Ic_Step_icon.svg";
import Image from "next/image";
import { useRouter } from "next/router";
import GoogleMapComponent from "../map";

export function toCamelCase(str: any) {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const PropertyDetail: React.FC<any> = ({
  CadastreDataFromApi,
  lamdaDataFromApi,
  loading,
}) => {
  const { getAddress } = useAddress();
  const router = useRouter();

  const { kommunenummer, gardsnummer, bruksnummer } = router.query;

  const [address, setAddress] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://ws.geonorge.no/adresser/v1/sok?gardsnummer=${gardsnummer}&kommunenummer=${kommunenummer}&bruksnummer=${bruksnummer}`
        );
        const result = await response.json();

        setAddress(result?.adresser[0]);
      } catch (error: any) {
        console.error("API error:", error);
      }
    };

    if (kommunenummer && gardsnummer && bruksnummer) {
      fetchData();
    }
  }, [kommunenummer, gardsnummer, bruksnummer]);

  return (
    <>
      <div className="flex flex-col laptop:flex-row laptop:items-center gap-4 laptop:justify-between">
        <div className="flex flex-col sm:flex-row gap-3 md:gap-5 sm:items-center">
          <div className="rounded-[12px] overflow-hidden w-full sm:w-[135px] h-[200px] sm:h-[130px]">
            {loading ? (
              <div className="w-full h-full rounded-lg custom-shimmer"></div>
            ) : (
              <>
                {lamdaDataFromApi?.coordinates?.convertedCoordinates && (
                  // <NorkartMap
                  //   coordinates={
                  //     lamdaDataFromApi?.coordinates?.convertedCoordinates
                  //   }
                  //   MAX_ZOOM={18}
                  // />
                  <GoogleMapComponent
                    coordinates={
                      lamdaDataFromApi?.coordinates?.convertedCoordinates
                    }
                    // zoom={18}
                  />
                )}
              </>
            )}
          </div>
          <div>
            {loading ? (
              <div className="w-[250px] h-[20px] rounded-lg custom-shimmer mb-1 md:mb-2"></div>
            ) : (
              <h2 className="text-darkBlack font-medium text-base md:text-xl lg:text-2xl lg:leading-[30px] mb-1 md:mb-2 one_line_elipse">
                {CadastreDataFromApi?.presentationAddressApi?.response?.item
                  ?.formatted?.line1 ?? address?.adressetekst}{" "}
                <span className="font-medium">
                  (
                  {toCamelCase(
                    CadastreDataFromApi?.presentationAddressApi?.response?.item
                      ?.municipality?.municipalityName ?? address?.poststed
                  )}{" "}
                  Kommune)
                </span>
              </h2>
            )}
            {loading ? (
              <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
            ) : (
              <p className="text-secondary2 text-sm md:text-base desktop:text-lg">
                {CadastreDataFromApi?.presentationAddressApi?.response?.item
                  ?.formatted?.line2 ??
                  `${address?.postnummer} ${address?.poststed}`}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-start laptop:items-end">
          <div className="flex items-center gap-4 mb-2 md:mb-3">
            <div className="flex items-center gap-4">
              {loading ? (
                <div className="w-[70px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <div className="text-secondary2 text-xs md:text-sm lg:text-base">
                  Gnr:{" "}
                  <span className="text-black font-semibold">
                    {lamdaDataFromApi?.searchParameters?.gardsnummer}
                  </span>
                </div>
              )}
              {loading ? (
                <div className="w-[70px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <div className="text-secondary2 text-xs md:text-sm lg:text-base">
                  Bnr:{" "}
                  <span className="text-black font-semibold">
                    {lamdaDataFromApi?.searchParameters?.bruksnummer}
                  </span>
                </div>
              )}
              {loading ? (
                <div className="w-[70px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <div className="text-secondary2 text-xs md:text-sm lg:text-base">
                  Snr:{" "}
                  <span className="text-black font-semibold">
                    {getAddress?.bokstav}
                  </span>
                </div>
              )}
              <div className="h-[12px] border-l border-[#5D6B98]"></div>
              {loading ? (
                <div className="w-[70px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <div className="text-secondary2 text-xs md:text-sm lg:text-base">
                  moh.{" "}
                  <span className="text-black font-semibold">
                    {getAddress?.representasjonspunkt &&
                      getAddress?.representasjonspunkt.lat
                        .toFixed(2)
                        .toString()
                        .replace(".", ",")}
                  </span>
                </div>
              )}
            </div>
          </div>
          {loading ? (
            <div className="w-[200px] h-[20px] rounded-lg custom-shimmer"></div>
          ) : (
            <div className="hidden md:flex items-center gap-1 sm:gap-2 rounded-[50px] bg-[#EDFCF2] py-2 px-3 whitespace-normal">
              <Image src={Ic_Step_icon} alt="icon" className="w-4 sm:w-auto" />
              <div className="text-black text-xs md:text-sm lg:text-base whitespace-normal">
                <span className="font-bold">Tomten</span> er i samsvar med alle
                reguleringsbestemmelser.
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PropertyDetail;
