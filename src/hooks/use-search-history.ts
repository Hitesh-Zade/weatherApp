import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface SearchHistoryItem {
  id: string;
  query: string;
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
  searchedAt: Date;
}

const SEARCH_HISTORY_KEY = "weather-search-history";
const MAX_HISTORY_ITEMS = 10;

const getSearchHistory = (): SearchHistoryItem[] => {
  const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
  if (!stored) return [];
  
  const parsed = JSON.parse(stored);
  // Convert searchedAt back to Date objects
  return parsed.map((item: any) => ({
    ...item,
    searchedAt: new Date(item.searchedAt),
  }));
};

const saveSearchHistory = (history: SearchHistoryItem[]): void => {
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
};

export function useSearchHistory() {
  const queryClient = useQueryClient();

  const historyQuery = useQuery({
    queryKey: ["search-history"],
    queryFn: getSearchHistory,
    staleTime: Infinity,
  });

  const addToHistory = useMutation({
    mutationFn: async (searchItem: Omit<SearchHistoryItem, "id" | "searchedAt">) => {
      const history = getSearchHistory();
      
      // Remove if already exists to avoid duplicates
      const filteredHistory = history.filter(
        (item) => !(item.lat === searchItem.lat && item.lon === searchItem.lon)
      );

      const newHistoryItem: SearchHistoryItem = {
        ...searchItem,
        id: `${searchItem.lat}-${searchItem.lon}-${Date.now()}`,
        searchedAt: new Date(),
      };

      // Add to beginning and limit to MAX_HISTORY_ITEMS
      const updatedHistory = [newHistoryItem, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);
      saveSearchHistory(updatedHistory);
      return updatedHistory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["search-history"] });
    },
  });

  const clearHistory = useMutation({
    mutationFn: async () => {
      saveSearchHistory([]);
      return [];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["search-history"] });
    },
  });

  const removeFromHistory = useMutation({
    mutationFn: async (itemId: string) => {
      const history = getSearchHistory();
      const updatedHistory = history.filter((item) => item.id !== itemId);
      saveSearchHistory(updatedHistory);
      return updatedHistory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["search-history"] });
    },
  });

  return {
    history: historyQuery.data || [],
    isLoading: historyQuery.isLoading,
    addToHistory,
    clearHistory,
    removeFromHistory,
  };
}
