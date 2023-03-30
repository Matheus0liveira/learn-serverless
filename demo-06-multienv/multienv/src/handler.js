const { settings } = require("../configs/settings");
const axios = require("axios");
const cheerio = require("cheerio");
const { dynamoDB } = require("./factory");
const { randomUUID } = require("node:crypto");
class Handler {
  static async main(event) {
    console.log("at", new Date().toISOString(), JSON.stringify(event, null, 2));

    const { data } = await axios.get(settings.APICommitMessageURL);

    const $ = cheerio.load(data);

    const [commitMessage] = $("#content").text().trim().split("\n");

    const params = {
      TableName: settings.DbTableName,
      Item: {
        commitMessage,
        id: randomUUID(),
        created_at: new Date().toISOString(),
      },
    };

    await dynamoDB.put(params).promise();

    return {
      statusCode: 200,
      message: commitMessage,
    };
  }
}

module.exports = {
  scheduler: Handler.main,
};
