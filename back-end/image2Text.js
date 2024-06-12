const AWS = require('aws-sdk');

const textract = new AWS.Textract();

async function image2Text(fileString) {
  const base64Data = fileString.replace(/^data:image\/\w+;base64,/, "");
  const params = {
    Document: {
      /* directly providing image bytes */
      Bytes: Buffer.from(base64Data, 'base64')
    },
    FeatureTypes: ["TABLES", "FORMS"]
  };

  try {
    const data = await textract.analyzeDocument(params).promise();
    const result = data.Blocks;
    const text = result.filter(block => block.BlockType === "LINE").map(block => block.Text);
    const asString = text.join('\n');
    return asString;
  } catch (err) {
    console.log(err, err.stack);
    return null;
  }
}

module.exports = image2Text;