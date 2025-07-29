import { useContext } from "react";
import {
  type ICustomFilter,
  type ISearchQueryContext,
  SearchQueryContext,
} from "./search-query.context.ts";

export function useSearchQuery<
  T extends ICustomFilter,
>(): ISearchQueryContext<T> {
  return useContext<ISearchQueryContext<T>>(
    // @ts-expect-error we are overriding for type support to custom filters.
    SearchQueryContext,
  );
}
