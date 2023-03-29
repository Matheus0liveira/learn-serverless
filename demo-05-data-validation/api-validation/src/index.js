const { dynamoDB } = require("./factory");
const Handler = require("./handler");
const { decoratorValidator } = require("./util");

const handler = new Handler({ dynamoDbSvc: dynamoDB });

const herosTriggers = async ({ body }) => {
  console.log("event ---", event);
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Go Serverless v3.0! Your function executed successfully!",
        input: event,
      },
      null,
      2
    ),
  };
};

const herosInsert = decoratorValidator(
  handler.main.bind(handler),
  Handler.validator(),
  "body"
);

module.exports = {
  herosTriggers,
  herosInsert,
};
