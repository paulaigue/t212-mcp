import { z } from "zod"
import { PieSchema } from "./schemas.js"

export type Pie = z.infer<typeof PieSchema>
