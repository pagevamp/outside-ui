import { z } from "zod/v4";

export const queryBoolean = z.enum(["true", "false"]);
