// index.js

const express = require('express');
const cors = require('cors'); // <-- Thêm dòng này
const connectDB = require('./connect');
const app = express();
const port = 8080;

app.use(cors()); // <-- Thêm dòng này

connectDB();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});