const { describe, test, expect } = require("@jest/globals");

const aws = require("aws-sdk");

aws.config.update({
  region: "us-east-1",
});

const requestMock = require("../mocks/request.json");
const { main } = require("../../src");

describe("Image analyser test suite", () => {
  test("it should analyse successfuly the image returning the results", async () => {
    const finalTexts = [
      "100.00% de ser do tipo Animais",
      "100.00% de ser do tipo mamíferos",
      "100.00% de ser do tipo macacos",
      "100.00% de ser do tipo vida selvagem",
      "96.04% de ser do tipo babuíno",
    ].join("\n");
    const expected = {
      statusCode: 200,
      body: "A imagem tem\n".concat(finalTexts),
    };

    const result = await main(requestMock);

    expect(result).toStrictEqual(expected);
  });
  test("given an empty queryString it should return status code 400", async () => {
    const expected = {
      statusCode: 400,
      body: "an IMG is required",
    };
    const result = await main({ queryStringParameters: {} });

    expect(result).toStrictEqual(expected);
  });
  test("given an invalid imageURL it should return 500", async () => {
    const expected = {
      statusCode: 500,
      body: "Internal Server Error",
    };
    const result = await main({
      queryStringParameters: {
        imageUrl: "invalid_image",
      },
    });

    expect(result).toStrictEqual(expected);
  });
});
