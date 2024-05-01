const express = require('express');
const app = express();
const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

// Middleware for parsing multipart/form-data
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/media");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
}); const upload = multer({
    storage: storage
});
// const upload = multer({ dest: 'uploads/' });

// Increase payload size limit
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    // You can also set other CORS headers as needed
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// FTP Configuration
const ftpConfig = {
    host: '172.20.44.117',
    user: 'vwakesahu',
    password: 'computer',
    secure: false
};

// // FTP Upload function
// async function uploadFileToFTP(localFilePath, fileName) {
//     const client = new ftp.Client();
//     try {
//         await client.access(ftpConfig);
//         await client.uploadFrom(localFilePath, fileName);
//         console.log('done')
//     } catch (error) { console.log(error) }
// }

// File Upload Route
app.post('/upload', upload.fields([{
    name: 'Video',
    maxCount: 1,
}]), async (req, res) => {
    try {
        if (!req.files) {
            return res.status(400).send('No file uploaded');
        }
        console.log(req.files)

        const videoFile = req.files.Video;
        console.log(
            videoFile
        )
        // await uploadFileToFTP(filePath, fileName);

        // Delete uploaded file from server after upload
        // fs.unlinkSync(videoFile);

        res.status(200).send('File uploaded successfully');
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).send('Error uploading file');
    }
});

app.listen(8000, () => {
    console.log('Server is running on port 3001');
});
