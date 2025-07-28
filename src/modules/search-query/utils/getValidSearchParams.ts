export function getValidSearchParams(
  searchParams: Record<string | number | symbol, unknown>,
  customProperties: Record<string, unknown>,
) {
  const allowedKeys = ["page", "limit", "sortBy", "sortOrder", "search", "searchKey"];

  const filteredParams = Object.keys(searchParams).reduce<Record<string, number | string | boolean>>((acc, key) => {
    if (typeof key === "string" && (allowedKeys.includes(key) || key in customProperties)) {
      const value = searchParams[key];
      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        acc[key] = value;
      }
    }
    return acc;
  }, {});

  return {
    ...customProperties,
    ...filteredParams,
  };
}
