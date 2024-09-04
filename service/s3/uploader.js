const { uuid } = require('uuidv4');
const FileType = require('file-type')
const {S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET_NAME} = require('../../config.json')

const AWS = require("aws-sdk");
const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    credentials: {
        accessKeyId: S3_ACCESS_KEY,
        secretAccessKey: S3_SECRET_KEY,
    }
});

const uploader = async (fileBase64Str, filePath = '') => {
    let buffer = Buffer.from(fileBase64Str, 'base64')
    let type = await FileType.fromBuffer(buffer)
    let fileName = `${filePath}${uuid()}.${type.ext}`

    await new Promise((resolve, reject) => {
        s3.upload({
            ACL: 'public-read',
            Bucket: S3_BUCKET_NAME,
            Key: fileName,
            Body: buffer,
            ContentEncoding: 'base64',
            ContentType: type.mime
        }, (err, data) => {
            if (err) {
                reject(err)
            } if (data) {
                resolve(data.Location)
            }
        });
    })

    return fileName
}

module.exports = uploader