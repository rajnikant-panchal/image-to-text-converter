const Tesseract = require('tesseract.js');
const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });
const s3Config = {
  accessKeyId: "YOUR_ACCESS_KEY",
  secretAccessKey: "YOUR_SECRET_KEY",
 }
const s3 = new AWS.S3(s3Config);

exports.handler = async (event) => {

  const bucketName = "text-to-image-convert";
  const key = "2D_ECO.jpeg";

  try {
    const image = await s3.getObject({ Bucket: bucketName, Key: key }).promise();
    const { data: { text } } = await Tesseract.recognize(image.Body);
    console.log('Extracted Text:', text);

    return {
      statusCode: 200,
      body: {"data": JSON.stringify(text)},
    };
  } catch (error) {
    console.error('Error:', error);

    return {
      statusCode: 500,
      body: 'Image to text conversion failed',
    };
  }
};
