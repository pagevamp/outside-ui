import type { ModuleEntries } from "src/types/ModuleEntries";

export const moduleEntries: ModuleEntries = {
  types: {
    "sort-order": "SortOrder.ts",
  },
  utils: {
    createQuerySchema: "createQuerySchema.ts",
    getPaginationSummary: "getPaginationSummary.ts",
    getValidatedQueryOrThrowError: "getValidatedQueryOrThrowError.ts",
    getValidSearchParams: "getValidSearchParams.ts",
  },
  extra: {
    providers: "providers/index.ts",
  },
};
