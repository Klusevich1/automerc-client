import Image from "next/image";
import React, { useRef } from "react";
import H3 from "./headers/H3";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import Text from "./headers/Text";
import { useDispatch } from "react-redux";
import { startLoading } from "@/redux/loadingSlice";
import { useRouter } from "next/router";

interface ICategoryCard {
  text: string;
  imagePath: string;
  locate: "up" | "down";
  slug: string;
}

interface CategoryCardProps {
  card: ICategoryCard;
}

const FIRST_LINE: ICategoryCard[] = [
  {
    text: "Двигатель и его компоненты",
    imagePath: "/resources/categories/engine.png",
    locate: "up",
    slug: "dvigatel",
  },
  {
    text: "Подвеска и рулевое управление",
    imagePath: "/resources/categories/suspension.png",
    locate: "down",
    slug: "podveska",
  },
  {
    text: "Трансмиссия",
    imagePath: "/resources/categories/transmission.png",
    locate: "up",
    slug: "transmissija",
  },
];

const SECOND_LINE: ICategoryCard[] = [
  {
    text: "Тормозная система",
    imagePath: "/resources/categories/braking-system.png",
    locate: "up",
    slug: "tormoznaja-sistema",
  },
  {
    text: "Система охлаждения",
    imagePath: "/resources/categories/cooling-system.png",
    locate: "down",
    slug: "sistema-ohlazhdenija",
  },
  {
    text: "Кузовные детали",
    imagePath: "/resources/categories/body-parts.png",
    locate: "up",
    slug: "kuzovshhina",
  },
  {
    text: "Электрика и электроника",
    imagePath: "/resources/categories/electrics.png",
    locate: "up",
    slug: "elektrika",
  },
  {
    text: "Топливная система",
    imagePath: "/resources/categories/fuel-system.png",
    locate: "up",
    slug: "toplivnaja-sistema",
  },
  {
    text: "Система выхлопа",
    imagePath: "/resources/categories/exhaust-system.png",
    locate: "up",
    slug: "vyhlopnaja-sistema",
  },
  {
    text: "Салон и интерьер",
    imagePath: "/resources/categories/salon.png",
    locate: "up",
    slug: "salon",
  },
];

const PopularCategoriesBlock = () => {
  return (
    <>
      <div className="md:block hidden py-[48px]">
        <div className="grid grid-cols-3 gap-5">
          {FIRST_LINE.map((card, idx) => (
            <div key={idx}>
              <CategoryCard card={card} />
            </div>
          ))}
        </div>
        <SliderComponent />
      </div>
      <div className="md:hidden grid grid-cols-2 gap-4 py-[48px]">
        {[...FIRST_LINE, ...SECOND_LINE].map((card, idx) => (
          <div key={idx}>
            <MiniCategoryCard card={card} />
          </div>
        ))}
      </div>
    </>
  );
};

// Основной компонент слайдера
const SliderComponent = () => {
  const swiperProjRef = useRef<any>(null);
  return (
    <div className="relative w-full">
      {/* Навигационные стрелки */}
      <div className="flex justify-end gap-8 my-4">
        <button
          className="swiper-button-prev w-fit"
          style={{ position: "inherit" }}
        >
          <Image
            src={"/resources/arrow-left.svg"}
            width={24}
            height={24}
            alt="Arrow"
          />
        </button>
        <button className="swiper-button-next" style={{ position: "inherit" }}>
          <Image
            src={"/resources/arrow-left.svg"}
            width={24}
            height={24}
            alt="Arrow"
            className="rotate-180"
          />
        </button>
      </div>

      {/* Слайдер */}
      <Swiper
        modules={[Navigation]} // Подключение модуля Navigation
        spaceBetween={20}
        grabCursor={true}
        onSwiper={(swiper) => (swiperProjRef.current = swiper)}
        navigation={{
          prevEl: ".swiper-button-prev", // Связывание кнопки "назад"
          nextEl: ".swiper-button-next", // Связывание кнопки "вперед"
        }}
        className="swiper-container"
        breakpoints={{
          320: {
            slidesPerView: 1,
          },
          480: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 4,
          },
          1024: {
            slidesPerView: 5,
          },
          1280: {
            slidesPerView: 6,
          },
        }}
      >
        {SECOND_LINE.map((card, index) => (
          <SwiperSlide key={index}>
            <MiniCategoryCard card={card} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

const CategoryCard: React.FC<CategoryCardProps> = ({ card }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleCategory = () => {
    dispatch(startLoading());
    router.push(`/catalog/${card.slug}`);
  };

  return (
    <div
      className="relative bg-dark_blue text-white p-[15px] overflow-hidden rounded-lg h-[180px] cursor-pointer"
      onClick={handleCategory}
    >
      <div
        className="absolute right-[-50px] top-1/2 translate-y-[-50%] w-[300px] h-[300px] rounded-full z-1 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(71, 77, 255, 0.18) 0%, rgba(71, 77, 255, 0.18) 40%, transparent 100%)",
          filter: "blur(30px)",
        }}
      />
      <div
        className={`z-10 absolute lg:max-w-[223px] max-w-[180px] ${
          card.locate === "up" ? "top-[15px]" : "bottom-[15px]"
        }`}
      >
        <H3 className="!font-bold">{card.text}</H3>
      </div>
      <div className={`absolute right-[-10px] bottom-1/2 translate-y-1/2 z-9`}>
        <Image
          src={card.imagePath}
          alt={card.text}
          width={220}
          height={165}
          className="lg:max-w-[220px] max-w-[180px] h-auto"
        />
      </div>
    </div>
  );
};

const MiniCategoryCard: React.FC<CategoryCardProps> = ({ card }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleCategory = () => {
    dispatch(startLoading());
    router.push(`/catalog/${card.slug}`);
  };
  return (
    <div
      className="relative flex flex-col md:gap-1 sm:gap-3 bg-dark_blue text-white md:p-[15px] p-2 overflow-hidden rounded-lg sm:h-[180px] h-[160px] cursor-pointer"
      onClick={handleCategory}
    >
      <div
        className="absolute w-[164px] h-[106px] rounded-full z-1 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(71, 77, 255, 0.18) 0%, rgba(71, 77, 255, 0.18) 40%, transparent 100%)",
          filter: "blur(30px)",
        }}
      />
      <div className={`z-10 flex justify-center`}>
        <Image
          src={card.imagePath}
          alt={card.text}
          width={230}
          height={165}
          className="md:max-w-[147px] sm:max-w-[160px] max-w-[140px] h-auto"
        />
      </div>
      <div className={`z-10 text-center`}>
        <Text variant="Bold" className="sm:text-[16px] text-[15px]">
          {card.text}
        </Text>
      </div>
    </div>
  );
};

export default PopularCategoriesBlock;
