const express = require('express');
const multer = require('multer');
const imageController = require('../controllers/imageController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), imageController.uploadCsv);
router.get('/status/:request_id', imageController.getStatus);
router.post('/webhook', imageController.handleWebhook);

module.exports = router;
