const axios = require('axios');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const db = require('../models');
const Image = require('../models/imageModel');
const Request = require('../models/requestModel');

process.on('message', async (message) => {
    const { id, requestId, productName, inputUrl } = message;

    try {
        const response = await axios({
            url: inputUrl,
            responseType: 'arraybuffer'
        });

        const inputBuffer = Buffer.from(response.data, 'binary');
        const outputBuffer = await sharp(inputBuffer).jpeg({ quality: 50 }).toBuffer();

        const outputFileName = `${uuidv4()}.jpg`;
        const outputPath = path.join(__dirname, '../processed', outputFileName);

        fs.writeFileSync(outputPath, outputBuffer);

        await Image.update(
            { outputUrl: `http://localhost:3000/processed/${outputFileName}`, status: 'completed' },
            { where: { id } }
        );

        const remaining = await Image.count({ where: { requestId, status: 'pending' } });

        if (remaining === 0) {
            await Request.update({ status: 'completed' }, { where: { requestId } });
        }

        process.send({
            requestId,
            productName,
            inputUrl,
            outputUrl: `http://localhost:3000/processed/${outputFileName}`
        });
    } catch (error) {
        console.error(`Error processing image: ${inputUrl}`, error);
    }
});
