import React, { useEffect, useState } from "react";
import Img_slider_avatar from "@/public/images/Img_slider_avatar.png";
import SideSpaceContainer from "@/components/common/sideSpace";
import { Star } from "lucide-react";
import Image from "next/image";

interface Testimonial {
  stars: number;
  text: React.ReactNode;
  author: string;
  location: string;
  image: any;
}

const testimonials: Testimonial[] = [
  {
    stars: 5,
    text: (
      <div className="text-black text-xs md:text-sm lg:text-base">
        Etter å ha fått avslag i flere ulike banker begynte jeg å miste troen på
        at boligdrømmen kunne bli virkelighet. Men via{" "}
        <span className="font-bold">MinTomt</span> og{" "}
        <span className="font-bold">SpareBank 1 Hallingdal Valdres</span> fikk
        jeg raskt respons og en konkret finansieringsramme – tilpasset både
        tomten og huset jeg ønsket å bygge. Det tok bare ett døgn før jeg satt
        med en godkjent løsning.
      </div>
    ),
    author: "— Kristian Bergh",
    location: "Østlandet",
    image: Img_slider_avatar,
  },
  {
    stars: 5,
    text: (
      <div className="text-black text-xs md:text-sm lg:text-base">
        Etter å ha fått avslag i flere ulike banker begynte jeg å miste troen på
        at boligdrømmen kunne bli virkelighet. Men via{" "}
        <span className="font-bold">MinTomt</span> og{" "}
        <span className="font-bold">SpareBank 1 Hallingdal Valdres</span> fikk
        jeg raskt respons og en konkret finansieringsramme – tilpasset både
        tomten og huset jeg ønsket å bygge. Det tok bare ett døgn før jeg satt
        med en godkjent løsning.
      </div>
    ),
    author: "— Kristian Bergh",
    location: "Østlandet",
    image: Img_slider_avatar,
  },
  {
    stars: 5,
    text: (
      <div className="text-black text-xs md:text-sm lg:text-base">
        Etter å ha fått avslag i flere ulike banker begynte jeg å miste troen på
        at boligdrømmen kunne bli virkelighet. Men via{" "}
        <span className="font-bold">MinTomt</span> og{" "}
        <span className="font-bold">SpareBank 1 Hallingdal Valdres</span> fikk
        jeg raskt respons og en konkret finansieringsramme – tilpasset både
        tomten og huset jeg ønsket å bygge. Det tok bare ett døgn før jeg satt
        med en godkjent løsning.
      </div>
    ),
    author: "— Kristian Bergh",
    location: "Østlandet",
    image: Img_slider_avatar,
  },
  {
    stars: 5,
    text: (
      <div className="text-black text-xs md:text-sm lg:text-base">
        Etter å ha fått avslag i flere ulike banker begynte jeg å miste troen på
        at boligdrømmen kunne bli virkelighet. Men via{" "}
        <span className="font-bold">MinTomt</span> og{" "}
        <span className="font-bold">SpareBank 1 Hallingdal Valdres</span> fikk
        jeg raskt respons og en konkret finansieringsramme – tilpasset både
        tomten og huset jeg ønsket å bygge. Det tok bare ett døgn før jeg satt
        med en godkjent løsning.
      </div>
    ),
    author: "— Kristian Bergh",
    location: "Østlandet",
    image: Img_slider_avatar,
  },
  // {
  //   stars: 5,
  //   text: (
  //     <div className="text-black text-xs md:text-sm lg:text-base">
  //       Etter å ha fått avslag i flere ulike banker begynte jeg å miste troen på
  //       at boligdrømmen kunne bli virkelighet. Men via{" "}
  //       <span className="font-bold">MinTomt</span> og{" "}
  //       <span className="font-bold">SpareBank 1 Hallingdal Valdres</span> fikk
  //       jeg raskt respons og en konkret finansieringsramme – tilpasset både
  //       tomten og huset jeg ønsket å bygge. Det tok bare ett døgn før jeg satt
  //       med en godkjent løsning.
  //     </div>
  //   ),
  //   author: "— Kristian Bergh",
  //   location: "Østlandet",
  //   image: Img_slider_avatar,
  // },
];

const AboutUs: React.FC = () => {
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
    className: "center",
    centerMode: true,
    centerPadding: "60px",
    slidesToShow: 3,
    slidesToScroll: 1,
    speed: 500,
    arrows: true,
    dots: true,
    focusOnSelect: true,
    pauseOnHover: true,
    // infinite:false,
    cssEase: "cubic-bezier(0.600, -0.280, 0.735, 0.045)",
    responsive: [
      {
        breakpoint: 1380,
        settings: {
          slidesToShow: 2,
          centerPadding: "40px",
          centerMode: true,
          arrows: true,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          centerPadding: "20px",
          centerMode: true,
          // arrows: false,
        },
      },
    ],
  };

  if (!isClient || !Slider) {
    return (
      <SideSpaceContainer>
        <h2 className="text-black text-[20px] md:text-[24px] lg:text-[32px] desktop:text-[40px] font-bold mb-5 lg:mb-[20px] text-center md:mb-[32px] desktop:mb-[40px]">
          Dette sier kundene om oss
        </h2>
        <div className="text-center">Loading testimonials...</div>
      </SideSpaceContainer>
    );
  }

  return (
    <>
      <style jsx global>{`
        @import url("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.css");
        @import url("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.min.css");
      `}</style>

      <SideSpaceContainer>
        <h2 className="text-black text-[20px] md:text-[24px] lg:text-[32px] desktop:text-[40px] font-bold mb-5 lg:mb-[20px] text-center md:mb-[32px] desktop:mb-[40px]">
          Dette sier kundene om oss
        </h2>
        <div className="slider-container relative mb-16">
          <Slider {...settings}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="h-full">
                <div className="testimonial-card bg-white rounded-lg p-4 md:p-5 lg:p-8 h-full flex flex-col justify-between">
                  <div className="mb-5 md:mb-8">
                    <div className="flex mb-4 md:mb-6 gap-1">
                      {Array.from({ length: testimonial.stars }).map((_, i) => (
                        <Star
                          key={i}
                          className="text-yellow fill-yellow w-5 h-5"
                        />
                      ))}
                    </div>
                    <div>{testimonial.text}</div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-medium text-black text-base md:text-lg lg:text-xl">
                        {testimonial.author}
                      </p>
                      <p className="text-sm md:text-base lg:text-lg text-secondary">
                        {testimonial.location}
                      </p>
                    </div>
                    <Image
                      src={testimonial.image}
                      alt={testimonial.author}
                      className="w-12 md:w-[60px] h-12 md:h-[60px] rounded-full"
                      fetchPriority="auto"
                    />
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </SideSpaceContainer>
    </>
  );
};

export default AboutUs;
