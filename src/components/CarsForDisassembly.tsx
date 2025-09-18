import React from "react";
import H2 from "./headers/H2";
import Text from "./headers/Text";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Promo } from "@/interfaces/Promo";
import { A11y, Keyboard, Navigation, Pagination } from "swiper/modules";
import { useDispatch } from "react-redux";
import { startLoading } from "@/redux/loadingSlice";
import Link from "next/link";

interface NewsBlockProps {
  isOnlyBottomPadding?: boolean;
  promos: Promo[];
}

const FALLBACK = "/resources/default.gif";

const CarsForDisassembly: React.FC<NewsBlockProps> = ({
  isOnlyBottomPadding = true,
  promos,
}) => {
  const dispatch = useDispatch();
  const limitedItems = promos.slice(0, 3);

  return (
    <div className="pt-[48px]">
      <div className="flex flex-row items-center justify-between mb-7">
        <H2 className="sm:!text-[32px] text-[24px] !font-bold">
          Машины в разборе
        </H2>
        <Link
          className="flex flex-row items-center gap-4 hover:text-blue_main transition cursor-pointer"
          href="/cars"
          onClick={() => dispatch(startLoading())}
        >
          <Text variant="Small">Все машины</Text>
          <Image
            src={"/resources/arrow-left.svg"}
            width={24}
            height={24}
            alt="Arrow"
            className="rotate-180"
          />
        </Link>
      </div>
      <div className="hidden md:flex flex-row gap-5">
        {limitedItems.map((item, idx) => (
          <div
            key={idx}
            className={`flex flex-col gap-2 min-w-0 ${
              idx === 0
                ? "shrink flex-1 basis-[clamp(320px,45vw,580px)]"
                : "shrink basis-[280px]"
            }`}
          >
            <div className="relative bg-black_8 rounded-[10px] h-[240px] overflow-hidden">
              <Swiper
                modules={[Navigation, Pagination, Keyboard, A11y]}
                className="w-full h-full"
                pagination={{ clickable: true }}
                keyboard={{ enabled: true }}
                loop={item.images.length > 1}
              >
                {item.images.map((image, i) => (
                  <SwiperSlide key={`${image.id}-${i}`}>
                    <div className="relative w-full h-[240px]">
                      <Image
                        src={
                          `${process.env.NEXT_PUBLIC_SERVER_URL}${image.url}` ||
                          FALLBACK
                        }
                        alt={`${item.title} #${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK;
                        }}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <Text variant="Bold" className="!text-[20px]">
              {item.title}
            </Text>
            <Text variant="Body">{item.description}</Text>
          </div>
        ))}
      </div>
      <div className="md:hidden -ml-4 pl-4">
        <Swiper
          spaceBetween={16}
          slidesPerView={1.15}
          style={{ paddingRight: 16 }}
        >
          {limitedItems.map((item, idx) => (
            <SwiperSlide key={idx}>
              <div className="flex flex-col gap-2 max-w-[calc(100vw-32px)]">
                <div className="relative bg-black_8 rounded-[10px] h-[240px] overflow-hidden">
                  <div className="relative w-full h-[240px]">
                    <Image
                      src={
                        `${process.env.NEXT_PUBLIC_SERVER_URL}${item.images[0].url}` ||
                        FALLBACK
                      }
                      alt={`${item.title} #1`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK;
                      }}
                    />
                  </div>
                </div>
                <Text variant="Bold" className="!text-[18px]">
                  {item.title}
                </Text>
                <Text variant="Body" className="text-[14px]">
                  {item.description}
                </Text>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default CarsForDisassembly;
