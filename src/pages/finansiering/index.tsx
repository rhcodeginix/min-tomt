"use client";
import React from "react";
import MainSection from "./mainSection";
import HowItWorks from "./howItWorks";
import Footer from "@/components/Ui/footer";
import Construction from "./construction";
import LoanApplication from "./loanApplication";
import AboutUs from "./aboutUs";
import Expected from "./expected";

const index = () => {
  return (
    <>
      <div className="relative">
        <MainSection />
        <Construction />
        <LoanApplication />
        <HowItWorks />
        <AboutUs />
        <Expected />
        <Footer />
      </div>
    </>
  );
};

export default index;
