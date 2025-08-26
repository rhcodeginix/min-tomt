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
  where,
} from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { useRouter } from "next/router";
import { formatPrice } from "@/pages/belop/belopProperty";

const Property: React.FC = () => {
  const router = useRouter();

  const [data, setData] = useState<any>({
    houseModels: [],
    supplierData: {},
    isLoading: false,
  });

  useEffect(() => {
    const fetchProperty = async () => {
      setData((prev: any) => ({ ...prev, isLoading: true }));

      try {
        const houseModelSnapshot = await getDocs(
          query(
            collection(db, "house_model"),
            where("Husdetaljer.TilgjengeligBolig", "==", "Ja"),
            where("Husdetaljer.TypeObjekt", "==", "bolig"),
            limit(3)
          )
        );
        const houseModels = houseModelSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort((a: any, b: any) => {
            const priceA = parseInt(
              a?.Husdetaljer?.pris?.replace(/\s/g, "") || "0",
              10
            );
            const priceB = parseInt(
              b?.Husdetaljer?.pris?.replace(/\s/g, "") || "0",
              10
            );
            return priceA - priceB;
          });
        // .filter((item: any) => {
        //   if (!item.hasOwnProperty("is_live")) return true;
        //   return item.is_live === true;
        // });

        setData({
          // houseModels: houseModels.slice(0, 3),
          houseModels: houseModels,
          supplierData: {},
        });
      } catch (error) {
        console.error("Error fetching properties:", error);
        setData((prev: any) => ({ ...prev, isLoading: false }));
      }
    };

    fetchProperty();
  }, []);

  useEffect(() => {
    const fetchSupplierDetails = async () => {
      const supplierMap = { ...data.supplierData };

      await Promise.all(
        data.houseModels.map(async (property: any) => {
          const supplierId = property?.Husdetaljer?.Leverandører;
          if (supplierId && !supplierMap[supplierId]) {
            try {
              const supplierDocRef = doc(db, "suppliers", supplierId);
              const docSnap = await getDoc(supplierDocRef);
              supplierMap[supplierId] = docSnap.exists()
                ? docSnap.data()
                : null;
            } catch (error) {
              console.error("Error fetching supplier data:", error);
            }
          }
        })
      );

      setData((prev: any) => ({
        ...prev,
        supplierData: supplierMap,
        isLoading: false,
      }));
    };

    if (data.houseModels.length) {
      fetchSupplierDetails();
    }
  }, [data.houseModels]);

  return (
    <>
      <div className="py-[44px] md:py-[58px] desktop:py-[120px]">
        <SideSpaceContainer>
          <h2 className="text-black text-[20px] md:text-[24px] lg:text-[32px] desktop:text-[40px] font-bold mb-5 lg:mb-[20px] text-center md:mb-[32px] desktop:mb-[40px]">
            Populære husmodeller
          </h2>
          {data.isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {Array.from({ length: 3 }).map((_: any, index: number) => {
                return (
                  <div
                    key={index}
                    className="border border-gray3 rounded-[8px] p-3 cursor-pointer hover:shadow-[0px_4px_24px_0px_#0000001A]"
                  >
                    <div className="w-full h-[230px] mb-3 desktop:mb-4 rounded-lg custom-shimmer"></div>
                    <div className="w-[200px] h-[20px] rounded-lg custom-shimmer mb-3 md:mb-5"></div>
                    <div className="w-full h-[30px] rounded-lg custom-shimmer mb-3"></div>
                    <div className="flex gap-3 items-center">
                      <div className="w-[70px] h-[20px] rounded-lg custom-shimmer"></div>
                      <div className="border-l border-[#EAECF0] h-[12px]"></div>
                      <div className="w-[70px] h-[20px] rounded-lg custom-shimmer"></div>
                      <div className="border-l border-[#EAECF0] h-[12px]"></div>
                      <div className="w-[70px] h-[20px] rounded-lg custom-shimmer"></div>
                    </div>
                    <div className="gap-4 md:gap-5 lg:gap-6 flex items-center justify-between mt-3 md:mt-5">
                      <div>
                        <div className="w-[100px] h-[20px] rounded-lg custom-shimmer mb-1"></div>
                        <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                      </div>
                      <div className="w-[100px] h-[40px] rounded-lg custom-shimmer"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {data.houseModels.map((property: any, index: number) => {
                const supplierId = property?.Husdetaljer?.Leverandører;
                const finalData = data.supplierData[supplierId] || null;
                return (
                  <div
                    key={index}
                    className="border border-gray3 rounded-[8px] p-3 cursor-pointer hover:shadow-[0px_4px_24px_0px_#0000001A]"
                    onClick={() => {
                      router.push(
                        `husmodells?husmodellId=${property?.id}&city=Akershus`
                      );
                      const currIndex = 0;
                      localStorage.setItem("currIndex", currIndex.toString());
                    }}
                  >
                    <div className="relative mb-3 desktop:mb-4">
                      <img
                        src={property?.Husdetaljer?.photo}
                        alt="image"
                        className="w-full h-[230px] rounded-[8px] object-cover"
                      />
                      <img
                        src={finalData?.photo}
                        alt="product-logo"
                        className="absolute top-[12px] left-[12px] bg-[#FFFFFFB2] py-2 px-3 flex items-center justify-center rounded-[32px] w-[107px]"
                      />
                    </div>
                    <h4 className="text-black text-sm md:text-base lg:text-lg lg:leading-[30px] mb-3 md:mb-5">
                      <span className="font-bold">
                        {property?.Husdetaljer?.husmodell_name}
                      </span>{" "}
                      fra{" "}
                      <span className="font-bold">
                        {finalData?.company_name}
                      </span>
                    </h4>
                    <h5 className="text-secondary font-medium text-xs md:text-sm mb-3 two_line_elipse">
                      {property?.Husdetaljer?.OmHusmodellen}
                    </h5>
                    <div className="flex gap-3 items-center">
                      <div className="text-darkBlack text-xs md:text-sm font-semibold">
                        {property?.Husdetaljer?.BRATotal}{" "}
                        <span className="text-secondary font-normal">m²</span>
                      </div>
                      <div className="border-l border-[#EAECF0] h-[12px]"></div>
                      <div className="text-darkBlack text-xs md:text-sm font-semibold">
                        {property?.Husdetaljer?.BebygdAreal}{" "}
                        <span className="text-secondary font-normal">BYA</span>
                      </div>
                      <div className="border-l border-[#EAECF0] h-[12px]"></div>
                      <div className="text-darkBlack text-xs md:text-sm font-semibold">
                        {property?.Husdetaljer?.Bad}{" "}
                        <span className="text-secondary font-normal">bad</span>
                      </div>
                    </div>
                    <div className="gap-4 md:gap-5 lg:gap-6 flex items-center justify-between mt-3 md:mt-5">
                      <div>
                        <p className="text-secondary text-xs md:text-sm mb-1">
                          Pris fra
                        </p>
                        <h6 className="text-sm md:text-base font-semibold text-black">
                          {property?.Husdetaljer?.pris
                            ? formatPrice(property?.Husdetaljer?.pris)
                            : 0}
                        </h6>
                      </div>
                      <Button
                        text="Se detaljer"
                        className="border-2 border-brown bg-white text-brown sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
                        onClick={() => {
                          router.push(
                            `husmodells?husmodellId=${property?.id}&city=Akershus`
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
