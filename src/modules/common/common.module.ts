import type { ModuleEntries } from "src/types/ModuleEntries";

export const moduleEntries: ModuleEntries = {
  // utils
  utils: {
    checkUrlQuery: "checkUrlQuery.ts",
    getClassNames: "getClassNames.ts",
    isUuid: "isUuid.ts",
    setSearchParams: "setSearchParams.ts",
  },
  // errors
  extra: {
    "errors/ApiErrorResponse": "errors/ApiErrorResponse.ts",
    "errors/NotFoundError": "errors/NotFoundError.ts",
    "errors/UnauthorizedError": "errors/UnauthorizedError.ts",
    "errors/ValidationError": "errors/ValidationError.ts",
    "schemas/booleanQuery": "schemas/query.boolean.ts",
  },
};
