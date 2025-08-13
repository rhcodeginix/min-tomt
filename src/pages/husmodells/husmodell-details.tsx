import React from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import Button from "@/components/common/button";
import Ic_breadcrumb_arrow from "@/public/images/Ic_breadcrumb_arrow.svg";
import Link from "next/link";
import Image from "next/image";
import HouseDetailsection from "@/components/Ui/houseDetail/houseDetailSection";
// import Loader from "@/components/Loader";
import HouseDetailPage from "@/components/Ui/houseDetail";
import PropertyHouseDetails from "@/components/Ui/husmodellPlot/PropertyHouseDetails";
import { useRouter } from "next/router";

const HusmodellDetail: React.FC<{
  handleNext: any;
  HouseModelData: any;
  loading: any;
  pris: any;
  lamdaDataFromApi: any;
  supplierData: any;
}> = ({
  handleNext,
  HouseModelData,
  loading,
  pris,
  lamdaDataFromApi,
  supplierData,
}) => {
  const router = useRouter();

  return (
    <>
      <div className="relative">
        <div className="bg-lightGreen2 py-2 md:py-4">
          <SideSpaceContainer>
            <div className="flex items-center flex-wrap gap-1 mb-4 md:mb-6">
              <Link
                href={"/"}
                className="text-green text-xs md:text-sm font-medium"
              >
                Hjem
              </Link>
              <Image src={Ic_breadcrumb_arrow} alt="arrow" />
              <span className="text-secondary2 text-xs md:text-sm">
                Husmodell
              </span>
            </div>
            <PropertyHouseDetails
              HouseModelData={HouseModelData}
              lamdaDataFromApi={lamdaDataFromApi}
              // CadastreDataFromApi={CadastreDataFromApi}
              supplierData={supplierData}
              pris={pris}
              loading={loading}
            />
          </SideSpaceContainer>
        </div>
        <HouseDetailsection HouseModelData={HouseModelData} loading={loading} />
        <SideSpaceContainer className="relative pt-[38px]">
          <HouseDetailPage />
        </SideSpaceContainer>
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
                  const router_query: any = { ...router.query };

                  delete router_query.husmodellId;
                  delete router_query.leadId;

                  router.push(
                    {
                      pathname: router.pathname,
                      query: router_query,
                    },
                    undefined,
                    { shallow: true }
                  );
                }}
              />
              <Button
                text={`Tilpass ${HouseModelData?.Husdetaljer?.husmodell_name} her`}
                className="border border-primary bg-primary text-white sm:text-base rounded-[40px] w-max h-[36px] md:h-[40px] lg:h-[48px] font-semibold relative desktop:px-[28px] desktop:py-[16px]"
                onClick={() => {
                  handleNext();
                }}
              />
            </div>
          </SideSpaceContainer>
        </div>
      </div>
    </>
  );
};

export default HusmodellDetail;
