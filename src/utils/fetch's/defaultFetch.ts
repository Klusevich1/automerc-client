export const defaultFetch = async (
  endpoint: string,
  options?: RequestInit
): Promise<Response> => {
  const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;
  const API_KEY = process.env.NEXT_PUBLIC_SERVER_API_KEY;

  if (!BASE_URL) {
    throw new Error(
      "NEXT_PUBLIC_LOCAL_SERVER_URL is not defined in the environment variables."
    );
  }

  if (!API_KEY) {
    throw new Error(
      "SERVER_API_KEY is not defined in the environment variables."
    );
  }

  const url = `${BASE_URL}${endpoint}`;

  const authOptions: RequestInit = {
    ...options,
    credentials: "include",
    headers: {
      ...options?.headers,
      "x-api-key": API_KEY,
    },
  };

  const response = await fetch(url, authOptions);

  console.warn("response.status: ", response.status);

  switch (
    response.status
    //case 401: window.location.href = '/login'; return response;
    //case 404: window.location.href = '/404'; return response;
    //case 500: window.location.href = '/500'; return response;
  ) {
  }

  return response;
};
