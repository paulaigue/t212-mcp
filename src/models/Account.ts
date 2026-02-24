import { z } from "zod"
import { AccountCashSchema, AccountMetadataSchema } from "./schemas.js"

export type AccountCash = z.infer<typeof AccountCashSchema>
export type AccountMetadata = z.infer<typeof AccountMetadataSchema>
