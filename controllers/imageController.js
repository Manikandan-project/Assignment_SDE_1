const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const db = require('../models');
const Request = require('../models/requestModel');
const Image = require('../models/imageModel');


exports.uploadCsv = async (req, res, next) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send('No file uploaded.');
    }

    const requestId = uuidv4();

    try {
        const csvData = fs.readFileSync(file.path, 'utf8');
        const lines = csvData.split('\n').slice(1); // Skip header

        for (const line of lines) {
            if (!line) continue;
            const [request_id, productName, inputUrls] = line.split(',');
            const urls = inputUrls.split('|');

            for (const url of urls) {
                await Image.create({
                    request_id,
                    product_name: productName.trim(),
                    input_url: url.trim()
                });
            }
        }

        await Request.create({ requestId });

        fs.unlinkSync(file.path); // Remove the file after processing

        res.json({ requestId });
    } catch (error) {
        next(error);
    }
};

exports.getStatus = async (req, res, next) => {
    const { request_id } = req.params;

    try {
        const request = await Request.findOne({ where: { request_id } });

        if (!request) {
            return res.status(404).send('Request ID not found.');
        }

        res.json({ request_id, status: request.status });
    } catch (error) {
        next(error);
    }
};

exports.handleWebhook = async (req, res, next) => {
    const { request_id } = req.body;

    try {
        const images = await Image.findAll({ where: { request_id } });

        const outputCsvData = images.map(row => `${row.id},${row.productName},${row.inputUrl},${row.outputUrl}`).join('\n');
        fs.writeFileSync(path.join(__dirname, `../../output_${request_id}.csv`), outputCsvData);

        res.status(200).send('Webhook received and processed.');
    } catch (error) {
        next(error);
    }
};
