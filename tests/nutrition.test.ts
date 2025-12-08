import { calculateBmrHenry, calculateTee, rmseDeviation } from "@/lib/nutrition"

describe("nutrition utils", () => {
  it("computes bmr with henry coefficients", () => {
    const bmr = calculateBmrHenry({ weightKg: 70, heightCm: 175, age: 25, sex: "male" })
    expect(bmr).toBeGreaterThan(1400)
  })

  it("computes tee", () => {
    const bmr = 1600
    const tee = calculateTee(bmr, 1.6)
    expect(tee).toBeCloseTo(2560)
  })

  it("calculates rmse deviation", () => {
    const rmse = rmseDeviation({ protein: 40 }, { protein: 50 })
    expect(rmse).toBeGreaterThan(0)
  })
})

