# my-media-api-study

## How to deploy the API server

1. Create S3 bucket

2. Create IAM user which has permission to access to the S3 bucket above

3. Create .env in the root folder as below
.env
```
S3_BUCKET_NAME=<Your S3 bucket>
ACCESS_KEY=<Access key of IAM user which has permission to access S3>
SECRET_ACCESS_KEY=<Secret for the access key>
```

4. Run Docker image

```
docker build . -t my-media-api
docker run -d -p 3001:3001 --name my-media-api my-media-api
```

5. Upload infile.mov to S3 bucket

For example: 
```
<Your S3 bucket>/public/input/infile.mov
```

6. Send POST request to the API server

```
curl -X POST -H "Content-Type: application/json" -d '{"key": "public/input/infile.mov", "newKey": "public/output/outfile.mov"}' https://localhost:3001/media
```

End Of Page