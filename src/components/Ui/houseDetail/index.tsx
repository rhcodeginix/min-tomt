import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Illustrasjoner from "../RegulationHusmodell/Illustrasjoner";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { useUserLayoutContext } from "@/context/userLayoutContext";
import Ic_close_darkgreen from "@/public/images/Ic_close_darkgreen.svg";
import Modal from "@/components/common/modal";
import Image from "next/image";

const HouseDetailPage: React.FC = () => {
  const router = useRouter();
  const id = router.query["husmodellId"];
  const getEmbedUrl = (url: string) => {
    const videoId = url?.split("v=")[1]?.split("&")[0];
    return videoId
      ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=0&disablekb=1&fs=0`
      : "";
  };
  const [finalData, setFinalData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const husmodellData = finalData?.Husdetaljer;
  const [isCall, setIsCall] = useState(false);

  const { loginUser, setLoginUser } = useUserLayoutContext();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const husmodellDocRef = doc(db, "house_model", String(id));
        const husmodellDocSnap = await getDoc(husmodellDocRef);

        if (husmodellDocSnap.exists()) {
          setFinalData(husmodellDocSnap.data());
        } else {
          console.error("No document found for plot or husmodell ID.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id && isCall) {
      fetchData();
    }
  }, [id, isCall]);
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("min_tomt_login") === "true";
    if (isLoggedIn) {
      setLoginUser(true);
      setIsCall(true);
    }
  }, []);
  useEffect(() => {
    if (!loginUser) {
      setIsPopupOpen(true);
    } else {
      setIsPopupOpen(false);
    }
  }, [loginUser]);

  // const [supplierData, setSupplierData] = useState<any>(null);

  // useEffect(() => {
  //   const getData = async () => {
  //     try {
  //       const supplierDocRef = doc(
  //         db,
  //         "suppliers",
  //         husmodellData?.Leverandører
  //       );
  //       const docSnap: any = await getDoc(supplierDocRef);

  //       if (docSnap.exists()) {
  //         setSupplierData(docSnap.data());
  //       } else {
  //         console.error(
  //           "No document found for ID:",
  //           husmodellData?.Leverandører
  //         );
  //       }
  //     } catch (error) {
  //       console.error("Error fetching supplier data:", error);
  //     }
  //   };
  //   if (husmodellData?.Leverandører) {
  //     getData();
  //   }
  // }, [husmodellData?.Leverandører]);

  useEffect(() => {
    if (isPopupOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isPopupOpen]);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const popup = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popup.current && !popup.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <div className="w-full flex flex-col lg:flex-row gap-5 md:gap-6 lg:gap-10 desktop:gap-[60px] mb-8">
        <div className="w-full lg:w-[43%]">
          {/* <h4 className="text-black mb-4 md:mb-6 font-semibold text-lg md:text-xl desktop:text-2xl">
                {husmodellData?.husmodell_name}
              </h4> */}
          {/* <div className="relative">
                <img
                  src={husmodellData?.photo}
                  alt="image"
                  className="w-full h-[262px] object-cover rounded-[12px] overflow-hidden"
                />
                <img
                  src={supplierData?.photo}
                  alt="image"
                  className="absolute top-[12px] left-[12px] bg-[#FFFFFFB2] py-2 px-3 flex items-center justify-center rounded-[32px] w-[130px]"
                />
              </div> */}
          {/* <div className="my-4 md:my-[20px] flex items-center justify-between">
                <div className="flex flex-col gap-1 md:gap-2">
                  <p className="text-secondary text-sm md:text-base">
                    Pris fra
                  </p>
                  <h4 className="text-base md:text-lg desktop:text-xl font-semibold text-black">
                    {formatCurrency(husmodellData?.pris)}
                  </h4>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                  <div className="text-secondary text-xs md:text-sm">
                    <span className="text-black font-semibold">
                      {husmodellData?.BRATotal}
                    </span>{" "}
                    m<sup>2</sup>
                  </div>
                  <div className="h-[12px] w-[1px] border-l border-gray"></div>
                  <div className="text-secondary text-xs md:text-sm">
                    <span className="text-black font-semibold">
                      {husmodellData?.Soverom}
                    </span>{" "}
                    soverom
                  </div>
                  <div className="h-[12px] w-[1px] border-l border-gray"></div>
                  <div className="text-secondary text-xs md:text-sm">
                    <span className="text-black font-semibold">
                      {husmodellData?.Bad}
                    </span>{" "}
                    bad
                  </div>
                </div>
              </div> */}
          <div className="w-full flex flex-col sm:flex-row gap-4 md:gap-6 desktop:gap-8 mb-8 md:mb-[60px]">
            <div className="w-full sm:w-1/2 border-t-2 border-b-0 border-l-0 border-r-0 border-primary pt-3 md:pt-4">
              <table className="table-auto border-0 w-full text-left property_detail_tbl">
                <tbody>
                  <tr>
                    <td className="text-left pb-3 md:pb-[16px] text-secondary text-xs md:text-sm whitespace-nowrap">
                      BRA total (bruksareal)
                    </td>
                    {loading ? (
                      <div
                        className="w-[80px] h-[20px] rounded-lg custom-shimmer"
                        style={{ borderRadius: "8px" }}
                      ></div>
                    ) : (
                      <td className="text-right pb-3 md:pb-[16px] text-black text-xs md:text-sm font-semibold whitespace-nowrap">
                        {husmodellData?.BRATotal} m<sup>2</sup>
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td className="text-left pb-3 md:pb-[16px] text-secondary text-xs md:text-sm whitespace-nowrap">
                      GUA (Gulvareal):
                    </td>
                    {loading ? (
                      <div
                        className="w-[80px] h-[20px] rounded-lg custom-shimmer"
                        style={{ borderRadius: "8px" }}
                      ></div>
                    ) : (
                      <td className="text-right pb-3 md:pb-[16px] text-black text-xs md:text-sm font-semibold whitespace-nowrap">
                        {husmodellData?.PRom} m<sup>2</sup>
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td className="text-left pb-3 md:pb-[16px] text-secondary text-xs md:text-sm whitespace-nowrap">
                      Bebygd Areal
                    </td>
                    {loading ? (
                      <div
                        className="w-[80px] h-[20px] rounded-lg custom-shimmer"
                        style={{ borderRadius: "8px" }}
                      ></div>
                    ) : (
                      <td className="text-right pb-3 md:pb-[16px] text-black text-xs md:text-sm font-semibold whitespace-nowrap">
                        {husmodellData?.BebygdAreal} m<sup>2</sup>
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td className="text-left pb-3 md:pb-[16px] text-secondary text-xs md:text-sm whitespace-nowrap">
                      Lengde
                    </td>
                    {loading ? (
                      <div
                        className="w-[80px] h-[20px] rounded-lg custom-shimmer"
                        style={{ borderRadius: "8px" }}
                      ></div>
                    ) : (
                      <td className="text-right pb-3 md:pb-[16px] text-black text-xs md:text-sm font-semibold whitespace-nowrap">
                        {husmodellData?.Lengde}
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td className="text-left pb-3 md:pb-[16px] text-secondary text-xs md:text-sm whitespace-nowrap">
                      Bredde
                    </td>
                    {loading ? (
                      <div
                        className="w-[80px] h-[20px] rounded-lg custom-shimmer"
                        style={{ borderRadius: "8px" }}
                      ></div>
                    ) : (
                      <td className="text-right pb-3 md:pb-[16px] text-black text-xs md:text-sm font-semibold whitespace-nowrap">
                        {husmodellData?.Bredde}
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td className="text-left pb-3 md:pb-[16px] text-secondary text-xs md:text-sm whitespace-nowrap">
                      Soverom
                    </td>
                    {loading ? (
                      <div
                        className="w-[80px] h-[20px] rounded-lg custom-shimmer"
                        style={{ borderRadius: "8px" }}
                      ></div>
                    ) : (
                      <td className="text-right pb-3 md:pb-[16px] text-black text-xs md:text-sm font-semibold whitespace-nowrap">
                        {husmodellData?.Soverom}
                      </td>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="w-full sm:w-1/2 border-t-2 border-b-0 border-l-0 border-r-0 border-primary pt-3 md:pt-4">
              <table className="table-auto border-0 w-full text-left property_detail_tbl">
                <tbody>
                  <tr>
                    <td className="text-left pb-3 md:pb-[16px] text-secondary text-xs md:text-sm whitespace-nowrap">
                      Bad
                    </td>
                    {loading ? (
                      <div
                        className="w-[80px] h-[20px] rounded-lg custom-shimmer"
                        style={{ borderRadius: "8px" }}
                      ></div>
                    ) : (
                      <td className="text-right pb-3 md:pb-[16px] text-black text-xs md:text-sm font-semibold whitespace-nowrap">
                        {husmodellData?.Bad}
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td className="text-left pb-3 md:pb-[16px] text-secondary text-xs md:text-sm whitespace-nowrap">
                      Innvendig bod
                    </td>
                    {loading ? (
                      <div
                        className="w-[80px] h-[20px] rounded-lg custom-shimmer"
                        style={{ borderRadius: "8px" }}
                      ></div>
                    ) : (
                      <td className="text-right pb-3 md:pb-[16px] text-black text-xs md:text-sm font-semibold whitespace-nowrap">
                        {husmodellData?.InnvendigBod}
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td className="text-left pb-3 md:pb-[16px] text-secondary text-xs md:text-sm whitespace-nowrap">
                      Energimerking
                    </td>
                    {loading ? (
                      <div
                        className="w-[80px] h-[20px] rounded-lg custom-shimmer"
                        style={{ borderRadius: "8px" }}
                      ></div>
                    ) : (
                      <td className="text-right pb-3 md:pb-[16px] text-black text-xs md:text-sm font-semibold whitespace-nowrap">
                        {husmodellData?.Energimerking}
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td className="text-left pb-3 md:pb-[16px] text-secondary text-xs md:text-sm whitespace-nowrap">
                      Tilgjengelig bolig
                    </td>
                    {loading ? (
                      <div
                        className="w-[80px] h-[20px] rounded-lg custom-shimmer"
                        style={{ borderRadius: "8px" }}
                      ></div>
                    ) : (
                      <td className="text-right pb-3 md:pb-[16px] text-black text-xs md:text-sm font-semibold whitespace-nowrap">
                        {husmodellData?.TilgjengeligBolig}
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td className="text-left pb-3 md:pb-[16px] text-secondary text-xs md:text-sm whitespace-nowrap">
                      Tomtetype
                    </td>
                    {loading ? (
                      <div
                        className="w-[80px] h-[20px] rounded-lg custom-shimmer"
                        style={{ borderRadius: "8px" }}
                      ></div>
                    ) : (
                      <td className="text-right pb-3 md:pb-[16px] text-black text-xs md:text-sm font-semibold whitespace-nowrap">
                        {Array.isArray(husmodellData?.Tomtetype)
                          ? husmodellData.Tomtetype.join(", ")
                          : husmodellData?.Tomtetype}
                      </td>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <h2 className="text-black mb-4 md:mb-6 font-semibold text-lg md:text-xl desktop:text-2xl">
            Plantegninger og fasader
          </h2>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {loading ? (
              <>
                <div
                  className="w-full h-[100px] rounded-lg custom-shimmer mb-2"
                  style={{ borderRadius: "8px" }}
                ></div>
                <div
                  className="w-full h-[100px] rounded-lg custom-shimmer mb-2"
                  style={{ borderRadius: "8px" }}
                ></div>
                <div
                  className="w-full h-[100px] rounded-lg custom-shimmer mb-2"
                  style={{ borderRadius: "8px" }}
                ></div>
              </>
            ) : (
              <>
                {husmodellData?.PlantegningerFasader &&
                  husmodellData?.PlantegningerFasader?.map(
                    (item: string, index: number) => {
                      return (
                        <img
                          src={item}
                          alt="map"
                          className="w-full cursor-pointer"
                          key={index}
                          onClick={() => {
                            setSelectedImage(item);
                            setIsOpen(true);
                          }}
                        />
                      );
                    }
                  )}
              </>
            )}
          </div>
        </div>
        <div className="w-full lg:w-[57%]">
          {loading ? (
            <div
              className="w-[100px] h-[20px] rounded-lg custom-shimmer mb-4"
              style={{ borderRadius: "8px" }}
            ></div>
          ) : (
            <h2 className="text-black mb-4 md:mb-6 font-semibold text-lg md:text-xl desktop:text-2xl">
              {husmodellData?.Hustittel}
            </h2>
          )}
          <div className="mb-5 md:mb-[60px]">
            {loading ? (
              <div
                className="w-full h-[40px] rounded-lg custom-shimmer"
                style={{ borderRadius: "8px" }}
              ></div>
            ) : (
              <p className="text-sm md:text-base text-secondary h-full focus-within:outline-none resize-none">
                {husmodellData?.OmHusmodellen}
              </p>
            )}
          </div>
          <div className="mb-5 md:mb-[60px]">
            <Illustrasjoner />
          </div>

          {loading ? (
            <div
              className="w-full h-[40px] rounded-lg custom-shimmer mb-4 md:mb-6"
              style={{ borderRadius: "8px" }}
            ></div>
          ) : (
            <h2 className="text-black mb-4 md:mb-6 font-semibold text-lg md:text-xl desktop:text-2xl">
              {/* Film av {husmodellData?.husmodell_name} */}
              {husmodellData?.TittelVideo}
            </h2>
          )}
          <div
            style={{
              width: "100%",
              height: "400px",
            }}
          >
            {loading ? (
              <div className="w-full h-full rounded-lg custom-shimmer"></div>
            ) : (
              <iframe
                width="100%"
                height="100%"
                src={getEmbedUrl(husmodellData?.VideoLink)}
                title={husmodellData?.TittelVideo}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            )}
          </div>
        </div>
      </div>
      {isOpen && (
        <Modal isOpen={true} onClose={() => setIsPopupOpen(false)}>
          <div
            className="bg-white p-2 md:p-6 rounded-lg max-w-[85vw] md:max-w-4xl mx-4 w-full relative"
            ref={popup}
          >
            <button
              className="absolute top-2 md:top-3 right-0 md:right-3"
              onClick={() => setIsOpen(false)}
            >
              <Image src={Ic_close_darkgreen} alt="close" />
            </button>

            {selectedImage && (
              <div className="flex justify-center items-center sm:w-full my-4 relative">
                <button
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded-full"
                  onClick={() => {
                    const previousIndex =
                      (husmodellData?.PlantegningerFasader.indexOf(
                        selectedImage
                      ) -
                        1 +
                        husmodellData?.PlantegningerFasader.length) %
                      husmodellData?.PlantegningerFasader.length;
                    setSelectedImage(
                      husmodellData?.PlantegningerFasader[previousIndex]
                    );
                  }}
                >
                  &lt;
                </button>

                <div className="my-2">
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="h-auto w-full object-fill max-h-[80vh]"
                  />
                </div>

                <button
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded-full"
                  onClick={() => {
                    const nextIndex =
                      (husmodellData?.PlantegningerFasader.indexOf(
                        selectedImage
                      ) +
                        1) %
                      husmodellData?.PlantegningerFasader.length;
                    setSelectedImage(
                      husmodellData?.PlantegningerFasader[nextIndex]
                    );
                  }}
                >
                  &gt;
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default HouseDetailPage;
