"use client";

import { type ChangeEvent, createContext } from "react";
import type { SortOrderEnum } from "../types/SortOrder.ts";

export type ICustomFilter = Record<string, unknown>;

export type ISearchQuery<T extends ICustomFilter = ICustomFilter> = T & {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: SortOrderEnum;
  search?: string;
  searchKey: string;
};

export const DEFAULT_SEARCH_KEY = "search";

export type ISearchQueryContext<T extends ICustomFilter = ICustomFilter> = {
  filters: ISearchQuery<T>;
  updateItemsPerPage: (numberOfItems: number) => void;
  updatePage: (page: number) => void;
  updateSortBy: (sortBy: string, sortOrder?: SortOrderEnum) => void;
  searchKey: string;
  setSearchKey: (key: string) => void;
  total: number;
  setTotal: (total: number) => void;
  handleSearch: (search: string | ChangeEvent<HTMLInputElement>) => void;
  updateCustomFilters: (filters: Partial<T>) => void;
};

export const SearchQueryContext = createContext<ISearchQueryContext>({
  filters: {
    page: 1,
    limit: 10,
    searchKey: DEFAULT_SEARCH_KEY,
  },
  updateItemsPerPage: () => {},
  updatePage: () => {},
  updateSortBy: () => {},
  searchKey: DEFAULT_SEARCH_KEY,
  setSearchKey: () => {},
  total: 0,
  setTotal: () => {},
  handleSearch: () => {},
  updateCustomFilters: () => {},
});
