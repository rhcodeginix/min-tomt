import { useState } from "react";
import SideSpaceContainer from "@/components/common/sideSpace";
import Img_loan_app from "@/public/images/Img_loan_app.png";
import Ic_vipps_gray from "@/public/images/Ic_vipps_gray.svg";
import Image from "next/image";
import {
  Banknote,
  File,
  FileText,
  House,
  Minus,
  MoveRight,
  NotebookText,
  Plus,
} from "lucide-react";

interface AccordionItem {
  id: string;
  title: string;
  description: string;
  icon: any;
}

const accordionData: AccordionItem[] = [
  {
    id: "contact",
    title: "Dine kontaktopplysninger",
    description:
      "Ved logge inn med Vipps får vi dine kontaktopplysninger (navn, e-post, mobilnummer, fødselsnummer)",
    icon: (
      <File className="text-purple h-6 w-6 md:h-8 md:w-8" strokeWidth={1.25} />
    ),
  },
  {
    id: "property",
    title: "Tomt- og husdetaljer",
    description:
      "Informasjon om eiendommen du ønsker å kjøpe eller refinansiere",
    icon: (
      <House className="text-purple h-6 w-6 md:h-8 md:w-8" strokeWidth={1.25} />
    ),
  },
  {
    id: "financing",
    title: "Antatt finansieringsbehov",
    description: "Hvor mye du trenger å låne og dine økonomiske forhold",
    icon: (
      <Banknote
        className="text-purple h-6 w-6 md:h-8 md:w-8"
        strokeWidth={1.25}
      />
    ),
  },
  {
    id: "preliminary",
    title: "Forhåndstakst",
    description: "Takst av eiendommen for å vurdere lånets sikkerhet",
    icon: (
      <NotebookText
        className="text-purple h-6 w-6 md:h-8 md:w-8"
        strokeWidth={1.25}
      />
    ),
  },
  {
    id: "summary",
    title: "Oppsummering og innsending",
    description: "Gjennomgang av søknaden før innsending",
    icon: (
      <FileText
        className="text-purple h-6 w-6 md:h-8 md:w-8"
        strokeWidth={1.25}
      />
    ),
  },
];

const LoanApplication: React.FC = () => {
  const [openItem, setOpenItem] = useState<string>(accordionData[0]?.id || "");

  const toggleItem = (id: string) => {
    setOpenItem((prev) => (prev === id ? "" : id));
  };

  return (
    <>
      <div className="py-[44px] md:py-[58px] desktop:py-[120px] relative lg:h-[100vh] desktop:h-[110vh]">
        <SideSpaceContainer>
          <h2 className="text-black text-[20px] md:text-[24px] lg:text-[32px] desktop:text-[40px] font-bold mb-5 lg:mb-[20px] text-center md:mb-[32px] desktop:mb-[48px]">
            Innhold i lånesøknaden
          </h2>
          <div>
            <div className="w-full lg:w-[60%] desktop:w-1/2">
              <div className="flex flex-col gap-4 md:gap-6 lg:gap-8">
                {accordionData.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-4 md:gap-6 lg:gap-8"
                  >
                    <div className="overflow-hidden transition-all duration-300">
                      <button
                        onClick={() => toggleItem(item.id)}
                        className="w-full flex items-center justify-between text-left focus:outline-none focus-within:outline-none focus:ring-0 focus:ring-blue-500 focus:ring-inset"
                      >
                        <div className="flex items-center gap-3 md:gap-4">
                          <span className="text-2xl">{item.icon}</span>
                          <span
                            className={`${
                              openItem === item.id ? "font-semibold" : ""
                            } text-black text-base md:text-lg lg:text-xl`}
                          >
                            {item.title}
                          </span>
                        </div>

                        {openItem === item.id ? (
                          <Minus className="w-5 h-5 text-black" />
                        ) : (
                          <Plus className="w-5 h-5 text-black" />
                        )}
                      </button>

                      <div
                        className={`overflow-hidden transition-all ml-9 md:ml-12 duration-300 ${
                          openItem === item.id
                            ? "max-h-auto opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="py-2 md:py-3">
                          <p className="text-secondary text-xs md:text-sm lg:text-base leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                        <div>
                          <div className="text-purple font-semibold flex items-center gap-2 text-sm lg:text-base">
                            <span>Start lånesøknad med Vipps</span>
                            <Image src={Ic_vipps_gray} alt="vipps" />
                            <MoveRight />
                          </div>
                        </div>
                      </div>
                    </div>
                    {index < accordionData.length - 1 && (
                      <div className="border-t border-gray2"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <Image
              src={Img_loan_app}
              alt="image"
              className="absolute lg:right-[-140px] top-0 desktop:right-0 h-full hidden lg:block"
            />
          </div>
        </SideSpaceContainer>
      </div>
    </>
  );
};

export default LoanApplication;
