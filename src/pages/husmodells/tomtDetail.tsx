import React, { useEffect, useState } from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import Image from "next/image";
import Ic_breadcrumb_arrow from "@/public/images/Ic_breadcrumb_arrow.svg";
import Ic_logo from "@/public/images/Ic_logo.svg";
import Button from "@/components/common/button";
import { useRouter } from "next/router";
import Link from "next/link";
import PropertyHouseDetails from "@/components/Ui/husmodellPlot/PropertyHouseDetails";
import PropertyDetails from "@/components/Ui/husmodellPlot/properyDetails";
import { Building2, House } from "lucide-react";
import HouseDetailPage from "@/components/Ui/houseDetail";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import PlotDetailPage from "@/components/Ui/plotDetail";

const TomtHouseDetails: React.FC<{
  handleNext: any;
  handlePrevious: any;
  loadingAdditionalData: any;
  loginUser: any;
  loadingLamdaData: any;
  supplierData: any;
  CadastreDataFromApi: any;
  HouseModelData: any;
  askData: any;
  lamdaDataFromApi: any;
  user: any;
}> = ({
  handleNext,
  HouseModelData,
  loadingAdditionalData,
  loginUser,
  loadingLamdaData,
  supplierData,
  CadastreDataFromApi,
  lamdaDataFromApi,
  askData,
  user,
  handlePrevious,
}) => {
  const router = useRouter();
  const { homePage } = router.query;
  const { pathname, query: routequery } = router;
  const updatedQuery = { ...routequery };
  const [stored, setStored] = useState<any>();

  useEffect(() => {
    const store = localStorage.getItem("customizeHouse");
    setStored(store);
  }, []);
  const tabs: any = [
    {
      id: "Eiendomsinformasjon",
      label: "Eiendomsinformasjon",
      icon: <Building2 className="w-4 h-4 lg:w-6 lg:h-6" />,
    },
    {
      id: `house`,
      label: `${HouseModelData?.Husdetaljer?.husmodell_name} fra ${supplierData?.company_name}`,
      icon: <House className="w-4 h-4 lg:w-6 lg:h-6" />,
    },
  ];

  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);

  const id = router.query["husmodellId"];
  const plotId = router.query["plotId"];

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !plotId || !id || !stored) return;

      const queryParams = new URLSearchParams(window.location.search);
      const isEmptyPlot = queryParams.get("empty") === "true";
      const currentLeadId = queryParams.get("leadId");
      queryParams.delete("leadId");
      queryParams.delete("crmLead");

      try {
        const [plotDocSnap, husmodellDocSnap] = await Promise.all([
          getDoc(doc(db, "empty_plot", String(plotId))),
          getDoc(doc(db, "house_model", String(id))),
        ]);

        const finalData = {
          plot: { id: plotId, ...plotDocSnap.data() },
          husmodell: { id: String(id), ...husmodellDocSnap.data() },
        };

        const [leadsSupplierQuery, leadsQuerySnapshot]: any = await Promise.all(
          [
            getDocs(
              query(
                collection(db, "leads_from_supplier"),
                where("plotId", "==", String(plotId)),
                where("husmodellId", "==", id),
                where("created_by", "==", user.id)
              )
            ),
            getDocs(
              query(
                collection(db, "leads"),
                where("finalData.plot.id", "==", String(plotId)),
                where("finalData.husmodell.id", "==", id),
                where("user.id", "==", user.id)
              )
            ),
          ]
        );

        if (!leadsSupplierQuery.empty) {
          queryParams.set("crmLead", leadsSupplierQuery.docs[0].id);
        }

        if (!leadsQuerySnapshot.empty) {
          const existingLeadId = leadsQuerySnapshot.docs[0].id;
          if (currentLeadId !== existingLeadId) {
            queryParams.set("leadId", existingLeadId);
          }
        } else if (currentLeadId) {
          const oldLeadRef = doc(db, "leads", currentLeadId);
          const leadSnapshot = await getDoc(oldLeadRef);

          if (leadSnapshot.exists()) {
            const existingLead = leadSnapshot.data();
            if (existingLead.finalData.plot === null) {
              await updateDoc(oldLeadRef, {
                finalData,
                user,
                updatedAt: new Date(),
                IsEmptyPlot: isEmptyPlot,
              });
            }
            queryParams.set("leadId", currentLeadId);
          }
        } else {
          const newDocRef = await addDoc(collection(db, "leads"), {
            finalData,
            user,
            Isopt: false,
            IsoptForBank: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            IsEmptyPlot: isEmptyPlot,
            stored,
          });
          queryParams.set("leadId", newDocRef.id);
        }

        router.replace({
          pathname: router.pathname,
          query: Object.fromEntries(queryParams),
        });
      } catch (error) {
        console.error("Firestore operation failed:", error);
      }
    };

    if (plotId && id && user && stored) {
      fetchData();
    }
  }, [plotId, id, user, stored]);

  return (
    <div className="relative">
      <div className="bg-lightGreen2 py-2 md:py-4">
        <SideSpaceContainer>
          <div className="flex items-center flex-wrap gap-1 mb-4 md:mb-6">
            <Link
              href={"/"}
              className="text-primary text-xs md:text-sm font-medium"
            >
              Hjem
            </Link>
            <Image src={Ic_breadcrumb_arrow} alt="arrow" />
            <div
              className="text-primary text-xs md:text-sm font-medium cursor-pointer"
              onClick={() => {
                const currIndex = 0;
                localStorage.setItem("currIndex", currIndex.toString());
              }}
            >
              Tomt
            </div>
            <Image src={Ic_breadcrumb_arrow} alt="arrow" />
            {!homePage && (
              <>
                <div
                  className="text-primary text-xs md:text-sm font-medium cursor-pointer"
                  onClick={() => {
                    if (updatedQuery.kommunenummer)
                      delete updatedQuery.kommunenummer;
                    if (updatedQuery.bruksnummer)
                      delete updatedQuery.bruksnummer;
                    if (updatedQuery.gardsnummer)
                      delete updatedQuery.gardsnummer;
                    if (updatedQuery.kommunenavn)
                      delete updatedQuery.kommunenavn;
                    if (updatedQuery.empty) delete updatedQuery.empty;
                    delete updatedQuery.plotId;
                    router
                      .replace({ pathname, query: updatedQuery }, undefined, {
                        shallow: true,
                      })
                      .then(() => {
                        handlePrevious();
                      });
                  }}
                >
                  Hva kan du bygge?
                </div>
                <Image src={Ic_breadcrumb_arrow} alt="arrow" />
              </>
            )}
            <span className="text-secondary2 text-xs md:text-sm">Detaljer</span>
          </div>
          <PropertyHouseDetails
            HouseModelData={HouseModelData}
            lamdaDataFromApi={lamdaDataFromApi}
            CadastreDataFromApi={CadastreDataFromApi}
            supplierData={supplierData}
            loading={loadingLamdaData}
          />
        </SideSpaceContainer>
      </div>
      <PropertyDetails
        askData={askData}
        CadastreDataFromApi={CadastreDataFromApi}
        lamdaDataFromApi={lamdaDataFromApi}
        HouseModelData={HouseModelData}
        loading={loadingLamdaData}
      />
      <div id="regulationDocument">
        <div
          className="border-b border-gray3 py-6 pb-8"
          id="logoDiv"
          style={{ display: "none" }}
        >
          <SideSpaceContainer>
            <Image
              fetchPriority="auto"
              src={Ic_logo}
              alt="logo"
              className="w-[100px] lg:w-auto"
            />
          </SideSpaceContainer>
        </div>

        <SideSpaceContainer className="relative pt-[38px] pb-[46px]">
          <div>
            <div className="w-full sm:w-max">
              <div className="flex flex-nowrap border border-gray3 rounded-lg bg-gray3 p-[6px] mb-6 md:mb-[38px] overflow-x-auto overFlowScrollHidden">
                {tabs.map((tab: any) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`min-w-max whitespace-nowrap px-2 lg:px-4 py-2 text-sm lg:text-base transition-colors duration-300 flex items-center gap-2 ${
                      activeTab === tab.id
                        ? "bg-white font-medium text-primary"
                        : "text-black"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            <div
              className={`${activeTab === "Eiendomsinformasjon" ? "block" : "hidden"}`}
            >
              <PlotDetailPage
                lamdaDataFromApi={lamdaDataFromApi}
                loadingAdditionalData={loadingAdditionalData}
                askData={askData}
                loadingLamdaData={loadingLamdaData}
                CadastreDataFromApi={CadastreDataFromApi}
              />
            </div>
            <div className={`${activeTab === "house" ? "block" : "hidden"}`}>
              <HouseDetailPage />
            </div>
          </div>
          {!loginUser && (
            <div
              className="absolute top-0 h-full w-full left-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255, 255, 255, 0.7) 100%, rgba(255, 255, 255, 0.7) 100%)",
              }}
            ></div>
          )}
        </SideSpaceContainer>
      </div>
      <div
        className="sticky bottom-0 bg-white py-4"
        style={{
          boxShadow:
            "0px -4px 6px -2px #10182808, 0px -12px 16px -4px #10182814",
          zIndex: 9999,
        }}
      >
        <SideSpaceContainer>
          <div className="flex justify-end gap-4 items-center">
            <Button
              text="Tilbake"
              className="border-2 border-primary text-primary sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-medium desktop:px-[46px] relative desktop:py-[16px]"
              onClick={() => {
                if (updatedQuery.kommunenummer)
                  delete updatedQuery.kommunenummer;
                if (updatedQuery.bruksnummer) delete updatedQuery.bruksnummer;
                if (updatedQuery.gardsnummer) delete updatedQuery.gardsnummer;
                if (updatedQuery.kommunenavn) delete updatedQuery.kommunenavn;
                if (updatedQuery.empty) delete updatedQuery.empty;
                delete updatedQuery.plotId;
                router.replace({ pathname, query: updatedQuery }, undefined, {
                  shallow: true,
                });
              }}
            />
            <Button
              text={
                HouseModelData?.Husdetaljer?.Leverandører ===
                "9f523136-72ca-4bde-88e5-de175bc2fc71"
                  ? "Neste: Finansiering"
                  : "Neste: Tilbud"
              }
              className="border border-primary bg-primary hover:bg-[#1E5F5C] hover:border-[#1E5F5C] focus:bg-[#003A37] focus:border-[#003A37] text-white sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
              onClick={() => {
                if (!loadingLamdaData && !loadingAdditionalData) {
                  handleNext();
                }
              }}
            />
          </div>
        </SideSpaceContainer>
      </div>
    </div>
  );
};

export default TomtHouseDetails;
