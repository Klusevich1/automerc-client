import { Promo } from "@/interfaces/Promo";
import { defaultFetch } from "@/utils/fetch's/defaultFetch";

export const getAllPromos = async (): Promise<Promo[]> => {
  try {
    const response = await defaultFetch(
      `/promos`,
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

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch promos:", error);
    return [];
  }
};
