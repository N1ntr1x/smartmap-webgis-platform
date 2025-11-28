"use client";

import { useState, useEffect } from "react";
import { fetchSearchLocation, type SearchResult } from "@/features/geo";

interface UseSearchOptions {
  debounceTime?: number;
  applyFilter?: boolean;
}

/*
useSearch - Hook ricerca luoghi con debounce
Forward geocoding via Nominatim con filtri opzionali
*/
export default function useSearch(options: UseSearchOptions = {}) {
  const { debounceTime = 600, applyFilter = true } = options;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const timeout = setTimeout(async () => {
      try {
        const filtered = await fetchSearchLocation(query, applyFilter);
        setResults(filtered);
      } catch (err) {
        console.error("Errore ricerca:", err);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, debounceTime);

    return () => clearTimeout(timeout);
  }, [query, debounceTime, applyFilter]);

  const clearSearch = () => {
    setQuery("");
    setResults([]);
  };

  return {
    query,
    setQuery,
    results,
    isLoading,
    clearSearch
  };
}
