import { StatusCodes } from "http-status-codes";
import { type ApiErrorOptions, ApiErrorResponse } from "./ApiErrorResponse";

export class UnauthorizedError extends ApiErrorResponse {
  constructor({
    message = "You are not allowed to perform this action",
  }: ApiErrorOptions = {}) {
    super({
      message: message,
      status: StatusCodes.UNAUTHORIZED,
    });
  }
}
