const AWS = require('aws-sdk');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const { ACCESS_KEY_ID, SECRET_ACCESS_KEY } = process.env;

AWS.config.update({ accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_ACCESS_KEY, region: 'us-west-2' });

// Create a new instance of Textract
const textract = new AWS.Textract();

// Read the image file into a byte array
const file = fs.readFileSync('./test.jpeg');

const params = {
  Document: {
    /* directly providing image bytes */
    Bytes: file
  },
FeatureTypes: ["TABLES", "FORMS"]
};

textract.analyzeDocument(params, function(err, data) {
  if (err){
    console.log(err, err.stack);
    return;
  }
  const result = data.Blocks;
  const text = result.filter(block => block.BlockType === "LINE").map(block => block.Text);
  const asString = text.join('\n');
    console.log(asString);
});