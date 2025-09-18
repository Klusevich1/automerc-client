import { Category } from "@/interfaces/Category";
import { Subcategory } from "@/interfaces/Subcategory";

interface Breadcrumb {
  name: string;
  link: string;
}

export const generateCatalogBreadcrumbs = (
  category: Category,
  subcategory?: Subcategory,
  vehicles?: {
    brand: { id: number; name: string; slug: string } | null;
    model: { id: number; name: string; slug: string } | null;
    generation: { id: number; name: string; slug: string } | null;
  }[],
  also?: string[]
): Breadcrumb[] => {
  const baseBreadcrumbs = [
    { name: "Главная", link: "/" },
    { name: "Каталог", link: "/catalog" },
    ...(category
      ? [{ name: category.name, link: `/catalog/${category.slug}` }]
      : []),
    ...(subcategory
      ? [
          {
            name: subcategory.name,
            link: `/catalog/${category.slug}/${subcategory.slug}`,
          },
        ]
      : []),
  ];

  // Проверяем, есть ли валидные vehicles
  const hasValidVehicles =
    vehicles &&
    vehicles.length > 0 &&
    vehicles.some(
      (vehicle) => vehicle.brand || vehicle.model || vehicle.generation
    );

  if (!hasValidVehicles) {
    return baseBreadcrumbs;
  }

  // Фильтруем валидные vehicles
  const validVehicles = vehicles!.filter(
    (vehicle) => vehicle.brand || vehicle.model || vehicle.generation
  );

  if (validVehicles.length > 1) {
    const lastLink = baseBreadcrumbs[baseBreadcrumbs.length - 1]?.link;
    const alsoParams =
      also && also.length > 0
        ? `?also=${encodeURIComponent(also.join(","))}`
        : "";

    return [
      ...baseBreadcrumbs,
      { name: "Подбор под несколько авто", link: `${lastLink}${alsoParams}` },
    ];
  }

  const vehicle = validVehicles[0];
  const vehicleBreadcrumbs = [];
  let currentLink =
    baseBreadcrumbs[baseBreadcrumbs.length - 1]?.link || "/catalog";

  // Добавляем только те элементы, которые не null
  if (vehicle.brand) {
    currentLink = `${currentLink}/${vehicle.brand.slug}`;
    vehicleBreadcrumbs.push({
      name: vehicle.brand.name,
      link: currentLink,
    });
  }

  if (vehicle.model) {
    currentLink = `${currentLink}/${vehicle.model.slug}`;
    vehicleBreadcrumbs.push({
      name: vehicle.model.name,
      link: currentLink,
    });
  }

  if (vehicle.generation) {
    currentLink = `${currentLink}/${vehicle.generation.slug}`;
    vehicleBreadcrumbs.push({
      name: vehicle.generation.name,
      link: currentLink,
    });
  }

  // Добавляем параметр also к последней ссылке если есть
  if (also && also.length > 0 && vehicleBreadcrumbs.length > 0) {
    const lastIndex = vehicleBreadcrumbs.length - 1;
    vehicleBreadcrumbs[lastIndex].link = `${
      vehicleBreadcrumbs[lastIndex].link
    }?also=${encodeURIComponent(also.join(","))}`;
  }

  return [...baseBreadcrumbs, ...vehicleBreadcrumbs];
};
