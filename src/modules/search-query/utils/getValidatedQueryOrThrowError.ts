import { StatusCodes } from "http-status-codes";
import { checkUrlQuery } from "modules/common/utils/checkUrlQuery";
import { ApiErrorResponse } from "modules/errors/ApiErrorResponse";
import type { ZodObject, z } from "zod/v4";

export function getValidatedQueryOrThrowError<T extends ZodObject>(
  url: string,
  schema: T,
) {
  const parsed = checkUrlQuery(schema, url);

  if (!parsed.success) {
    throw new ApiErrorResponse({
      message: parsed.error.message,
      details: parsed.error.issues,
      status: StatusCodes.BAD_REQUEST,
    });
  }

  return parsed.data as z.output<T>;
}
