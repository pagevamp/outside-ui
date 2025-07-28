import qs from "qs";
import type { ZodObject } from "zod/v4";

export function checkUrlQuery(
  schema: ZodObject,
  url: string | null | undefined,
) {
  const data = qs.parse(url?.split("?")[1] || "");

  return schema.safeParse(data);
}

export function checkSearchParams(schema: ZodObject, searchParams: object) {
  return schema.safeParse(searchParams);
}
