import * as dotenv from 'dotenv';
import fs from 'fs'
import path from 'path';
import AWS from 'aws-sdk';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

AWS.config.update({
    credentials: new AWS.Credentials(
        process.env.ACCESS_KEY,
        process.env.SECRET_ACCESS_KEY
    ),
    region: "ap-northeast-1"
});

const s3 = new AWS.S3();

export async function s3FileDownload(key, localfile) {
    try {
        const getObjectPromise = await s3.getObject({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key
        }, (err, data) => {
            if (err) {
                console.log(err);
                return;
            }
            const writer = fs.createWriteStream(path.join(__dirname, localfile));
            writer.on("finish", () => {
                console.log("success");
            })
            writer.write(data.Body);
            writer.end();
        }).promise();
        return getObjectPromise;
    } catch (err) {
        console.log(err);
    }
}

export async function s3FileUpload(key, localfile) {
    try {
        const promiseUpload = await s3.upload({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key,
            Body: fs.createReadStream(path.join(__dirname, localfile)),
            ContentType: "video/mp4"
        }, (err, data) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log(JSON.stringify(data));
        }).promise();
        return promiseUpload;
    } catch (err) {
        console.log(err);
    }
}

export function invokeFFmpegCommand(inFile, outFile) {
    try {
        const pathIn = path.join(__dirname, inFile);
        const pathOut = path.join(__dirname, outFile);
        const command = 'ffmpeg -i ' + pathIn + ' -vf scale=-1:540 ' + pathOut + ' -y';
        execSync(command);
    } catch (err) {
        console.log(err);
    }
}
