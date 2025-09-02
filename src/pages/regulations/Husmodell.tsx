import React from "react";
import HusmodellPropertyPage from "@/components/Ui/regulation";

const Husmodell: React.FC<any> = ({
  handleNext,
  lamdaDataFromApi,
  CadastreDataFromApi,
  askData,
  handlePrevious,
  results,
  BoxData,
  resultsLoading,
}) => {
  return (
    <div className="relative">
      <HusmodellPropertyPage
        CadastreDataFromApi={CadastreDataFromApi}
        lamdaDataFromApi={lamdaDataFromApi}
        askData={askData}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
        results={results}
        BoxData={BoxData}
        resultsLoading={resultsLoading}
      />
    </div>
  );
};

export default Husmodell;
