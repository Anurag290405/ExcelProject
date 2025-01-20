require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const xlsx = require('xlsx');
const mysql = require('mysql2/promise');

const app = express();
const upload = multer({ dest: 'uploads/' });

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Enable CORS
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    console.log('File uploaded:', req.file);
    const filePath = path.join(__dirname, 'uploads', req.file.filename);
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    console.log('Excel data:', data);

    const connection = await db.getConnection();
    await connection.beginTransaction();

    const insertQuery = `INSERT INTO students (id, name, email, course) VALUES (?, ?, ?, ?)`;
    for (const row of data) {
      await connection.execute(insertQuery, [
        row.id,
        row.name,
        row.email,
        row.course,
      ]);
    }

    await connection.commit();
    connection.release();

    console.log('Data inserted successfully.');
    res.status(200).send('Data uploaded and saved to the database successfully!');
  } catch (error) {
    console.error('Error occurred during file upload:', error);
    res.status(500).send('An error occurred while processing the file.');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
