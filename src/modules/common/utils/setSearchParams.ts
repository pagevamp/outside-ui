type Options = {
  pushToHistory?: boolean;
};

export function setSearchParams(paramsToSet: object, options?: Options) {
  const url = new URL(window.location.href);

  const currentParams = JSON.parse(url.searchParams.toString());

  // Merge currentParams with paramsToSet and ensure URL-friendly formatting
  const updatedParams = Object.fromEntries(
    Object.entries({ ...currentParams, ...paramsToSet }).filter(
      ([_, value]) => value !== null && value !== undefined && value !== "",
    ),
  );

  // Manually build the query string
  const newQueryString = Object.entries(updatedParams)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    )
    .join("&");

  const fn = options?.pushToHistory
    ? window.history.pushState
    : window.history.replaceState;

  fn({}, "", url.pathname + "?" + newQueryString);
}
