import {describe, expect, test} from "@jest/globals";
// @ts-ignore
import Joi from "joi";
import {validateSchema} from "../../src/utils";

describe("validationUtil", () => {
  const schema = Joi.object({
    name: Joi.string().required(),
    age: Joi.number().optional(),
  });
  it("should return undefined if the object is valid", async () => {
    const testObject1 = { name: "Full Name" };
    const testObject2 = { name: "Name", age: 10 };
    const result1 = await validateSchema(schema, testObject1);
    const result2 = await validateSchema(schema, testObject2);

    expect(result1).toBeUndefined();
    expect(result2).toBeUndefined();
  });
  it("should return a string if the object is invalid", async () => {
    const testObject1 = { name: 54 };
    const testObject2 = { name: "Name", age: "age" };
    const testObject3 = {};
    const result1 = await validateSchema(schema, testObject1);
    const result2 = await validateSchema(schema, testObject2);
    const result3 = await validateSchema(schema, testObject3);

    console.log({ result3, result2, result1 });

    expect(typeof result1).toBe(typeof "string");
    expect(typeof result2).toBe(typeof "string");
    expect(typeof result3).toBe(typeof "string");
  });
})