import { describe, expect, it } from "vitest";
import { EMPTY_BAR_FORM, type BarFormValues } from "./form-values";
import { validateBar, validateVisit } from "./validation";

const visitedBar: BarFormValues = {
  ...EMPTY_BAR_FORM,
  name: "Howell's",
  neighborhood_id: "17",
  type: "Wine",
  visit_status: "visited",
  rating: "5",
  would_return: "yes",
};

const wantToTryBar: BarFormValues = {
  ...EMPTY_BAR_FORM,
  name: "Zam Zam",
  neighborhood_id: "11",
  type: "Cocktail",
  visit_status: "want_to_try",
};

describe("validateBar", () => {
  it("accepts a complete visited bar", () => {
    expect(validateBar(visitedBar)).toEqual({});
  });

  it("accepts a want-to-try bar with no rating", () => {
    expect(validateBar(wantToTryBar)).toEqual({});
  });

  it("asks for every required field on an empty form", () => {
    const errors = validateBar(EMPTY_BAR_FORM);
    expect(Object.keys(errors).sort()).toEqual(
      ["name", "neighborhood_id", "type", "visit_status"].sort(),
    );
  });

  it("treats a name of only spaces as blank", () => {
    expect(validateBar({ ...visitedBar, name: "   " }).name).toBe(
      "Please give this bar a name.",
    );
  });

  it("needs a rating when the bar is visited", () => {
    const errors = validateBar({ ...visitedBar, rating: "" });
    expect(errors).toEqual({
      rating: "You've been here, so give it a rating from 1 to 5 stars.",
    });
  });

  it("needs a would-you-go-back answer when the bar is visited", () => {
    const errors = validateBar({ ...visitedBar, would_return: "" });
    expect(Object.keys(errors)).toEqual(["would_return"]);
  });

  it("rejects ratings outside 1 to 5", () => {
    expect(validateBar({ ...visitedBar, rating: "6" }).rating).toBe(
      "Ratings go from 1 to 5 stars.",
    );
    expect(validateBar({ ...visitedBar, rating: "0" }).rating).toBeDefined();
  });

  it("rejects a type that isn't in the list", () => {
    expect(validateBar({ ...visitedBar, type: "Karaoke" }).type).toBe(
      "Please choose a type from the list.",
    );
  });
});

describe("validateVisit (marking a want-to-try bar as visited)", () => {
  it("accepts a rating and an answer", () => {
    expect(validateVisit({ rating: "4", would_return: "no" })).toEqual({});
  });

  it("asks for both when neither is given", () => {
    expect(validateVisit({ rating: "", would_return: "" })).toEqual({
      rating: "You've been here, so give it a rating from 1 to 5 stars.",
      would_return: "Would you go back? Choose Yes or No.",
    });
  });

  it("rejects a rating outside 1 to 5", () => {
    expect(validateVisit({ rating: "9", would_return: "yes" })).toEqual({
      rating: "Ratings go from 1 to 5 stars.",
    });
  });
});

describe("validateBar tags", () => {
  it("accepts tags from the list", () => {
    expect(validateBar({ ...visitedBar, good_for: ["sunny", "food"] })).toEqual({});
  });

  it("rejects a tag that isn't in the list", () => {
    expect(validateBar({ ...visitedBar, good_for: ["karaoke"] }).good_for).toBe(
      "Please pick tags from the list.",
    );
  });
});
