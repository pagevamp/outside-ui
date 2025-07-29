export function getPaginationSummary(
  query: { page: number; limit: number },
  totalItems: number,
) {
  return {
    currentPage: query.page,
    limit: query.limit,
    nextPage:
      totalItems > query.page * query.limit ? query.page + 1 : undefined,
    total: totalItems,
  };
}
