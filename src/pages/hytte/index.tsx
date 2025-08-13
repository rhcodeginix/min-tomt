"use client";
import React from "react";
import MainSection from "./mainSection";
import HowItWorks from "./howItWorks";
import Footer from "@/components/Ui/footer";
import FåInnsiktI from "./fåInnsiktI";
import Property from "./property";
import AboutUs from "./aboutUs";
import Expected from "./expected";

const index = () => {
  return (
    <>
      <div className="relative">
        <MainSection />
        <FåInnsiktI />
        <Property />
        <HowItWorks />
        <AboutUs />
        <Expected />
        <Footer />
      </div>
    </>
  );
};

export default index;
