import { Category } from "@/interfaces/Category";
import { ParsedUrlQuery } from "querystring";
import { getCategoryBySlug } from "./getCategoryBySlug";
import { getBrandBySlug } from "./carInfo";
import { Subcategory } from "@/interfaces/Subcategory";
import { getSubcategoryBySlug } from "./getSubcategoryBySlug";

export type VehicleSlug = {
  brand?: string | null;
  model?: string | null;
  generation?: string | null;
};

export type CatalogPath = {
  categorySlugId?: string | null;
  categoryEntity?: Category | null;
  subcategorySlugId: string | null;
  subcategoryEntity: Subcategory | null;
  primary: VehicleSlug;
  leftover?: string[];
};

export async function getAllCategorySlugs(): Promise<string[]> {
  return [];
}

export function parseAlsoParam(
  alsoRaw: string | string[] | undefined
): VehicleSlug[] {
  if (!alsoRaw) return [];
  const raw = Array.isArray(alsoRaw) ? alsoRaw[0] : alsoRaw;
  const decoded = decodeURIComponent(raw);
  return decoded
    .split("~")
    .map((chunk) => {
      const [brand, model, generation] = chunk.split("::").filter(Boolean);
      return {
        brand: brand || null,
        model: model || null,
        generation: generation || null,
      } as VehicleSlug;
    })
    .filter((v) => !!v.brand);
}

export async function parseCatalogPath(segs: string[]): Promise<CatalogPath> {
  if (!segs || segs.length === 0) {
    return {
      categorySlugId: null,
      categoryEntity: null,
      subcategorySlugId: null,
      subcategoryEntity: null,
      primary: {},
      leftover: [],
    };
  }

  const [s0, s1, s2, s3, s4, ...rest] = segs;

  const maybeBrand0 = s0 ? await getBrandBySlug(s0) : null;
  if (maybeBrand0?.items?.length) {
    return {
      categorySlugId: null,
      categoryEntity: null,
      subcategorySlugId: null,
      subcategoryEntity: null,
      primary: { brand: s0 || null, model: s1 || null, generation: s2 || null },
      leftover: [s3, s4, ...rest].filter(Boolean),
    };
  }

  const maybeCat = s0 ? await getCategoryBySlug(s0) : null;
  const cat = maybeCat?.items?.[0] || null;

  if (cat) {
    let subcat: Subcategory | null = null;
    if (s1) {
      // Вариант A: если у категории есть children и они уже отданы сервером
      subcat =
        cat.subcategories?.find((c: Subcategory) => c.slug === s1) || null;

      // Вариант B: если children нет — проверяем s1 как категорию и сверяем parentId
      const maybeSubcat = await getSubcategoryBySlug(s1);
      const s1Cat = maybeSubcat?.items?.[0] || null;
      if (s1Cat && s1Cat.category_id === cat.id) {
        subcat = s1Cat;
      }
    }

    if (subcat) {
      const maybeBrand2 = s2 ? await getBrandBySlug(s2) : null;
      if (maybeBrand2?.items?.length) {
        return {
          categorySlugId: s0,
          categoryEntity: cat,
          subcategorySlugId: s1,
          subcategoryEntity: subcat,
          primary: {
            brand: s2 || null,
            model: s3 || null,
            generation: s4 || null,
          },
          leftover: rest,
        };
      }

      return {
        categorySlugId: s0,
        categoryEntity: cat,
        subcategorySlugId: s1,
        subcategoryEntity: subcat,
        primary: {},
        leftover: [s2, s3, s4, ...rest].filter(Boolean),
      };
    }

    const maybeBrand1 = s1 ? await getBrandBySlug(s1) : null;
    if (maybeBrand1?.items?.length) {
      return {
        categorySlugId: s0,
        categoryEntity: cat,
        subcategorySlugId: null,
        subcategoryEntity: null,
        primary: {
          brand: s1 || null,
          model: s2 || null,
          generation: s3 || null,
        },
        leftover: [s4, ...rest].filter(Boolean),
      };
    }

    return {
      categorySlugId: s0,
      categoryEntity: cat,
      subcategorySlugId: null,
      subcategoryEntity: null,
      primary: {},
      leftover: [s1, s2, s3, s4, ...rest].filter(Boolean),
    };
  }

  return {
    categorySlugId: null,
    categoryEntity: null,
    subcategorySlugId: null,
    subcategoryEntity: null,
    primary: {},
    leftover: segs,
  };
}

export type ProductQuery = {
  page: number;
  limit: number;
  priceFrom?: number | null;
  priceTo?: number | null;
  sort?: "new" | "cheapest" | null;
};

export function parseProductQuery(query: ParsedUrlQuery): ProductQuery {
  const page = Math.max(1, parseInt((query.page as string) || "1", 10));
  const limit = Math.min(
    60,
    Math.max(1, parseInt((query.limit as string) || "24", 10))
  );

  const priceFrom = query.priceFrom != null ? Number(query.priceFrom) : null;
  const priceTo = query.priceTo != null ? Number(query.priceTo) : null;

  const sortQ = (query.sort as string) || null;
  const sort: ProductQuery["sort"] =
    sortQ === "new" || sortQ === "cheapest" ? sortQ : null;

  return { page, limit, priceFrom, priceTo, sort };
}
