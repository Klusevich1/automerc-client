import { defaultFetch } from "@/utils/fetch's/defaultFetch";

export const getCategoryBySlug = async (slug: string) => {
  const res = await defaultFetch(
    `/categories/bySlug/${slug}`
  );
  if (!res.ok) return null;

  const category = await res.json();
  return category;
};
