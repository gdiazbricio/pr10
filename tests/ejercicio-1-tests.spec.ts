import "mocha";
import { expect } from "chai"; 
import { addNumbers } from "../src/ejercicio1.js"

describe("exercise 1 tests", () => {
  it("Must add two numbers", () => {
    expect(addNumbers(3,7)).to.be.equal(10);
  });
})