import { getReasonPhrase, StatusCodes } from "http-status-codes";

export type ApiErrorOptions = {
  status?: number;
  message?: string;
  details?: unknown;
};

export class ApiErrorResponse extends Error {
  public status: StatusCodes;
  public details?: unknown;
  public reason: string;
  public message: string;

  constructor({ status, message, details }: ApiErrorOptions = {}) {
    super(message || "Something went wrong!");
    this.message = message || "Something went wrong!";
    const statusCode = status || StatusCodes.INTERNAL_SERVER_ERROR;
    this.status = statusCode;
    if (details && process.env.NODE_ENV !== "production") {
      this.details = details;
    }
    this.reason = getReasonPhrase(statusCode);
  }
}
