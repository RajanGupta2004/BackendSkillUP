import { test } from "node:test";
import assert from "node:assert/strict";
import { greetFunc } from "./app.js";

test("that greet the user", () => {
  // AAA
  // A = arrange
  // A = Act
  // A =   Assert

  const expected = "Hello Rajan";
  const acutual = greetFunc("Rajan");

  assert.strictEqual(acutual, expected);
});
