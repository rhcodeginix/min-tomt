import SideSpaceContainer from "@/components/common/sideSpace";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import Button from "@/components/common/button";
import HusmodellFilterSection from "./husmodellFilterSection";
import HusmodellProperty from "./HusmodellProperty";
import { Settings2, X } from "lucide-react";
import { Drawer } from "@mui/material";

const HusmodellPropertyPage: React.FC = () => {
  const [HouseModelProperty, setHouseModelProperty] = useState([]);
  const [maxRangeData, setMaxRangeData] = useState<number>(0);
  const [minRangeData, setMinRangeData] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    Eiendomstype: [] as string[],
    TypeHusmodell: [] as string[],
    AntallSoverom: [] as string[],
    minRangeForHusmodell: minRangeData,
    maxRangeForHusmodell: maxRangeData,
  });
  const [total, setTotal] = useState();

  useEffect(() => {
    const storedMaxPrice = sessionStorage.getItem("maxHousePrice");
    const storedMinPrice = sessionStorage.getItem("minHousePrice");
    if (storedMaxPrice) {
      setMaxRangeData(parseInt(storedMaxPrice, 10));
      setFormData((prev) => ({
        ...prev,
        maxRangeForHusmodell: parseInt(storedMaxPrice, 10),
      }));
    }
    if (storedMinPrice) {
      setMinRangeData(parseInt(storedMinPrice, 10));
      setFormData((prev) => ({
        ...prev,
        minRangeForHusmodell: parseInt(storedMinPrice, 10),
      }));
    }
  }, [maxRangeData, minRangeData]);

  const [kommune, setKommune] = useState<any>(null);
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const cityQuery = queryParams.get("Kommue");
    const TypeHusmodell = queryParams.get("TypeHusmodell");
    if (cityQuery) {
      setKommune(cityQuery);
    }
    if (TypeHusmodell) {
      setFormData((prev) => ({
        ...prev,
        TypeHusmodell: [TypeHusmodell],
      }));
    }
  }, []);

  useEffect(() => {
    const fetchMaxPrice = async () => {
      try {
        const querySnapshot = await getDocs(
          query(
            collection(db, "house_model"),
            where("Husdetaljer.TilgjengeligBolig", "==", "Ja")
          )
        );
        const data: any = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort((a: any, b: any) => {
            const priceA = parseInt(
              a?.Husdetaljer?.pris?.replace(/\s/g, "") || "0"
            );
            const priceB = parseInt(
              b?.Husdetaljer?.pris?.replace(/\s/g, "") || "0"
            );
            return priceA - priceB;
          })
          .filter((item: any) => item?.is_live === true);

        const maxHousePrice = Math.max(
          ...data?.map((house: any) =>
            parseInt(house?.Husdetaljer?.pris.replace(/\s/g, ""), 10)
          )
        );
        const minHousePrice = Math.min(
          ...data?.map((house: any) =>
            parseInt(house?.Husdetaljer?.pris.replace(/\s/g, ""), 10)
          )
        );

        sessionStorage.setItem("maxHousePrice", maxHousePrice.toString());
        sessionStorage.setItem("minHousePrice", minHousePrice.toString());
        setMaxRangeData(maxHousePrice);
        setMinRangeData(minHousePrice);
      } catch (error) {
        console.error("Error fetching max price:", error);
      }
    };

    fetchMaxPrice();
  }, []);

  useEffect(() => {
    const fetchProperty = async () => {
      setIsLoading(true);

      try {
        const q = query(
          collection(db, "house_model"),
          where("Husdetaljer.TilgjengeligBolig", "==", "Ja")
        );

        const querySnapshot = await getDocs(q);

        const data: any = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort((a: any, b: any) => {
            const priceA = parseInt(
              a?.Husdetaljer?.pris?.replace(/\s/g, "") || "0"
            );
            const priceB = parseInt(
              b?.Husdetaljer?.pris?.replace(/\s/g, "") || "0"
            );
            return priceA - priceB;
          });
        setTotal(data.length);
        const soveromValues = formData?.AntallSoverom.flatMap((item: any) => {
          const value = parseInt(item.replace(" Soverom", ""), 10);

          return Array.from({ length: 10 - value + 1 }, (_, i) => value + i);
        });
        const filterData =
          data.filter((house: any) => {
            const houseDetails = house?.Husdetaljer || {};
            const housePrice = parseInt(
              houseDetails?.pris?.replace(/\s/g, "") || "0"
            );

            const boligtype = houseDetails?.VelgBoligtype;
            const TypeObjekt = houseDetails?.TypeObjekt;
            const egenskaper = houseDetails?.VelgEgenskaperBoligtype || [];

            const hasBedroomFilter = formData.AntallSoverom.length > 0;
            const hasMinPriceFilter = formData.minRangeForHusmodell !== 0;
            const hasMaxPriceFilter = formData.maxRangeForHusmodell !== 0;
            const hasTypeFilter = formData.TypeHusmodell.length > 0;
            const hasTypeEiendomstype = formData.Eiendomstype.length > 0;

            const matchesBedrooms =
              !hasBedroomFilter || soveromValues.includes(houseDetails.Soverom);
            const matchesMinPrice =
              !hasMinPriceFilter || housePrice >= formData.minRangeForHusmodell;
            const matchesMaxPrice =
              !hasMaxPriceFilter || housePrice <= formData.maxRangeForHusmodell;

            const matchesBoligtype =
              !hasTypeFilter ||
              formData.TypeHusmodell.some(
                (type: string) =>
                  type.trim().toLowerCase() ===
                  (boligtype || "").trim().toLowerCase()
              );

            const matchesEgenskaper =
              !hasTypeFilter ||
              egenskaper.some((item: string) =>
                formData.TypeHusmodell.some(
                  (type: string) =>
                    type.trim().toLowerCase() === item.trim().toLowerCase()
                )
              );

            const matchesEiendomstype =
              !hasTypeEiendomstype ||
              formData.Eiendomstype.some(
                (type: string) =>
                  type.trim().toLowerCase() ===
                  (TypeObjekt || "").trim().toLowerCase()
              );

            return (
              matchesBedrooms &&
              matchesMinPrice &&
              matchesMaxPrice &&
              (matchesBoligtype || matchesEgenskaper) &&
              matchesEiendomstype
            );
          }) || data;

        setHouseModelProperty(filterData);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setHouseModelProperty([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [db, formData, total]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const toggleDrawer = (open: boolean) => () => {
    setOpenDrawer(open);
  };

  useEffect(() => {
    const chatBot = document.getElementById("chatbase-bubble-button");
    const addPlot = document.getElementById("addPlot");
    const navbar = document.getElementById("navbar");

    if (openDrawer) {
      if (chatBot) chatBot.style.display = "none";
      if (addPlot) addPlot.style.display = "none";
      if (navbar) navbar.style.zIndex = "999";
    } else {
      if (chatBot) chatBot.style.display = "block";
      if (addPlot) addPlot.style.display = "block";
      if (navbar) navbar.style.zIndex = "9999";
    }
  }, [openDrawer]);

  return (
    <>
      <div className="relative pt-5 lg:pt-8">
        <SideSpaceContainer>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-2 md:gap-3 lg:gap-4 mb-6 lg:mb-[40px]">
            <h3 className="text-darkBlack text-lg md:text-xl lg:text-2xl desktop:leading-[44.8px]">
              <span className="font-bold">Husmodeller</span> du kan bygge i{" "}
              <span className="font-bold text-primary">{kommune} Kommune</span>
            </h3>
            {!isLoading && (
              <p className="text-darkBlack text-sm md:text-base desktop:text-xl font-light">
                <span className="font-bold">{HouseModelProperty.length}</span>{" "}
                treff i <span className="font-bold">{total}</span> annonser
              </p>
            )}
          </div>
          <div className="flex flex-col lg:flex-row gap-5 laptop:gap-6 relative pb-[56px]">
            <div className="lg:w-[35%]">
              <div
                className="sticky top-[56px] w-max left-0 right-0 z-50 bg-white border rounded-lg border-[#DADDE8] p-2 gap-2 flex items-center justify-between lg:hidden"
                onClick={toggleDrawer(true)}
              >
                <Settings2 className="text-primary h-5 w-5" />
                <h4 className="text-sm">Filter</h4>
              </div>

              <div className="hidden lg:block w-full">
                <HusmodellFilterSection
                  formData={formData}
                  setFormData={setFormData}
                  maxRangeData={maxRangeData}
                  minRangeData={minRangeData}
                />
              </div>
            </div>
            <div className="w-full lg:w-[65%]">
              <HusmodellProperty
                HouseModelProperty={HouseModelProperty}
                isLoading={isLoading}
              />
            </div>
          </div>
        </SideSpaceContainer>
        <div
          className="sticky bottom-0 bg-white py-4"
          style={{
            boxShadow:
              "0px -4px 6px -2px #10182808, 0px -12px 16px -4px #10182814",
          }}
        >
          <SideSpaceContainer>
            <div className="flex justify-end items-center gap-6">
              <Button
                text="Tilbake"
                className="border-2 border-primary bg-white text-primary sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold desktop:px-[20px] relative desktop:py-[16px]"
                path="/"
              />
            </div>
          </SideSpaceContainer>
        </div>
      </div>

      <Drawer
        anchor="bottom"
        open={openDrawer}
        onClose={toggleDrawer(false)}
        PaperProps={{
          style: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: "90vh",
          },
          className: "filterDrawer",
        }}
      >
        <div className="overflow-y-auto max-h-[90vh] pt-4 bg-lightGreen2">
          <HusmodellFilterSection
            formData={formData}
            setFormData={setFormData}
            maxRangeData={maxRangeData}
            minRangeData={minRangeData}
          />
          <div className="absolute top-3 right-2" onClick={toggleDrawer(false)}>
            <X className="h-4 w-4" />
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default HusmodellPropertyPage;
