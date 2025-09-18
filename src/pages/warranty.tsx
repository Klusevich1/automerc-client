import Breadcrumbs from "@/components/Breadcrumbs";
import H1 from "@/components/headers/H1";
import H2 from "@/components/headers/H2";
import H3 from "@/components/headers/H3";
import Text from "@/components/headers/Text";
import SEO, { ListItem } from "@/components/SEO";
import BasicLayout from "@/layouts/BasicLayout";
import Image from "next/image";
import React from "react";

const PAGE_NAME = "warranty";
const BREADCRUMB_PAGE_NAME = "Гарантия";

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

const warrantyPage = () => {
  return (
    <>
      <SEO
        title="Гарантия на б/у автозапчасти | Условия возврата Automerc.by"
        description="Мы предоставляем гарантию качества на все автозапчасти. Условия возврата и обмена соответствуют законодательству Республики Беларусь. Automerc.by - только проверенные б/у детали для вашего автомобиля."
        breadcrumbsSchema={breadcrumbsSchema}
      />
      <BasicLayout>
        <Breadcrumbs breadcrumbs={BREADCRUMBS} />
        <TextBlock />
      </BasicLayout>
    </>
  );
};

const TextBlock = () => {
  return (
    <>
      <H1 className="mb-7 !font-bold text-[24px] xl:text-[32px] font-manrope -tracking-[0.02em]">
        Гарантия
      </H1>
      <div className="xlg:max-w-[95%] space-y-3">
        <Text variant="Body">
          Компания <span className="font-bold">AutoMerc</span> более{" "}
          <span className="font-bold">
            16 лет работает на рынке автозапчастей
          </span>
          , и за это время мы заслужили доверие тысяч клиентов в Беларуси и
          России. Наш опыт, репутация и подход к делу подтверждают: у нас можно
          покупать запчасти спокойно и уверенно.
        </Text>
        <Text>
          Сегодня на нашем складе хранится более{" "}
          <span className="font-bold">
            20 000 оригинальных б/у автозапчастей
          </span>{" "}
          для Mercedes, Toyota, Lexus, Chevrolet и GMC. Каждая деталь проходит
          обязательную проверку перед отправкой клиенту.
        </Text>
        <Text>
          Мы предоставляем{" "}
          <span className="font-bold">
            гарантию 14 дней с момента получения заказа
          </span>
          . Этого времени достаточно, чтобы установить запчасть, проверить её
          работу и убедиться в полном соответствии.
        </Text>
        <Text>
          Если вдруг деталь не подошла или обнаружился скрытый дефект — мы
          произведём замену или вернём деньги.
        </Text>
        <div>
          <H2 className="mb-3">Почему нам доверяют?</H2>
          <ul className="space-y-2">
            <li>
              <Text>
                - Более 16 лет на рынке – стабильность и репутация проверенного
                поставщика;
              </Text>
            </li>
            <li>
              <Text>
                - 20 000 запчастей на складе – всегда большой выбор и наличие
                нужных деталей;
              </Text>
            </li>
            <li>
              <Text>
                - Гарантия 14 дней – честные условия без скрытых оговорок;
              </Text>
            </li>
            <li>
              <Text>- Тысячи довольных клиентов в РБ и РФ.</Text>
            </li>
          </ul>
        </div>
        <Text variant="Bold">
          AutoMerc — это надежность, проверенная временем. Мы отвечаем за каждую
          деталь, которую продаём.
        </Text>
      </div>
    </>
  );
};

export default warrantyPage;
