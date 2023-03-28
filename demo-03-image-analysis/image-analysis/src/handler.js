const { get } = require("axios");

module.exports = class Handler {
  constructor({ rekoSvc, translatorSvc }) {
    this.rekoSvc = rekoSvc;
    this.translatorSvc = translatorSvc;
  }

  async detectImageLabels(buffer) {
    const result = await this.rekoSvc
      .detectLabels({
        Image: {
          Bytes: buffer,
        },
      })
      .promise();

    const workingItems = result.Labels.filter(
      ({ Confidence }) => Confidence > 80
    );
    const names = workingItems.map(({ Name }) => Name).join(" and ");

    return { workingItems, names };
  }

  async getImageBuffer(imageUrl) {
    const response = await get(imageUrl, {
      responseType: "arraybuffer",
    });

    return Buffer.from(response.data, "base64");
  }

  async translateText(Text) {
    const params = {
      SourceLanguageCode: "en",
      TargetLanguageCode: "pt",
      Text,
    };

    const { TranslatedText } = await this.translatorSvc
      .translateText(params)
      .promise();

    return TranslatedText.split(" e ");
  }

  formatTextResults(texts, workingItems) {
    const finalText = [];
    for (const indexText in texts) {
      const nameInPortuguese = texts[indexText];
      const confidence = workingItems[indexText].Confidence;
      finalText.push(
        `${confidence.toFixed(2)}% de ser do tipo ${nameInPortuguese}`
      );
    }

    return finalText.join("\n");
  }

  async main(event) {
    try {
      const { imageUrl } = event.queryStringParameters;

      if (!imageUrl) {
        return { statusCode: 400, body: "an IMG is required" };
      }

      const buffer = await this.getImageBuffer(imageUrl);
      const { names, workingItems } = await this.detectImageLabels(buffer);

      const texts = await this.translateText(names);

      const finalTexts = this.formatTextResults(texts, workingItems);
      return {
        statusCode: 200,
        body: "A imagem tem\n".concat(finalTexts),
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        body: "Internal Server Error",
      };
    }
  }
};
