import { SortOrderEnum } from "modules/search-query/types/SortOrder";
import { type ZodObject, z } from "zod/v4";

type DefaultLimits = {
  minLimit?: number;
  limit?: number;
  maxLimit?: number;
};

export const createQuerySchema = <
  T extends Record<string, unknown>,
  S extends ZodObject = ZodObject,
  Y extends Extract<keyof T, string> = Extract<keyof T, string>,
>(options: {
  sortableFields: ReadonlyArray<Y>;
  defaultLimits?: DefaultLimits;
  extend?: S;
  defaultSortBy?: Y;
  defaultSortOrder?: SortOrderEnum;
}) => {
  const DefaultPaginationSchema = z.object({
    search: z.string().optional(),
    sortOrder: z
      .enum(Object.values(SortOrderEnum))
      .optional()
      .default(options.defaultSortOrder || SortOrderEnum.DESC),
    page: z.coerce.number().int().positive().min(1).optional().default(1),
    limit: z.coerce
      .number()
      .int()
      .positive()
      .min(options.defaultLimits?.minLimit ?? 0)
      .max(options.defaultLimits?.maxLimit ?? 1000)
      .optional()
      .default(options.defaultLimits?.limit ?? 12),
  });

  const sortBySchema = z.enum(
    options.sortableFields as unknown as readonly [string, ...string[]],
  );
  return DefaultPaginationSchema.extend({
    sortBy: options.defaultSortBy
      ? sortBySchema.default(options.defaultSortBy)
      : sortBySchema,
  });
};
