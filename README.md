# Image Processing System

## Setup

1. Install dependencies:

    ```bash
    npm install
    ```

2. Create a `.env` file with the following content:

    ```plaintext
    PORT=3000
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=password
    DB_NAME=image_processing
    ```

3. Set up the MySQL database:

    ```sql
    CREATE DATABASE image_processing;

    USE image_processing;

    CREATE TABLE requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        request_id VARCHAR(36) NOT NULL,
        status ENUM('pending', 'processing', 'completed') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        request_id VARCHAR(36) NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        input_url TEXT NOT NULL,
        output_url TEXT,
        status ENUM('pending', 'processing', 'completed') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (request_id) REFERENCES requests(request_id)
    );
    ```

4. Run the server:

    ```bash
    node app.js
    ```

## API Endpoints

### Upload CSV

- **URL:** `/api/images/upload`
- **Method:** `POST`
- **Body:** Form-data with a CSV file
- **Response:**
  - `200 OK` with `{ "requestId": "unique-request-id" }`

### Check Status

- **URL:** `/api/images/status/:requestId`
- **Method:** `GET`
- **Response:**
  - `200 OK` with `{ "requestId": "unique-request-id", "status": "pending/processing/completed" }`

### Webhook

- **URL:** `/api/images/webhook`
- **Method:** `POST`
- **Body:** JSON with `{ "requestId": "unique-request-id" }`
- **Response:**
  - `200 OK` with `Webhook received and processed.`

## Worker

- **Path:** `workers/imageWorker.js`
- **Function:** Processes images by reducing their quality and updates the database.
