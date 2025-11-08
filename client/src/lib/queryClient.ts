import { QueryClient } from "@tanstack/react-query";

async function handleFetch(url: string, options?: RequestInit) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    if (response.status >= 500) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    throw new Error(`${response.status}: ${await response.text()}`);
  }

  return response.json();
}

export async function apiRequest(
  url: string,
  options?: RequestInit,
) {
  return handleFetch(url, options);
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const url = queryKey[0] as string;
        return handleFetch(url);
      },
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
