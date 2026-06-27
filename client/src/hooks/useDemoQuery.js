import { useQuery } from "@tanstack/react-query";

export function useDemoQuery(key, fetcher, fallback) {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      try {
        return await fetcher();
      } catch {
        return fallback;
      }
    }
  });
}
