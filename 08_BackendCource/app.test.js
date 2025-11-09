import { test, suite } from "node:test";
import assert from "node:assert/strict";
import { greetFunc, greetFuncInHindi } from "./app.js";

// suits is alias as describe

test("that greet the user", () => {
  // AAA
  // A = arrange
  // A = Act
  // A =   Assert

  const expected = "Hello Rajan";
  const acutual = greetFunc("Rajan");

  assert.strictEqual(acutual, expected);
});

suite("that greet in two language", () => {
  test("that greet the user", () => {
    const expected = "Hello Rajan";
    const acutual = greetFunc("Rajan");
    assert.strictEqual(acutual, expected);
  });

  test("that greet the user in hindi", () => {
    const expected = "Namaste Rajan";
    const acutual = greetFuncInHindi("Rajan");
    assert.strictEqual(acutual, expected);
  });
});
