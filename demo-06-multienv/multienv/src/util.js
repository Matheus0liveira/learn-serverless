const decoratorValidator = (fn, schema, argType) => {
  return async function (event) {
    const { value, error } = await schema.validate(event[argType], {
      abortEarly: true,
    });

    // Altered arguments
    event[argType] = value;
    if (!error) return fn.apply(this, arguments);

    return {
      statusCode: 422, //Unprocessable Content,
      body: error.message,
    };
  };
};

module.exports = {
  decoratorValidator,
};
