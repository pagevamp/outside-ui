"use client";

import { useLazySearch } from "lib/lazy-search";
import type { IBaseSearchQuery } from "lib/search-query/types";
import { setSearchParams } from "lib/set-search-params";
import isEqual from "lodash/isEqual";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import { SearchQueryContext } from "./search-query.context";

interface ProviderProps<T extends IBaseSearchQuery> {
  defaultValues?: Partial<T>;
  children: ReactNode;
  initialSearchParams?: Partial<IBaseSearchQuery & T>;
  syncWithUrl?: boolean;
}

export function SearchQueryProvider<T extends IBaseSearchQuery>({
  children,
  initialSearchParams,
  defaultValues,
  syncWithUrl = false,
}: ProviderProps<T>): ReactNode {
  const [searchQuery, setSearchQuery] = useState<T>({
    ...defaultValues,
    ...initialSearchParams,
  } as T);

  const [total, setTotal] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <need only on mount>
  useEffect(() => {
    if (!syncWithUrl) {
      return;
    }
    return () => {
      setSearchParams(
        Object.keys(searchQuery).reduce<Record<string, null>>((acc, key) => {
          acc[key] = null;
          return acc;
        }, {})
      );
    };
  }, []);

  const updateQuery = useCallback(
    (newFilters: Partial<T>) => {
      const prevFilters = Object.freeze({
        ...searchQuery,
      });

      if ((newFilters.sortBy || !newFilters.sortOrder || newFilters.search || newFilters.limit) && !newFilters.page) {
        newFilters.page = 1;
      }

      const updatedFilters = { ...searchQuery, ...newFilters };

      if (syncWithUrl) {
        // Find the difference between previous and updated filters
        const changedFilters = (Object.keys(newFilters) as unknown as (keyof T)[]).reduce(
          (diff, key) => {
            if (key === "custom") {
              return diff;
            }
            if (!isEqual(prevFilters[key], newFilters[key])) {
              diff[key] = newFilters[key];
            }
            return diff;
          },
          {} as Partial<T>
        );

        setSearchParams(changedFilters);
      }

      setSearchQuery(updatedFilters);
    },
    [searchQuery, syncWithUrl]
  );

  const { handleInputChangeDebounced } = useLazySearch({
    initialQuery: typeof initialSearchParams?.search === "string" ? initialSearchParams.search : "",
    onDebouncedChange: (value: string) =>
      updateQuery({
        search: value,
        page: 1,
      } as T),
  });

  return (
    <SearchQueryContext.Provider
      value={{
        searchQuery,
        // @ts-expect-error invalid type ignore for now
        updateQuery,
        total,
        handleSearch: handleInputChangeDebounced,
        setTotal,
      }}
    >
      {children}
    </SearchQueryContext.Provider>
  );
}
