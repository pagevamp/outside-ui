import { useContext } from "react";
import { SearchQueryContext, type ICustomFilter, type ISearchQueryContext } from "./search-query.context";

export function useSearchQuery<T extends ICustomFilter>(): ISearchQueryContext<T> {
  return useContext<ISearchQueryContext<T>>(
    // @ts-expect-error we are overriding for type support to custom filters.
    SearchQueryContext,
  );
}
