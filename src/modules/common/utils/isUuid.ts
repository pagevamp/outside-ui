import { z } from "zod/v4";

const uuidSchema = z.uuidv4();

export function isUuid(id: string): boolean {
  return uuidSchema.safeParse(id).success;
}
