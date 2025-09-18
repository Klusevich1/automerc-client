import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, Navigation, Pagination } from "swiper/modules";
import { Swiper as SwiperClass } from "swiper/types";
import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Image from "next/image";

interface VerticalSliderProps {
  images: string;
}

const VerticalSlider: React.FC<VerticalSliderProps> = ({ images }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);

  const fixedImages: string[] = JSON.parse(images);

  return (
    <>
      <div className="lg:flex hidden items-center">
        {/* Левый вертикальный превью-слайдер */}
        <div className="w-[80px] h-[248px] relative">
          <Swiper
            direction="vertical"
            watchSlidesProgress={true}
            centeredSlides={false}
            freeMode={false}
            slidesPerView={4}
            spaceBetween={8}
            modules={[Thumbs, Navigation]}
            onSwiper={setThumbsSwiper}
            navigation={{
              nextEl: ".custom-next",
              prevEl: ".custom-prev",
            }}
            className="h-full"
          >
            {fixedImages.map((src, index) => (
              <SwiperSlide key={index} className="!h-[56px]">
                <Image
                  src={src}
                  alt={`thumb-${index}`}
                  width={60}
                  height={60}
                  className="object-cover rounded-[8px] h-full w-full cursor-pointer"
                />
                {/* <div className="w-[80px] h-[56px] rounded-[8px] bg-black_8 border border-transparent"></div> */}
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="custom-prev absolute -top-6 left-1/2 -translate-x-1/2 z-10 cursor-pointer">
            <Image
              src="/resources/arrow-down.svg"
              alt="prev"
              width={20}
              height={20}
              className="rotate-180"
            />
          </div>
          <div className="custom-next absolute -bottom-6 left-1/2 -translate-x-1/2 z-10 cursor-pointer">
            <Image
              src="/resources/arrow-down.svg"
              alt="next"
              width={20}
              height={20}
            />
          </div>
        </div>

        {/* Основной слайдер */}
        <div className="w-[480px] h-[300px] ml-5">
          <Swiper
            thumbs={{ swiper: thumbsSwiper }}
            modules={[Thumbs, Navigation]}
            navigation={{
              nextEl: ".custom-next",
              prevEl: ".custom-prev",
            }}
            className="h-full"
          >
            {fixedImages.map((src, index) => (
              <SwiperSlide key={index}>
                <Image
                  src={src}
                  alt={`slide-${index}`}
                  width={600}
                  height={400}
                  className="w-full h-full rounded-[8px] object-contain"
                />
                {/* <div className="w-[480px] h-[300px] bg-black_8 rounded-[8px]">
                  Слайд - {index}
                </div> */}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <div className="lg:hidden w-full ">
        <Swiper
          modules={[Thumbs, Navigation, Pagination]}
          pagination={{ clickable: true }}
          className="w-full md:h-[450px] xs:h-[350px] h-[300px]"
        >
          {fixedImages.map((src, index) => (
            <SwiperSlide key={index}>
              <Image
                src={src}
                alt={`thumb-${index}`}
                width={360}
                height={300}
                className="sm:object-contain object-cover rounded h-full w-full cursor-pointer"
              />
              {/* Здесь можно включить Image, если потребуется */}
              {/* <div className="w-full md:h-[400px] h-[300px] bg-black_8 rounded-[8px] flex items-center justify-center text-white text-xl">
                Слайд - {index + 1}
              </div> */}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default VerticalSlider;
