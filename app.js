require('dotenv').config();
const express = require('express');
const multer = require('multer');
const db = require('./models');
const imageRoutes = require('./routes/imageRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Middleware to parse JSON
app.use(express.json());

// Set up routes
app.use('/api/images', imageRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

db.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/`);
    });
}).catch(err => {
    console.error('Failed to sync database:', err);
});
