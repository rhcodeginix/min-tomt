import React from "react";
import Image from "next/image";
import Ic_chevron_up from "@/public/images/Ic_chevron_up.svg";
import Ic_chevron_down from "@/public/images/Ic_chevron_down.svg";

interface AccordionProps {
  title: string;
  content: string;
  isActive: boolean;
  onToggle: () => void;
}

const Accordion: React.FC<AccordionProps> = ({
  title,
  content,
  isActive,
  onToggle,
}) => {
  return (
    <div style={{ borderBottom: "1px solid #B9C0D4" }}>
      <button
        className={`bg-white flex justify-between items-center w-full pb-6 duration-1000 ${isActive ? "active" : ""}`}
        onClick={onToggle}
      >
        <span className="text-black text-lg font-semibold">{title}</span>
        {isActive ? (
          <Image src={Ic_chevron_up} alt="arrow" fetchPriority="auto" />
        ) : (
          <Image src={Ic_chevron_down} alt="arrow" fetchPriority="auto" />
        )}
      </button>
      <div
        className={`overflow-hidden max-h-0 ${isActive ? "pb-6" : ""}`}
        style={{
          maxHeight: isActive ? "max-content" : "0",
          transition: "max-height 0.2s ease-out",
        }}
      >
        <p>{content}</p>
      </div>
    </div>
  );
};

export default Accordion;
