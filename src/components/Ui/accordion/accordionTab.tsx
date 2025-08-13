import React, { useState } from "react";
import Accordion from "@/components/Ui/accordion";

const AccordionTab: React.FC<any> = ({ sections }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  return (
    <>
      {sections.map((section: any, index: any) => (
        <Accordion
          key={index}
          title={section.title}
          content={section.content}
          isActive={activeIndex === index}
          onToggle={() => toggleAccordion(index)}
        />
      ))}
    </>
  );
};

export default AccordionTab;
