import { defaultFetch } from "@/utils/fetch's/defaultFetch";

export type ListResponse<T> = { total: number; items: T[] };
export type Entity = { id: number | null; name: string; slug: string };

export const getAllBrands = async (searchText?: string) => {
  const res = await defaultFetch(`/brands`);
  return res.ok ? await res.json() : [];
};

export const getModelsByBrand = async (
  brandId?: number,
  searchText?: string
) => {
  const res = await defaultFetch(
    `/model-series?brandId=${brandId}`
  );
  return res.ok ? await res.json() : [];
};

export const getGenerationsByModel = async (
  brandId?: number,
  modelId?: number,
  searchText?: string
) => {
  const res = await defaultFetch(
    `/generations?brandId=${brandId}&modelId=${modelId}`
  );
  return res.ok ? await res.json() : [];
};

export const getBrandBySlug = async (
  slug: string
): Promise<ListResponse<Entity>> => {
  const res = await defaultFetch(
    `/brands/bySlug/${slug}`
  );
  if (!res.ok) return { total: 0, items: [] };
  const data = await res.json();
  return data ?? { total: 0, items: [] };
};

export const getModelBySlug = async (
  slug: string
): Promise<ListResponse<Entity>> => {
  const res = await defaultFetch(
    `/model-series/bySlug/${slug}`
  );
  if (!res.ok) return { total: 0, items: [] };
  const data = await res.json();
  return data ?? { total: 0, items: [] };
};

export const getGenerationBySlug = async (
  slug: string
): Promise<ListResponse<Entity>> => {
  const res = await defaultFetch(
    `/generations/bySlug/${slug}`
  ); // ← убрал двойной слэш
  if (!res.ok) return { total: 0, items: [] };
  const data = await res.json();
  return data ?? { total: 0, items: [] };
};
