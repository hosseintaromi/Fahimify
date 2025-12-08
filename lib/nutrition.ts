type HenryRow = { min: number; max: number; weight: number; height: number; constant: number }

const henryMale: HenryRow[] = [
  { min: 18, max: 29, weight: 14.4, height: 313, constant: 113 },
  { min: 30, max: 59, weight: 11.4, height: 541, constant: 137 },
  { min: 60, max: 99, weight: 11.7, height: 588, constant: 74 },
]

const henryFemale: HenryRow[] = [
  { min: 18, max: 29, weight: 10.4, height: 615, constant: -282 },
  { min: 30, max: 59, weight: 8.2, height: 502, constant: -11 },
  { min: 60, max: 99, weight: 9, height: 637, constant: -302 },
]

export type Sex = "male" | "female"

export type BmrInput = {
  weightKg: number
  heightCm: number
  age: number
  sex: Sex
}

export const calculateBmrHenry = ({ weightKg, heightCm, age, sex }: BmrInput) => {
  const table = sex === "male" ? henryMale : henryFemale
  const match = table.find((row) => age >= row.min && age <= row.max) ?? table[table.length - 1]
  const heightM = heightCm / 100
  return match.weight * weightKg + match.height * heightM + match.constant
}

export const calculateTee = (bmr: number, pal: number) => bmr * pal

export const rmseDeviation = (actual: Record<string, number>, target: Record<string, number>) => {
  const keys = Object.keys(target)
  if (!keys.length) return 0
  const total = keys.reduce((sum, key) => {
    const expected = target[key] ?? 0
    const value = actual[key] ?? 0
    if (!expected) return sum
    const diff = (value - expected) / expected
    return sum + diff * diff
  }, 0)
  return Math.sqrt(total / keys.length)
}

