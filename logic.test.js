import { describe, it, expect } from "vitest";
import { filterSpaces, averageRating } from "./logic.js";
import { INITIAL_SPACES, INITIAL_REVIEWS } from "./data.js";

describe("filterSpaces", () => {
  it("returns everything with empty filters", () => {
    expect(filterSpaces(INITIAL_SPACES, {})).toHaveLength(INITIAL_SPACES.length);
  });
  it("filters by district and budget", () => {
    const r = filterSpaces(INITIAL_SPACES, { district: "Kreuzberg", maxCost: "150" });
    expect(r.map((s) => s.id)).toEqual([1]);
  });
});
describe("averageRating", () => {
  it("averages reviews for a target", () => {
    expect(averageRating(INITIAL_REVIEWS, "space", 1)).toEqual({ avg: 5, count: 1 });
  });
  it("returns null when there are no reviews", () => {
    expect(averageRating(INITIAL_REVIEWS, "space", 99)).toBeNull();
  });
});
