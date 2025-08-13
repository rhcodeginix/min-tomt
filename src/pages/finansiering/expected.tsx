import SideSpaceContainer from "@/components/common/sideSpace";
import Img_slider1 from "@/public/images/Img_slider1.png";
import Img_slider2 from "@/public/images/Img_slider2.png";
import Img_slider3 from "@/public/images/Img_slider3.png";
import { Banknote, ChartPie, Clock4 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const testimonials: any = [
  {
    image: Img_slider1,
  },
  {
    image: Img_slider2,
  },
  {
    image: Img_slider3,
  },
  {
    image: Img_slider1,
  },
  {
    image: Img_slider2,
  },
  {
    image: Img_slider3,
  },
];

const Expected: React.FC = () => {
  const [Slider, setSlider] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const loadSlider = async () => {
      try {
        const SliderModule = await import("react-slick");
        setSlider(() => SliderModule.default);
      } catch (error) {
        console.error("Failed to load react-slick:", error);
      }
    };

    loadSlider();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    speed: 8000,
    autoplaySpeed: 0,
    cssEase: "linear",
    arrows: false,
    responsive: [
      {
        breakpoint: 1380,
        settings: {
          slidesToShow: 2,
          speed: 9000,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          speed: 10000,
        },
      },
    ],
  };

  if (!isClient || !Slider) {
    return (
      <div className="py-[44px] md:py-[58px] desktop:py-[120px]">
        <SideSpaceContainer>
          <h2 className="text-black text-[20px] md:text-[24px] lg:text-[32px] desktop:text-[40px] font-bold mb-5 lg:mb-[20px] text-center md:mb-[32px] desktop:mb-[40px]">
            Dette kan du forvente av MinTomt
          </h2>
          <div className="text-center">Loading testimonials...</div>
        </SideSpaceContainer>
      </div>
    );
  }
  return (
    <>
      <style jsx global>{`
        @import url("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.css");
        @import url("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.min.css");
      `}</style>

      <div className="py-[44px] md:py-[58px] desktop:py-[120px]">
        <SideSpaceContainer>
          <h2 className="text-black text-[20px] md:text-[24px] lg:text-[32px] desktop:text-[40px] font-bold mb-5 lg:mb-[20px] text-center md:mb-[32px] desktop:mb-[40px]">
            Dette kan du forvente av MinTomt
          </h2>
        </SideSpaceContainer>
        <div className="slider-container relative">
          <Slider {...settings}>
            {testimonials.map((testimonial: any, index: number) => (
              <div key={index} className="h-full">
                <Image
                  src={testimonial.image}
                  alt="image"
                  className="w-full h-full rounded-lg"
                  fetchPriority="auto"
                />
              </div>
            ))}
          </Slider>
        </div>
        <div className="px-4 pt-8 md:p-10 md:pb-0 pb-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8 big:gap-12">
          <div className="flex gap-4 lg:gap-6 items-start">
            <div className="bg-lightPurple h-[48px] md:h-[56px] lg:h-[72px] w-[48px] md:w-[56px] lg:w-[72px] rounded-full flex items-center justify-center">
              <ChartPie className="text-purple" />
            </div>
            <div className="flex-1">
              <h4 className="text-black font-semibold font-base md:font-lg lg:font-xl mb-2">
                Gode og troverdige data
              </h4>
              <p className="text-secondary text-xs md:text-sm lg:text-base">
                Vi gjennomfører en analyse som gir deg en lynrask og presis
                tomtevurdering – og sparer deg for tid.
              </p>
            </div>
          </div>
          <div className="flex gap-4 lg:gap-6 items-start">
            <div className="bg-lightPurple h-[48px] md:h-[56px] lg:h-[72px] w-[48px] md:w-[56px] lg:w-[72px] rounded-full flex items-center justify-center">
              <Clock4 className="text-purple" />
            </div>
            <div className="flex-1">
              <h4 className="text-black font-semibold font-base md:font-lg lg:font-xl mb-2">
                Spar tid og penger
              </h4>
              <p className="text-secondary text-xs md:text-sm lg:text-base">
                Vi hjelper deg å ta riktige valg tidlig i prosessen – og unngå
                kostbare feil og unødvendig tidsbruk.
              </p>
            </div>
          </div>
          <div className="flex gap-4 lg:gap-6 items-start">
            <div className="bg-lightPurple h-[48px] md:h-[56px] lg:h-[72px] w-[48px] md:w-[56px] lg:w-[72px] rounded-full flex items-center justify-center">
              <Banknote className="text-purple" />
            </div>
            <div className="flex-1">
              <h4 className="text-black font-semibold font-base md:font-lg lg:font-xl mb-2">
                Lån som passer din boligdrøm
              </h4>
              <p className="text-secondary text-xs md:text-sm lg:text-base">
                Få konkurransedyktige lånebetingelser tilpasset ditt prosjekt og
                din økonomi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Expected;
