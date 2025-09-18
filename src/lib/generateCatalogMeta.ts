// /lib/seo/generateCatalogMeta.ts
export type VehicleAtom = { id: number; name: string; slug: string };
export type VehicleSelection = {
  brand?: VehicleAtom;
  model?: VehicleAtom;
  generation?: VehicleAtom;
};

export type CatalogMetaInput = {
  category?: string;
  subcategory?: string;
  vehicles?: VehicleSelection[];
  also?: string[];
};

export type CatalogMeta = { title: string; description: string };

export function generateCatalogMeta(input: CatalogMetaInput): CatalogMeta {
  const category = norm(input.category ?? "");
  const subcategory = norm(input.subcategory ?? "");
  const focusName = subcategory || category; // используем subcategory, если есть

  const vehicles = input.vehicles ?? [];
  const isMulti = vehicles.length > 1 || (input.also && input.also.length > 0);

  // Константы-хвосты
  const suffix = " | Детали и комплектующие на Automerc.by";
  const dBase =
    "Качественные детали и комплектующие с доставкой по Минску и Беларуси.";
  const dBase2 = "Быстрый подбор, удобная доставка по Минску и Беларуси.";
  const tailCatalog =
    "Подбор по марке, модели и поколению на сайте Automerc.by.";
  const tailModel =
    "Подбор по поколению, доставка по Минску и Беларуси. Automerc.by - надёжные автозапчасти для";
  const tailVIN =
    "Подбор по VIN, доставка по Минску и всей Беларуси. Automerc.by - всё для ремонта и обслуживания.";

  // ---------- Мультивыбор ----------
  if (isMulti) {
    if (focusName) {
      return {
        title: `Купить ${focusName} для легковых автомобилей в Минске${suffix}`,
        description: `Большой выбор запчастей в разделе ${focusName} для легковых автомобилей. ${dBase} ${tailCatalog}`,
      };
    }
    return {
      title: `Каталог автозапчастей${suffix}`,
      description: `Большой выбор автозапчастей для легковых автомобилей. ${dBase} ${tailCatalog}`,
    };
  }

  if (vehicles.length === 1) {
    const v = vehicles[0] || {};
    const brand = v.brand?.name ? norm(v.brand.name) : undefined;
    const model = v.model?.name ? norm(v.model.name) : undefined;
    const generation = v.generation?.name ? norm(v.generation.name) : undefined;

    if (brand && model && generation) {
      if (focusName) {
        return {
          title: `${focusName} для автомобилей ${brand} ${model} ${generation}${suffix}`,
          description: `Запчасти категории ${focusName} для ${brand} ${model} ${generation}. Только проверенные детали с гарантией. ${tailVIN}`,
        };
      }
      return {
        title: `Запчасти для ${brand} ${model} ${generation} — детали и комплектующие${suffix}`,
        description: `Запчасти для ${brand} ${model} ${generation}. Только проверенные детали с гарантией. ${tailVIN}`,
      };
    }

    if (brand && model) {
      if (focusName) {
        return {
          title: `${focusName} для автомобилей ${brand} ${model}${suffix}`,
          description: `Детали в разделе ${focusName} для ${brand} ${model}. Оригиналы и проверенные аналоги. ${tailModel} ${brand} ${model}.`,
        };
      }
      return {
        title: `Запчасти для ${brand} ${model} — детали и комплектующие${suffix}`,
        description: `Запчасти и комплектующие для ${brand} ${model}. Оригиналы и проверенные аналоги. ${tailModel} ${brand} ${model}.`,
      };
    }

    if (brand) {
      if (focusName) {
        return {
          title: `${focusName} для автомобилей ${brand}${suffix}`,
          description: `Запчасти в разделе ${focusName} для автомобилей ${brand}. Оригинальные и аналоги с гарантией качества. ${dBase2} Automerc.by - автозапчасти для ${brand}.`,
        };
      }
      return {
        title: `Запчасти для ${brand} — детали и комплектующие${suffix}`,
        description: `Большой выбор запчастей для ${brand}. ${dBase2} Automerc.by - автозапчасти для ${brand}.`,
      };
    }
  }

  if (focusName) {
    return {
      title: `Купить ${focusName} для легковых автомобилей в Минске${suffix}`,
      description: `Подберите ${focusName} для своего автомобиля на сайте автозапчастей Automerc.by. ${dBase} Подбор по марке, модели и поколению на сайте интернет-магазина.`,
    };
  }

  return {
    title: `Каталог автозапчастей${suffix}`,
    description: `Большой выбор автозапчастей для легковых автомобилей. ${dBase} ${tailCatalog}`,
  };
}

/* ---------- утилиты ---------- */
function norm(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}
