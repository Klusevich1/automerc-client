import { Category } from "@/interfaces/Category";
import { defaultFetch } from "@/utils/fetch's/defaultFetch";

export const getAllCategories = async (): Promise<{
  total: number;
  items: Category[];
}> => {
  try {
    const response = await defaultFetch(
      `/categories`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "force-cache",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json()

    return data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return { total: 0, items: [] };
  }
};
