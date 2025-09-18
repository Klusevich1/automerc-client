import Breadcrumbs from "@/components/Breadcrumbs";
import H1 from "@/components/headers/H1";
import H2 from "@/components/headers/H2";
import H3 from "@/components/headers/H3";
import Text from "@/components/headers/Text";
import SEO, { ListItem } from "@/components/SEO";
import BasicLayout from "@/layouts/BasicLayout";
import Image from "next/image";
import React from "react";

const PAGE_NAME = "delivery-and-payment";
const BREADCRUMB_PAGE_NAME = "Доставка и оплата";

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

const deliveryAndPaymentPage = () => {
  return (
    <>
      <SEO
        title="Доставка и оплата б/у автозапчастей | Automerc.by"
        description="Быстрая доставка б/у автозапчастей по Минску и всей Беларуси. Удобные способы оплаты - наличные, банковские карты, безналичный расчёт. Automerc.by - б/у автозапчасти с гарантией и удобным сервисом."
        breadcrumbsSchema={breadcrumbsSchema}
      />
      <BasicLayout>
        <Breadcrumbs breadcrumbs={BREADCRUMBS} />
        <InfoBlock />
      </BasicLayout>
    </>
  );
};

const InfoBlock = () => {
  return (
    <>
      <H1 className="mb-7 !font-bold text-[24px] xl:text-[32px] font-manrope -tracking-[0.02em]">
        Доставка и оплата
      </H1>
      <div>
        <H2 className="mb-4 lg:!text-[20px] !text-[16px] !font-bold">Способы доставки</H2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <H3 className="mb-4">Самовывоз</H3>
            <div className="flex flex-col gap-3">
              <div className="flex flex-row gap-2">
                <Image
                  src={"/resources/location.svg"}
                  width={20}
                  height={20}
                  alt="Location"
                />
                <Text
                  variant="Body"
                  children="Минск, Привольный Луговослободской сельсовет, 16/5"
                />
              </div>
              <div className="flex flex-row gap-2">
                <Image
                  src={"/resources/location.svg"}
                  width={20}
                  height={20}
                  alt="Location"
                />
                <Text
                  variant="Body"
                  children="Москва, Лианозовский проезд 8 строение 3"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <H3 className="mb-4 lg:!text-[20px] !text-[16px] !font-bold">Доставка по Минску и по всей Беларуси</H3>
            <Text
              variant="Body"
              children="Отправляем заказы по всей стране. Срок доставки обычно составляет 1–2 дня."
            />
          </div>
          <div className="flex flex-col">
            <H3 className="mb-4 lg:!text-[20px] !text-[16px] !font-bold">Доставка в Москву</H3>
            <Text
              variant="Body"
              children="Действует пункт выдачи, куда мы отправляем заказы по предоплате. Это быстрый и выгодный способ получить нужные детали"
            />
          </div>
          <div className="flex flex-col">
            <H3 className="mb-4 lg:!text-[20px] !text-[16px] !font-bold">Доставка по России</H3>
            <Text
              variant="Body"
              children="Доставка в любой регион через проверенные транспортные компании: СДЭК, ПЭК, Деловые Линии и другие. Сроки зависят от удалённости региона (в среднем от 2 до 7 дней)."
            />
          </div>
        </div>
        <Text variant="Bold" className="mt-3">
          Мы всегда подбираем оптимальный способ доставки, чтобы сэкономить ваше
          время и деньги.
        </Text>
      </div>
      <div className="mt-6">
        <H2 className="mb-4 lg:!text-[20px] !text-[16px] !font-bold">Способы оплаты</H2>
        <Text className="mb-4">
          Мы работаем как с физическими лицами, так и с юридическими лицами. Для
          вашего удобства доступны все основные способы оплаты:
        </Text>
        <div className="flex flex-col gap-3">
          <H3 className="md:!text-[20px] !text-[16px] !font-bold">
            1. Наличный расчёт – при самовывозе
          </H3>
          <H3 className="md:!text-[20px] !text-[16px] !font-bold">
            2. Безналичный расчёт – для компаний (с предоставлением всех
            закрывающих документов);
          </H3>
          <H3 className="md:!text-[20px] !text-[16px] !font-bold">
            3. Онлайн-оплата – через банковские карты, электронные кошельки и
            платёжные системы;
          </H3>
          <H3 className="md:!text-[20px] !text-[16px] !font-bold">
            4. Рассрочка – возможность оформить покупку в несколько платежей;
          </H3>
        </div>
        <Text variant="Bold" className="mt-2">
          Предоплата – обязательна при доставке в Москву на пункт выдачи и при
          отправке в регионы РФ.
        </Text>
      </div>
    </>
  );
};

export default deliveryAndPaymentPage;
