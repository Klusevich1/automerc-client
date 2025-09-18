import AdminPromoForm from "@/components/AdminPromoForm";
import Breadcrumbs from "@/components/Breadcrumbs";
import H1 from "@/components/headers/H1";
import H3 from "@/components/headers/H3";
import Text from "@/components/headers/Text";
import { Promo } from "@/interfaces/Promo";
import BasicLayout from "@/layouts/BasicLayout";
import { getAllPromos } from "@/lib/getAllPromos";
import { GetServerSidePropsContext } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Navigation, Pagination, Keyboard, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import jwt from "jsonwebtoken";
import { parse as parseCookie } from "cookie";
import SEO, { ListItem } from "@/components/SEO";

type CarCardProps = {
  title: string;
  text: string;
  images: { id: number; url: string }[];
};

const FALLBACK = "/resources/default.gif";

const PAGE_NAME = "cars";
const BREADCRUMB_PAGE_NAME = "Машины на разбор";

const BREADCRUMBS = [
  { name: "Главная", link: "/" },
  { name: BREADCRUMB_PAGE_NAME, link: `/${PAGE_NAME}` },
];

const breadcrumbsSchema: ListItem[] = BREADCRUMBS.map((item, index) => ({
  "@type": "ListItem",
  position: index + 1,
  name: item.name,
  item: `https://hazparts.com${item.link}`,
}));

const cars: React.FC<{ fetchPromos: Promo[]; userRole: "user" | "admin" }> = ({
  fetchPromos,
  userRole,
}) => {
  const router = useRouter();
  const isAdmin = userRole === "admin";

  return (
    <>
      <SEO
        title="Машины на разбор | Automerc.by - контрактные б/у автозапчасти"
        description="Каталог автомобилей на разбор: фото, описание и список доступных запчастей. Подбор деталей по марке и модели, возможность заказа с доставкой по Минску и Беларуси. Automerc.by - всё для ремонта авто."
        breadcrumbsSchema={breadcrumbsSchema}
      />
      <BasicLayout>
        <Breadcrumbs breadcrumbs={BREADCRUMBS} />
        {isAdmin && (
          <AdminPromoForm
            onCreated={() => location.reload()}
            onDeleted={() => location.reload()}
          />
        )}
        <CarsListBlock fetchPromos={fetchPromos} />
      </BasicLayout>
    </>
  );
};

const CarsListBlock: React.FC<{ fetchPromos: Promo[] }> = ({ fetchPromos }) => {
  return (
    <>
      <H1 className="mb-7 !font-bold text-[24px] xl:text-[32px] font-manrope -tracking-[0.02em]">
        Машины на разбор
      </H1>
      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-[20px] sm:gap-y-[32px] gap-y-[24px] w-full">
        {fetchPromos.map((card, idx) => (
          <div key={idx}>
            <CarCard
              title={card.title}
              text={card.description}
              images={card.images}
            />
          </div>
        ))}
      </div>
    </>
  );
};

const CarCard: React.FC<CarCardProps> = ({ title, text, images }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative bg-black_8 rounded-[10px] h-[240px] overflow-hidden">
        <Swiper
          modules={[Navigation, Pagination, Keyboard, A11y]}
          className="w-full h-full"
          pagination={{ clickable: true }}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          keyboard={{ enabled: true }}
          loop={images.length > 1}
        >
          {images.map((image, i) => (
            <SwiperSlide key={`${image.id}-${i}`}>
              <div className="relative w-full h-[240px]">
                <Image
                  src={
                    `${process.env.NEXT_PUBLIC_SERVER_URL}${image.url}` ||
                    FALLBACK
                  }
                  alt={`${title} #${i + 1}`}
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
          {/* Кастомные стрелки */}
          <button className="custom-prev absolute top-1/2 left-2 z-10 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-blue_main"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button className="custom-next absolute top-1/2 right-2 z-10 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-blue_main"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </Swiper>
      </div>

      <div className="flex flex-col gap-2">
        <H3 className="!text-[20px] !font-bold">{title}</H3>
        <Text className="!text-[16px] !font-medium" variant="Body">
          {text}
        </Text>
      </div>
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  let userRole: string | null = null;
  try {
    const cookiesHeader = context.req.headers.cookie ?? "";
    const cookies = parseCookie(cookiesHeader);
    const token = cookies["jwt"];

    if (token) {
      const decoded = jwt.verify(
        token,
        process.env.AUTH_JWT_SECRET as string
      ) as {
        id: number;
        role?: string;
        iat?: number;
        exp?: number;
      };
      userRole = decoded?.role ?? null;
    }
  } catch {
    userRole = null;
  }

  try {
    const fetchPromos = await getAllPromos();

    return { props: { fetchPromos, userRole } };
  } catch (error) {
    console.error("Error fetching categories or brands:", error);
    return { props: { fetchPromos: [], userRole } };
  }
}

export default cars;
