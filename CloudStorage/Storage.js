'use strict'

const { Storage } = require('@google-cloud/storage');
const GOOGLE_CLOUD_PROJECT = 'sprint-2-349120';
const GOOGLE_CLOUD_BUCKET = 'bucket-img-vehiculos';
const fs = require('fs');

const storage = new Storage({
    projectId: GOOGLE_CLOUD_PROJECT,
    keyFilename: './CloudStorage/key.json'
});

const handleFileUpload = async (file, placa) => {
    fs.appendFile('./CloudStorage/Images/' + placa + '.jpg', file, (err) => {
        if (err) throw err;
    })
    const url_cloud = await uploadFile('./CloudStorage/Images/' + placa + '.jpg', placa + '.jpg')
    return url_cloud
}


const uploadFile = async (fileName, fileDestination) => {
    await storage.bucket(GOOGLE_CLOUD_BUCKET).upload(fileName, {
        destination: fileDestination
    })

    fs.unlinkSync(fileName, (err) => {
        if (err) throw err;
    });

    return "https://storage.googleapis.com/bucket-img-vehiculos/" + fileDestination;
}

const deleteFile = async (fileName) => {
    await storage.bucket(GOOGLE_CLOUD_BUCKET).file(fileName).delete();
    return true;
}


module.exports = { uploadFile, handleFileUpload, deleteFile };