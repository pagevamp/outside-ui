import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod/v4";
import { ApiErrorResponse } from "./ApiErrorResponse";

export class ValidationError extends ApiErrorResponse {
  public fieldErrors: Record<string, string> = {};
  public status = StatusCodes.UNPROCESSABLE_ENTITY;
  constructor(error: ZodError | Record<string, string>) {
    super({ message: "Invalid data" });
    if (error instanceof ZodError) {
      this.fieldErrors = error.issues.reduce<Record<string, string>>(
        (acc, issue) => {
          const path = issue.path[0] as string;
          return {
            ...acc,
            [path]: issue.message,
          };
        },
        {},
      );
    } else {
      this.fieldErrors = error;
    }
  }
}
