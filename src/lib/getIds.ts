import { defaultFetch } from "@/utils/fetch's/defaultFetch";

const idCache: Record<string, number[]> = {};

export const getIdsFromSlugs = async (
  slugs: string[]
): Promise<number[]> => {
  const cacheKey = `manufacturers:${slugs.join(',')}`;

  // if (idCache[cacheKey]) {
  //   return idCache[cacheKey];
  // }

  const res = await defaultFetch(`/ids/manufacturers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slugs }),
  });

  if (!res.ok) {
    console.error(`Failed to fetch manufacturers ids`);
    return [];
  }

  const data = await res.json();
  idCache[cacheKey] = data.ids;
  return data.ids;
};
