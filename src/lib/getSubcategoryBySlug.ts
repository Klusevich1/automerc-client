import { defaultFetch } from "@/utils/fetch's/defaultFetch";

export const getSubcategoryBySlug = async (slug: string) => {
  const res = await defaultFetch(
    `/subcategories/bySlug/${slug}`
  );
  if (!res.ok) return null;

  const category = await res.json();
  return category;
};
