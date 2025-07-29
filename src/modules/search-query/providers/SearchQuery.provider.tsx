"use client";

import { debounce, isEqual, omit } from "lodash";
import { setSearchParams } from "modules/common/utils/setSearchParams";
import { SortOrderEnum } from "modules/search-query/types/SortOrder";
import { parse } from "qs";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useState,
  useTransition,
} from "react";
import {
  DEFAULT_SEARCH_KEY,
  type ICustomFilter,
  type ISearchQuery,
  type ISearchQueryContext,
  SearchQueryContext,
} from "./search-query.context";

interface ProviderProps<T extends ICustomFilter> {
  defaultValues?: Partial<ISearchQuery<T>>;
  children: ReactNode;
  isLoading?: boolean;
  syncWithUrl?: boolean;
  initialSearchParams?: Record<string, unknown>;
}

export function SearchQueryProvider<T extends ICustomFilter>({
  children,
  defaultValues,
  initialSearchParams,
  syncWithUrl = false,
}: ProviderProps<T>) {
  const [filters, setFilters] = useState<ISearchQuery>({
    ...defaultValues,
    page: defaultValues?.page ?? 1,
    limit: defaultValues?.limit ?? 10,
    search: defaultValues?.search,
    sortBy: defaultValues?.sortBy,
    sortOrder: defaultValues?.sortOrder,
    searchKey: defaultValues?.searchKey ?? DEFAULT_SEARCH_KEY,
    ...initialSearchParams,
  });

  const [searchKey, setSearchKey] = useState(
    defaultValues?.searchKey ?? DEFAULT_SEARCH_KEY,
  );

  const [total, setTotal] = useState(0);

  const [_, startTransition] = useTransition();

  const [searchParams, setSearchParamsString] = useState(
    () => window.location.search,
  );

  useEffect(() => {
    if (!syncWithUrl) return;

    const handlePopState = () => {
      setSearchParamsString(window.location.search);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [syncWithUrl]);

  useEffect(() => {
    if (!syncWithUrl) {
      return;
    }

    const params = parse(searchParams, { ignoreQueryPrefix: true });
    const page = params.page;
    const limit = params.limit;
    const search = params.search;
    const sortBy = params.sortBy;
    const sortOrder = params.sortOrder;
    const searchKey = params.searchKey;

    const newFilters: Partial<ISearchQuery> = {};

    if (typeof page === "string") {
      newFilters.page = Number.parseInt(page, 10);
    }

    if (typeof limit === "string") {
      newFilters.limit = Number.parseInt(limit, 10);
    }

    if (typeof search === "string") {
      newFilters.search = search;
      if ((newFilters.page || filters.page || 1) > 1) {
        newFilters.page = 1;
      }
    } else if (filters.search) {
      newFilters.search = "";
      newFilters.page = 1;
    }

    if (typeof sortBy === "string") {
      newFilters.sortBy = sortBy;
    }

    if (typeof sortOrder === "string") {
      newFilters.sortOrder = sortOrder as SortOrderEnum;
    }

    if (typeof searchKey === "string") {
      newFilters.searchKey = searchKey;
    }

    if (defaultValues) {
      Object.keys(
        omit(defaultValues, [
          "searchKey",
          "search",
          "page",
          "limit",
          "sortBy",
          "sortOrder",
        ]),
      ).forEach((key) => {
        const value = params[key];
        if (value) {
          newFilters[key] = isNaN(Number(value)) ? value : Number(value);
        }
      });
    }

    setFilters((filters) => ({
      ...filters,
      ...newFilters,
    }));
  }, [defaultValues, filters.page, filters.search, searchParams, syncWithUrl]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: just run during unmount>
  useEffect(() => {
    if (!syncWithUrl) {
      return;
    }
    return () => {
      setSearchParams(
        Object.keys(filters).reduce<Record<string, null>>((acc, key) => {
          acc[key] = null;
          return acc;
        }, {}),
      );
    };
  }, []);

  const handleFilterChange = useCallback(
    (newFilters: Partial<ISearchQuery>) => {
      const prevFilters = Object.freeze({
        ...filters,
      });
      const updatedFilters = Object.assign({}, filters, newFilters);
      startTransition(() => {
        if (syncWithUrl) {
          // Find the difference between previous and updated filters
          const changedFilters = Object.keys(newFilters).reduce(
            (diff, key) => {
              if (key === "custom") {
                return diff;
              }
              if (!isEqual(prevFilters[key], newFilters[key])) {
                diff[key] = newFilters[key];
              }
              return diff;
            },
            {} as Record<string, unknown>,
          );
          if (syncWithUrl) {
            setSearchParams(changedFilters);
          }
        }

        setFilters(updatedFilters);
      });
    },
    [filters, syncWithUrl],
  );

  const updateSortBy = useCallback(
    (sortBy: string, sortOrder?: SortOrderEnum) => {
      handleFilterChange({
        sortOrder:
          sortOrder ??
          (sortBy === filters.sortBy && filters.sortOrder === SortOrderEnum.DESC
            ? SortOrderEnum.ASC
            : SortOrderEnum.DESC),
        sortBy: sortBy,
        page: 1,
      });
    },
    [handleFilterChange, filters.sortBy, filters.sortOrder],
  );

  const updatePage = useCallback(
    (page: number) => {
      handleFilterChange({
        page,
      });
    },
    [handleFilterChange],
  );

  const updateItemsPerPage = useCallback(
    (limit: number) => {
      handleFilterChange({
        page: 1,
        limit,
      });
    },
    [handleFilterChange],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const handleSearch: ISearchQueryContext["handleSearch"] = useCallback(
    debounce(
      (e) =>
        handleFilterChange({
          search: typeof e === "string" ? e : e.target.value,
          page: 1,
          searchKey: searchKey,
        }),
      250,
    ),
    [handleFilterChange, searchKey],
  );

  const updateCustomFilters: ISearchQueryContext["updateCustomFilters"] =
    useCallback(
      (newFilters) => {
        const data = {
          ...filters,
          ...newFilters,
        };

        handleFilterChange({
          ...data,
        });
      },
      [filters, handleFilterChange],
    );

  return (
    <SearchQueryContext.Provider
      value={{
        filters,
        updateSortBy,
        updatePage,
        total,
        updateItemsPerPage,
        searchKey,
        setSearchKey,
        handleSearch,
        updateCustomFilters,
        setTotal,
      }}
    >
      {children}
    </SearchQueryContext.Provider>
  );
}
