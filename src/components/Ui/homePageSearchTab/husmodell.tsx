import React, { useState } from "react";
import Image from "next/image";
import Ic_search from "@/public/images/Ic_search.svg";

const HusmodellTab = () => {
  const categories = [
    "Funkis",
    "Moderne",
    "Herskapelig",
    "Tradisjonelt",
    "Boliger med utleiedel",
  ];

  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Selected category:", selectedCategory);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
      <div className="flex justify-start">
        <div className="flex items-center bg-white rounded-[40px] p-1 md:p-2 gap-[1px] overflow-x-auto overFlowScrollHidden">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`focus-visible:outline-none px-2 md:px-3 text-black whitespace-nowrap py-2 md:py-2.5 rounded-full text-xs md:text-sm transition-all ${
                selectedCategory === category ? "font-bold" : ""
              }`}
              style={{
                boxShadow:
                  selectedCategory === category
                    ? "0px 2px 4px 0px #00000040"
                    : "",
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={!selectedCategory}
        className={`w-full flex items-center justify-center gap-2 h-[40px] md:h-[48px] px-6 py-2 md:py-4 rounded-full text-white font-semibold text-sm md:text-base transition-all ${
          selectedCategory
            ? "bg-brown"
            : "bg-brown opacity-50 cursor-not-allowed"
        }`}
      >
        <Image src={Ic_search} alt="search" className="w-5 h-5" />
        Søk
      </button>
    </form>
  );
};

export default HusmodellTab;
