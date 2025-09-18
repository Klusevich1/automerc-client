import Breadcrumbs from "@/components/Breadcrumbs";
import H1 from "@/components/headers/H1";
import H3 from "@/components/headers/H3";
import Text from "@/components/headers/Text";
import SEO, { ListItem } from "@/components/SEO";
import BasicLayout from "@/layouts/BasicLayout";
import Image from "next/image";
import React from "react";

const PAGE_NAME = "about";
const BREADCRUMB_PAGE_NAME = "О нас";

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

const NUMBER_LIST = [
  {
    label: "С 2009",
    value: "года работаем на рынке автозапчастей",
  },
  {
    label: "20 000",
    value: "запчастей всегда в наличии на складе",
  },
  {
    label: "14 дней",
    value: "гарантии на проверку и установку каждой детали",
  },
  {
    label: "100%",
    value: "оригинальные запчасти — никаких дешёвых аналогов",
  },
];

const PROJECT_STEPS = [
  "Прямые поставки с аукционов США, Европы и ОАЭ — широкий выбор и доступные цены.",
  "Только оригинальные детали — никаких подделок и дешёвых заменителей.",
  "Проверка каждой детали перед отправкой.",
  "Удобная доставка по всей Беларуси и России.",
  "Любые способы оплаты — наличные, безналичный расчёт, онлайн-оплата, рассрочка.",
  "Работаем и с физическими, и с юридическими лицами.",
];

const about = () => {
  return (
    <>
      <SEO
        title="О компании Automerc.by | Интернет-магазин б/у автозапчастей"
        description="Automerc.by - надёжный интернет-магазин б/у автозапчастей в Беларуси. Мы предлагаем оригинальные детали и качественные аналоги для легковых автомобилей, гарантию и удобную доставку по Минску и всей стране."
        breadcrumbsSchema={breadcrumbsSchema}
      />
      <BasicLayout>
        <Breadcrumbs breadcrumbs={BREADCRUMBS} />
        <AboutBlock />
      </BasicLayout>
    </>
  );
};

const AboutBlock = () => {
  return (
    <>
      <H1 className="mb-7 !font-bold text-[24px] xl:text-[32px] font-manrope -tracking-[0.02em]">
        О нас
      </H1>
      <div className="flex flex-col gap-12">
        <div className="flex lg:flex-row flex-col gap-5">
          <div className="lg:max-w-[50%]">
            <H3 className="!text-[20px] !font-bold mb-2">
              Компания AutoMerc более 16 лет уверенно работает на рынке продажи
              оригинальных б/у автозапчастей. Мы специализируемся на деталях для
              Mercedes, Toyota, Lexus, Chevrolet и GMC и предлагаем клиентам
              только качественные комплектующие, проверенные временем и опытом.
              Наш основной склад в Минске насчитывает более 20 000 запчастей, а
              также у нас есть пункт выдачи в Москве, что делает покупки
              удобными и быстрыми для клиентов из Беларуси и России.
            </H3>
            <Text variant="Body" className="!text-[16px] !font-medium">
              Мы поставляем запчасти напрямую с аукционов США, Европы и
              Объединённых Арабских Эмиратов. Это позволяет предлагать клиентам
              широкий ассортимент оригинальных деталей — от мелких элементов
              салона до двигателей и коробок передач. Каждая партия проходит
              проверку, чтобы вы могли быть уверены в её качестве и
              долговечности.
            </Text>
          </div>
          <div className="lg:max-w-[50%] grid grid-cols-2 gap-x-5 gap-y-4">
            {NUMBER_LIST.map((num, idx) => (
              <div key={idx}>
                <NumberBlockCard label={num.label} value={num.value} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex lg:flex-row flex-col gap-5">
          <div className="lg:max-w-[50%] w-full lg:h-[300px] rounded-[8px]">
            <Image
              src={"/resources/about1.png"}
              alt="About1"
              width={580}
              height={300}
              className="w-full"
            />
          </div>
          <div className="lg:max-w-[50%]">
            <Text variant="Bold" className="mb-2">
              Почему выбирают AutoMerc?
            </Text>
            <ul className="steps-list space-y-2">
              {PROJECT_STEPS.map((step, index) => (
                <li key={index} className="flex items-start gap-1 text-black">
                  <Text variant="Body">–</Text>
                  <Text variant="Body">{step}</Text>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex lg:flex-row flex-col-reverse gap-5">
          <div className="lg:max-w-[50%]">
            <Text variant="Bold" className="mb-2">
              Откуда AutoMerc берёт запчасти и как гарантируется их качество?
            </Text>
            <ul className="steps-list space-y-2">
              <Text variant="Body">
                Мы закупаем автомобили на аукционах в США, Европе и Объединённых
                Арабских Эмиратах. На каждом аукционе у нас работают собственные
                сотрудники, которые тщательно осматривают машины перед покупкой.
                Это позволяет отбирать только те автомобили, которые находятся в
                хорошем состоянии и подходят для дальнейшей разборки. Благодаря
                этому на наш склад поступают оригинальные и качественные
                запчасти, прошедшие двойную проверку: сначала на аукционе, а
                затем уже у нас в Минске.
              </Text>
            </ul>
          </div>
          <div className="lg:max-w-[50%] w-full lg:h-[300px] rounded-[8px]">
            <Image
              src={"/resources/about2.png"}
              alt="About1"
              width={580}
              height={300}
              className="w-full"
            />
          </div>{" "}
        </div>
      </div>
    </>
  );
};

const NumberBlockCard: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => {
  return (
    <div>
      <h3 className="md:text-[48px] text-[32px] font-semibold">{label}</h3>
      <p className="md:text-[14px] text-[12px] font-medium">{value}</p>
    </div>
  );
};

export default about;
