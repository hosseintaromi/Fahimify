import type { NutrientTargets, WeeklyPlanResult } from "./fahimeh"
import type { UserPreferences } from "./fahimeh"

export type UserProfileData = {
  userId: string
  personalMetrics: {
    age: number
    sex: "male" | "female"
    weightKg: number
    heightCm: number
    pal: number
  }
  preferences: UserPreferences
  nutrientTargets: NutrientTargets
}

const profiles = new Map<string, UserProfileData>()
const plans = new Map<string, WeeklyPlanResult>()

export const memoryStore = {
  profiles,
  plans,
}

