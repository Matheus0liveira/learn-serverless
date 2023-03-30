const env = require("env-var");

const settings = {
  NODE_ENV: env.get("NODE_ENV").required().asString(),
  APICommitMessageURL: env.get("APICommitMessageURL").required().asUrlString(),
  DbTableName: env.get("DbTableName").required().asString(),
  DbWriteCapacityUnits: env.get("DbWriteCapacityUnits").required().asInt(),
  DbReadCapacityUnits: env.get("DbReadCapacityUnits").required().asInt(),
};

module.exports = {
  settings,
};
