const AWS = require('aws-sdk');

const textract = new AWS.Textract();

async function image2Text(fileString) {
  const params = {
    Document: {
      /* directly providing image bytes */
      Bytes: fileString
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