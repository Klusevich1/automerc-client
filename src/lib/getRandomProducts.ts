import { Product } from "@/interfaces/Product";
import { defaultFetch } from "@/utils/fetch's/defaultFetch";

export const getRandomProducts = async (
  count: number
): Promise<{ total: number; spareParts: Product[] }> => {
  try {
    const url = `/spare-parts/random/${count}`;


    const response = await defaultFetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return { total: 0, spareParts: [] };
  }
};
