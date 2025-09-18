import BasicLayout from "@/layouts/BasicLayout";
import Breadcrumbs from "@/components/Breadcrumbs";
import H1 from "@/components/headers/H1";
import Text from "@/components/headers/Text";
import Image from "next/image";
import SEO, { ListItem } from "@/components/SEO";

const PAGE_NAME = "contacts";
const BREADCRUMB_PAGE_NAME = "Контакты";

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

const Contacts = () => {
  return (
    <>
      <SEO
        title="Контакты и реквизиты Automerc.by | Интернет-магазин б/у автозапчастей"
        description="Свяжитесь с нами для консультации и подбора автозапчастей. Телефон, e-mail, форма обратной связи и адрес магазина доступны на странице «Контакты». Automerc.by - мы всегда на связи."
        breadcrumbsSchema={breadcrumbsSchema}
      />
      <BasicLayout>
        <Breadcrumbs breadcrumbs={BREADCRUMBS} />
        <H1 className="!text-2xl !font-bold lg:text-inherit">Контакты</H1>
        <div className="flex lg:flex-row flex-col justify-between mt-7">
          <div>
            <Text variant="Body" className="!font-bold mb-1">
              Минск
            </Text>
            <Text variant="Body" className="!font-bold mb-2">
              Привольный Луговослободской сельсовет, 16/5
            </Text>
            <Text variant="Body" className="!font-bold mb-3">
              ежедневно, 10:00 - 20:00
            </Text>
            <a href="tel:+375296442190">
              <Text variant="Body" className="mb-6 text-xl">
                +375 (29) 644-21-90
              </Text>
            </a>
            <Text variant="Body" className="!font-bold mb-1">
              Москва
            </Text>
            <Text variant="Body" className="!font-bold mb-2">
              Лианозовский проезд 8 строение 3
            </Text>
            <Text variant="Body" className="!font-bold mb-3">
              ежедневно, 10:00 - 20:00
            </Text>
            <a href="tel:+79206172888">
              <Text variant="Body" className="text-xl">
                +7 (920) 617-28-88
              </Text>
            </a>
            <div className="mt-5 lg:mt-6">
              <Text variant="Body" className="!font-bold">
                Почта
              </Text>
              <div className="flex mt-3">
                <a
                  href="https://t.me/Automerc"
                  target="_blank"
                  className="flex"
                >
                  <Image
                    src="/resources/Telegram.png"
                    width={24}
                    height={24}
                    alt="Telegram"
                  />
                  <span className="ml-2">Telegram</span>
                </a>
                <a href="viber://add?number=375296442190" className="flex ml-3">
                  <Image
                    src="/resources/Viber.png"
                    width={24}
                    height={24}
                    alt="Viber"
                  />
                  <span className="ml-2">Viber</span>
                </a>
              </div>
            </div>
          </div>
          <div className="w-full lg:max-w-[780px] mt-7 lg:mt-0 pl-0 lg:pl-5">
            <iframe
              className="rounded-lg w-full"
              width="780"
              height="340"
              src="https://yandex.ru/map-widget/v1/?um=constructor%3A5c245985ab59e50c20f7f472cf6dbd3992f3525f7da6a4c2cacedf48a66eec00&amp;source=constructor"
            ></iframe>
          </div>
        </div>
      </BasicLayout>
    </>
  );
};

export default Contacts;
