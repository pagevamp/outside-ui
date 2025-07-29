import { StatusCodes } from "http-status-codes";
import { type ApiErrorOptions, ApiErrorResponse } from "./ApiErrorResponse.ts";

export class NotFoundError extends ApiErrorResponse {
  constructor(
    options: Omit<ApiErrorOptions, "message" | "status"> & { message: string },
  ) {
    super({
      ...options,
      status: StatusCodes.NOT_FOUND,
    });
  }
}
