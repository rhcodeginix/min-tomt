import React, { useState, ReactNode } from "react";
import Ic_chevron_up from "@/public/images/Ic_chevron_up.svg";
import Image from "next/image";

interface AccordionItemProps {
  title: string;
  children: ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className="p-6 rounded-lg"
      style={{
        boxShadow: "0px 2px 4px -2px #1018280F, 0px 4px 8px -2px #1018281A",
      }}
    >
      <div
        className="flex items-center justify-between gap-2 cursor-pointer"
        onClick={toggleAccordion}
      >
        <h3 className="text-black text-2xl font-semibold">{title}</h3>
        {isOpen ? (
          <Image src={Ic_chevron_up} alt="arrow" fetchPriority="auto" />
        ) : (
          <Image
            src={Ic_chevron_up}
            alt="arrow"
            className="rotate-180"
            fetchPriority="auto"
          />
        )}
      </div>
      {isOpen && <div className="mt-6">{children}</div>}
    </div>
  );
};

export default AccordionItem;
