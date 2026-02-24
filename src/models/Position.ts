import { z } from "zod"
import { PositionSchema } from "./schemas.js"

export type Position = z.infer<typeof PositionSchema>
