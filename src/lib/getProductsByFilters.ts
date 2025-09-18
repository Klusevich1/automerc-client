import { Product } from "@/interfaces/Product";
import { defaultFetch } from "@/utils/fetch's/defaultFetch";

interface Filters {
  // brandId?: number;
  // modelId?: number;
  // generationId?: number;
  // brandSlugId?: string;
  // modelSlugId?: string;
  // generationSlugId?: string;
  // categorySlugId?: string;
  categoryId?: number;
  subcategoryId?: number;
  limit?: number;
  page?: number;
  priceFrom?: number;
  priceTo?: number;
  inStockOnly?: boolean;
  sort?: "new" | "cheapest";
  filtersArray?: {
    brand_id?: number;
    model_id?: number;
    generation_id?: number;
  }[];
}

export const getProductsByFilters = async (
  filters?: Filters
): Promise<{ data: Product[]; total: number; page: number; limit: number }> => {
  try {
    const queryParams = new URLSearchParams();
    console.log(filters?.subcategoryId)

    if (filters?.categoryId)
      queryParams.append("categoryId", String(filters.categoryId));
    if (filters?.subcategoryId)
      queryParams.append("subcategoryId", String(filters.subcategoryId));
    if (filters?.limit) queryParams.append("limit", String(filters.limit));
    if (filters?.page) queryParams.append("page", String(filters.page));
    if (filters?.priceFrom)
      queryParams.append("priceFrom", String(filters.priceFrom));
    if (filters?.priceTo)
      queryParams.append("priceTo", String(filters.priceTo));
    if (filters?.inStockOnly)
      queryParams.append("inStockOnly", String(filters.inStockOnly));
    if (filters?.sort) queryParams.append("sort", filters.sort);

    const url = `/spare-parts?${queryParams.toString()}`;

    const response = await defaultFetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filters: filters?.filtersArray }),
    });
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return { data: [], total: 0, page: 0, limit: 0 };
  }
};
