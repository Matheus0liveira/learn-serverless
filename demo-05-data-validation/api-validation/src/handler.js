const Joi = require("@hapi/joi");
const { randomUUID } = require("node:crypto");

class Handler {
  constructor({ dynamoDbSvc }) {
    this.dynamoDbSvc = dynamoDbSvc;
    this.dynamoTable = "Heroes";
  }
  static validator() {
    return Joi.object({
      name: Joi.string().max(100).min(2).required(),
      power: Joi.string().max(20).min(2).required(),
    });
  }
  async main({ body }) {
    const params = this.prepareData(body);

    await this.dynamoDbSvc.put(params).promise();

    const insertedItem = await this.insertedHero(params);

    return {
      statusCode: 200,
      body: insertedItem,
    };
  }

  async insertedHero(params) {
    return await this.dynamoDbSvc
      .query({
        TableName: this.dynamoTable,
        ExpressionAttributeValues: {
          ":id": params.Item.id,
        },
        KeyConditionExpression: "id = :id",
      })
      .promise();
  }

  prepareData(body) {
    return {
      TableName: this.dynamoTable,
      Item: {
        ...body,
        id: randomUUID(),
        created_at: new Date().toISOString(),
      },
    };
  }
}

module.exports = Handler;
